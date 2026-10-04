<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingConditionRequest;
use App\Http\Resources\ListingConditionResource;
use App\Models\Listing;

// Singleton resource (1:1 with Listing) — no index/destroy: a listing either
// has a condition report or it doesn't, and it's replaced via upsert, not
// deleted independently of its parent listing.
class ListingConditionController extends Controller
{
    public function show(Listing $listing)
    {
        return new ListingConditionResource($listing->condition()->firstOrFail());
    }

    public function store(StoreListingConditionRequest $request, Listing $listing)
    {
        $condition = $listing->condition()->updateOrCreate([], $request->validated());

        return new ListingConditionResource($condition);
    }
}
