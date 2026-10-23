<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingMediaRequest;
use App\Http\Resources\ListingMediaResource;
use App\Models\Listing;
use App\Models\ListingMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class ListingMediaController extends Controller
{
    public function index(Request $request, Listing $listing)
    {
        if (! $request->user('sanctum')) {
            // Guests: thumbnail only
            return ListingMediaResource::collection($listing->media()->oldest('id')->limit(1)->get());
        }

        return ListingMediaResource::collection($listing->media()->oldest('id')->paginate(50));
    }

    public function store(StoreListingMediaRequest $request, Listing $listing)
    {
        $data = Arr::except($request->validated(), ['file']);

        if ($request->hasFile('file')) {
            // Public disk -> storage/app/public/listings/{id}/..., served at /storage/... (php artisan storage:link)
            $data['file_path'] = $request->file('file')->store("listings/{$listing->id}", 'public');
        }

        $media = $listing->media()->create($data);

        return new ListingMediaResource($media);
    }

    public function destroy(ListingMedia $media)
    {
        $this->authorize('delete', $media);

        $media->delete();

        return response()->noContent();
    }
}
