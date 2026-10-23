<?php

namespace App\Http\Controllers\Api;

use App\Enums\ConfirmationType;
use App\Enums\ListingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommunityConfirmationRequest;
use App\Http\Resources\CommunityConfirmationResource;
use App\Models\Listing;
use App\Models\Setting;
use App\Models\CommunityConfirmation;
use App\Services\Notifier;
use Illuminate\Http\Request;

// Index/store only — a confirmation is an append-only workflow event
// (README §4.5), never edited or deleted by the person who submitted it.
class CommunityConfirmationController extends Controller
{
    public function index(Request $request, Listing $listing)
    {
        $viewer = $request->user('sanctum');

        return CommunityConfirmationResource::collection(
            $listing->confirmations()
                ->with('user:id,is_verified_contributor')
                ->withCount('helpfulVoters')
                ->when($viewer, fn ($q) => $q->withExists([
                    'helpfulVoters as is_helpful' => fn ($v) => $v->where('users.id', $viewer->id),
                ]))
                ->latest('id')
                ->paginate(20)
        );
    }

    /** Toggle a "Helpful" vote on someone else's confirmation. */
    public function toggleHelpful(Request $request, CommunityConfirmation $confirmation)
    {
        $user = $request->user();
        abort_if($confirmation->user_id === $user->id, 403, 'You cannot vote on your own confirmation.');

        $result = $confirmation->helpfulVoters()->toggle($user->id);
        $added = count($result['attached']) > 0;

        if ($added) {
            $confirmation->loadMissing('listing');
            Notifier::send(
                $confirmation->user_id, 'you', 'Someone found your confirmation helpful',
                Notifier::label($confirmation->listing), $confirmation->listing, '👍',
            );
        }

        return response()->json([
            'is_helpful' => $added,
            'helpful_count' => $confirmation->helpfulVoters()->count(),
        ]);
    }

    public function store(StoreCommunityConfirmationRequest $request, Listing $listing)
    {
        $this->authorize('create', [CommunityConfirmation::class, $listing]);

        $confirmation = $listing->confirmations()->create($request->validated() + [
            'user_id' => $request->user()->id,
        ]);

        $this->applyWorkflowEffect($listing, $confirmation);

        // Tell the reporter, and anyone who saved the listing, about a new rent figure.
        Notifier::send($listing->user_id, 'you', 'Someone confirmed your report', Notifier::label($listing), $listing, '✅', $request->user()->id);
        if ($confirmation->type === ConfirmationType::RentChanged) {
            Notifier::toSavers(
                $listing, 'Rent was updated on a saved report',
                Notifier::label($listing).': now KES '.number_format((float) $confirmation->reported_rent_amount),
                '💰', $request->user()->id,
            );
        }

        return new CommunityConfirmationResource($confirmation->load('user:id,is_verified_contributor'));
    }

    /**
     * The lightweight version of README §4.5's state machine. A background
     * job should still run periodically for the N-confirmation thresholds
     * (§4.5.1, §4.5.3) since those depend on aggregating across many rows —
     * this only handles the single-confirmation-triggers-a-transition cases.
     */
    private function applyWorkflowEffect(Listing $listing, $confirmation): void
    {
        $extensionDays = (int) Setting::get('confirmation_extension_days', 7);

        match ($confirmation->type) {
            ConfirmationType::StillVacant => (function () use ($listing, $extensionDays) {
                $listing->update([
                    'confirmed_count' => $listing->confirmed_count + 1,
                    'last_confirmed_at' => now(),
                    'expires_at' => now()->addDays($extensionDays),
                ]);
                $listing->transitionTo(ListingStatus::CommunityConfirmedVacant, bySystem: true, reason: 'Still vacant confirmation');
            })(),
            ConfirmationType::Occupied => $listing->status === ListingStatus::PossiblyOccupied
                ? null
                : $listing->transitionTo(ListingStatus::PossiblyOccupied, bySystem: true, reason: 'Unverified occupancy report'),
            ConfirmationType::NewTenantMovedIn => $listing->status === ListingStatus::OccupiedPendingConfirmation
                ? null
                : $listing->transitionTo(ListingStatus::OccupiedPendingConfirmation, bySystem: true, reason: 'Verified claim + evidence submitted'),
            default => null, // rent_changed / building_not_found / information_inaccurate are handled by a job or the moderation queue
        };
    }
}
