<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingReviewRequest;
use App\Http\Resources\ListingReviewResource;
use App\Models\Listing;

// Singleton resource (1:1 with Listing) — same shape as ListingConditionController.
class ListingReviewController extends Controller
{
    public function show(Listing $listing)
    {
        $review = $listing->review;

        return $review
            ? new ListingReviewResource($review)
            : response()->json(['data' => null]);
    }

    public function store(StoreListingReviewRequest $request, Listing $listing)
    {
        $review = $listing->review()->updateOrCreate([], $request->validated());

        return new ListingReviewResource($review);
    }
}
