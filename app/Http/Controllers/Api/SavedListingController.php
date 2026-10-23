<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SavedListingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Listing::query()->forDisplay($user)
            ->whereIn('listings.id', $user->savedListings()->select('listings.id'))
            ->orderByDesc(
                DB::table('saved_listings')->select('created_at')
                    ->whereColumn('saved_listings.listing_id', 'listings.id')
                    ->where('saved_listings.user_id', $user->id)->limit(1)
            );

        return ListingResource::collection($query->paginate((int) $request->query('per_page', 24)));
    }

    public function store(Request $request, Listing $listing)
    {
        $request->user()->savedListings()->syncWithoutDetaching([$listing->id]);

        return response()->json(['is_saved' => true], 201);
    }

    public function destroy(Request $request, Listing $listing)
    {
        $request->user()->savedListings()->detach($listing->id);

        return response()->json(['is_saved' => false]);
    }
}
