<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingMediaRequest;
use App\Http\Resources\ListingMediaResource;
use App\Models\Listing;
use App\Models\ListingMedia;

// No `update` — media is uploaded or removed, never edited in place.
class ListingMediaController extends Controller
{
    public function index(Listing $listing)
    {
        return ListingMediaResource::collection($listing->media()->paginate());
    }

    public function store(StoreListingMediaRequest $request, Listing $listing)
    {
        $media = $listing->media()->create($request->validated());

        return new ListingMediaResource($media);
    }

    public function destroy(ListingMedia $media)
    {
        $this->authorize('delete', $media);

        $media->delete();

        return response()->noContent();
    }
}
