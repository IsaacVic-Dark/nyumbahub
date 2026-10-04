<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResolveDuplicateFlagRequest;
use App\Http\Requests\StoreDuplicateFlagRequest;
use App\Http\Resources\DuplicateFlagResource;
use App\Models\DuplicateFlag;
use App\Models\Listing;

// No plain `update`/`destroy` — resolution is its own action so the
// confirmed/rejected decision is explicit, not a generic field edit.
class DuplicateFlagController extends Controller
{
    public function index(Listing $listing)
    {
        return DuplicateFlagResource::collection($listing->duplicateFlags()->paginate());
    }

    public function store(StoreDuplicateFlagRequest $request, Listing $listing)
    {
        $flag = $listing->duplicateFlags()->create($request->validated() + [
            'flagged_by_user_id' => $request->user()->id,
        ]);

        return new DuplicateFlagResource($flag);
    }

    public function show(DuplicateFlag $duplicateFlag)
    {
        return new DuplicateFlagResource($duplicateFlag);
    }

    public function resolve(ResolveDuplicateFlagRequest $request, DuplicateFlag $duplicateFlag)
    {
        $duplicateFlag->update(['status' => $request->validated('status')]);

        return new DuplicateFlagResource($duplicateFlag);
    }
}
