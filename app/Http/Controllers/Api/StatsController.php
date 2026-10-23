<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunityConfirmation;
use App\Models\Estate;
use App\Models\Listing;
use App\Models\User;
use App\Support\ListingFilters;
use Illuminate\Support\Facades\Cache;

class StatsController extends Controller
{
    /** Public home-page numbers (cached for a minute). */
    public function public()
    {
        return response()->json(['data' => Cache::remember('stats:public', 60, fn () => [
            'active_reports' => Listing::whereIn('status', ListingFilters::publicStatuses())->count(),
            'confirmations_this_week' => CommunityConfirmation::where('created_at', '>=', now()->subWeek())->count(),
            'verified_contributors' => User::where('is_verified_contributor', true)->count(),
            'neighbourhoods_covered' => Estate::whereHas('subEstates.buildings.listings', fn ($q) => $q
                ->whereIn('status', ListingFilters::publicStatuses()))->count(),
        ])]);
    }
}
