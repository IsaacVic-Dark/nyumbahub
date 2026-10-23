<?php

namespace App\Http\Controllers\Api;

use App\Enums\ListingStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ListingResource;
use App\Models\CommunityConfirmation;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/** Everything about "me": profile numbers, my reports, my confirmations, privacy. */
class MeController extends Controller
{
    private const PRIVACY_DEFAULTS = [
        'hide_public_name' => false,
        'hide_profile_photo' => false,
        'allow_questions' => true,
        'messages_disabled_after' => null,
        'directions_verified_only' => true,
        'show_activity_status' => false,
    ];

    private function privacy($user): array
    {
        return array_merge(self::PRIVACY_DEFAULTS, $user->privacy_settings ?? []);
    }

    public function profile(Request $request)
    {
        $user = $request->user();

        $reports = $user->listings()->where('status', '!=', ListingStatus::Removed->value)->count();
        $active = $user->listings()->whereIn('status', \App\Support\ListingFilters::publicStatuses())->count();
        $confirmations = $user->communityConfirmations()->count();
        $distinctBuildings = CommunityConfirmation::query()
            ->where('community_confirmations.user_id', $user->id)
            ->join('listings', 'listings.id', '=', 'community_confirmations.listing_id')
            ->distinct()->count('listings.building_id');
        $helpful = DB::table('confirmation_helpful_votes')
            ->join('community_confirmations', 'community_confirmations.id', '=', 'confirmation_helpful_votes.community_confirmation_id')
            ->where('community_confirmations.user_id', $user->id)->count();
        $reviews = $user->listings()->whereHas('review')->count();

        $levels = [
            ['New Member', 'Can browse and submit confirmations.', true],
            ['Active Contributor', 'Posted at least one accepted report.', $reports >= 1],
            ['Trusted Tenant', 'Verified identity and consistently accurate reports.', $reports >= 1 && ($user->national_id_verified_at !== null || $user->is_verified_contributor)],
            ['Community Verifier', 'High-weight confirmations across many buildings.', $distinctBuildings >= 10],
            ['NyumbaHub Champion', 'Long-term, exceptional community accuracy.', $user->trust_score >= 90 && $user->created_at->lt(now()->subYear())],
        ];
        $achieved = collect($levels)->filter(fn ($l) => $l[2]);

        return response()->json(['data' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'joined_at' => $user->created_at,
            'trust_level' => $achieved->last()[0],
            'verification' => [
                'phone' => $user->phone_verified_at !== null,
                'identity' => $user->national_id_verified_at !== null,
                'contributor' => (bool) $user->is_verified_contributor,
            ],
            'metrics' => [
                'reports_posted' => $reports,
                'confirmations' => $confirmations,
                'helpful_votes' => $helpful,
                'trust_score' => $user->trust_score,
                'reports_active' => $active,
                'saved_homes' => $user->savedListings()->count(),
                'search_alerts' => $user->searchAlerts()->count(),
                'reviews' => $reviews,
            ],
            'trust_levels' => collect($levels)->map(fn ($l) => ['title' => $l[0], 'description' => $l[1], 'achieved' => $l[2]])->values(),
            'privacy' => $this->privacy($user),
        ]]);
    }

    /** My own reports, every status (so archived / removed ones are visible to their owner). */
    public function listings(Request $request)
    {
        $query = Listing::query()->forDisplay($request->user())
            ->where('listings.user_id', $request->user()->id)
            ->latest('listings.id');

        return ListingResource::collection($query->paginate(24));
    }

    public function confirmations(Request $request)
    {
        $items = $request->user()->communityConfirmations()
            ->with('listing.building.subEstate.estate')
            ->latest('id')->limit(100)->get()
            ->map(function (CommunityConfirmation $c) {
                $estate = $c->listing?->building?->subEstate?->estate;

                return [
                    'id' => $c->id,
                    'type' => $c->type?->value,
                    'note' => $c->note,
                    'reported_rent_amount' => $c->reported_rent_amount !== null ? (float) $c->reported_rent_amount : null,
                    'created_at' => $c->created_at,
                    'listing_id' => $c->listing_id,
                    'listing_title' => $c->listing?->title($estate?->name, $c->listing?->building?->subEstate?->name),
                ];
            });

        return response()->json(['data' => $items]);
    }

    public function updatePrivacy(Request $request)
    {
        $data = $request->validate([
            'hide_public_name' => ['sometimes', 'boolean'],
            'hide_profile_photo' => ['sometimes', 'boolean'],
            'allow_questions' => ['sometimes', 'boolean'],
            'messages_disabled_after' => ['sometimes', 'nullable', 'date'],
            'directions_verified_only' => ['sometimes', 'boolean'],
            'show_activity_status' => ['sometimes', 'boolean'],
        ]);

        $user = $request->user();
        $user->privacy_settings = array_merge($user->privacy_settings ?? [], $data);
        $user->save();

        return response()->json(['data' => $this->privacy($user)]);
    }
}
