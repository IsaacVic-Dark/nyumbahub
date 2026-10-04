<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Http\Resources\ListingResource;
use App\Models\Building;
use App\Models\Listing;

class ListingController extends Controller
{
    public function index(Building $building)
    {
        return ListingResource::collection(
            $building->listings()->with(['reporter', 'condition', 'review', 'media'])->paginate()
        );
    }

    public function store(StoreListingRequest $request, Building $building)
    {
        $listing = $building->listings()->create($request->validated() + [
            'user_id' => $request->user()->id,
        ]);

        // Establishes the initial row in listing_status_histories (README §4.7)
        $listing->statusHistories()->create([
            'from_status' => null,
            'to_status' => $listing->status,
            'changed_by_user_id' => $request->user()->id,
            'reason' => 'Listing created',
        ]);

        return new ListingResource($listing);
    }

    public function show(Listing $listing)
    {
        return new ListingResource($listing->load(['reporter', 'condition', 'review', 'media']));
    }

    public function update(UpdateListingRequest $request, Listing $listing)
    {
        $listing->update($request->validated());

        return new ListingResource($listing);
    }

    public function destroy(Listing $listing)
    {
        $this->authorize('delete', $listing);

        $listing->delete();

        return response()->noContent();
    }
}
