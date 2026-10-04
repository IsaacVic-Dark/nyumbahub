<?php

namespace App\Http\Controllers\Api;

use App\Enums\ConfirmationType;
use App\Enums\ListingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommunityConfirmationRequest;
use App\Http\Resources\CommunityConfirmationResource;
use App\Models\Listing;
use App\Models\Setting;

// Index/store only — a confirmation is an append-only workflow event
// (README §4.5), never edited or deleted by the person who submitted it.
class CommunityConfirmationController extends Controller
{
    public function index(Listing $listing)
    {
        return CommunityConfirmationResource::collection($listing->confirmations()->paginate());
    }

    public function store(StoreCommunityConfirmationRequest $request, Listing $listing)
    {
        $confirmation = $listing->confirmations()->create($request->validated() + [
            'user_id' => $request->user()->id,
        ]);

        $this->applyWorkflowEffect($listing, $confirmation);

        return new CommunityConfirmationResource($confirmation);
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
