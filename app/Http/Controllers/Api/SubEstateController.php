<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubEstateRequest;
use App\Http\Requests\UpdateSubEstateRequest;
use App\Http\Resources\SubEstateResource;
use App\Models\Estate;
use App\Models\SubEstate;

class SubEstateController extends Controller
{
    public function index(Estate $estate)
    {
        return SubEstateResource::collection($estate->subEstates()->paginate());
    }

    public function store(StoreSubEstateRequest $request, Estate $estate)
    {
        $subEstate = $estate->subEstates()->create($request->validated());

        return new SubEstateResource($subEstate);
    }

    public function show(SubEstate $subEstate)
    {
        return new SubEstateResource($subEstate);
    }

    public function update(UpdateSubEstateRequest $request, SubEstate $subEstate)
    {
        $subEstate->update($request->validated());

        return new SubEstateResource($subEstate);
    }

    public function destroy(SubEstate $subEstate)
    {
        $this->authorize('delete', $subEstate);

        $subEstate->delete();

        return response()->noContent();
    }
}
