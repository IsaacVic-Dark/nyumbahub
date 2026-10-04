<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubEstateRatingRequest;
use App\Http\Requests\UpdateSubEstateRatingRequest;
use App\Http\Resources\SubEstateRatingResource;
use App\Models\SubEstate;
use App\Models\SubEstateRating;

class SubEstateRatingController extends Controller
{
    public function index(SubEstate $subEstate)
    {
        return SubEstateRatingResource::collection($subEstate->ratings()->paginate());
    }

    public function store(StoreSubEstateRatingRequest $request, SubEstate $subEstate)
    {
        // One editable rating per user per sub-estate (README §4.6) —
        // upsert instead of a plain create so a resubmission edits in place.
        $rating = $subEstate->ratings()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $request->validated()
        );

        return new SubEstateRatingResource($rating);
    }

    public function show(SubEstateRating $rating)
    {
        return new SubEstateRatingResource($rating);
    }

    public function update(UpdateSubEstateRatingRequest $request, SubEstateRating $rating)
    {
        $rating->update($request->validated());

        return new SubEstateRatingResource($rating);
    }

    public function destroy(SubEstateRating $rating)
    {
        $this->authorize('delete', $rating);

        $rating->delete();

        return response()->noContent();
    }
}
