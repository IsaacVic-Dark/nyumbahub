<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBuildingRequest;
use App\Http\Requests\UpdateBuildingRequest;
use App\Http\Resources\BuildingResource;
use App\Models\Building;
use App\Models\SubEstate;

class BuildingController extends Controller
{
    public function index(SubEstate $subEstate)
    {
        return BuildingResource::collection($subEstate->buildings()->paginate());
    }

    public function store(StoreBuildingRequest $request, SubEstate $subEstate)
    {
        $building = $subEstate->buildings()->create($request->validated());

        return new BuildingResource($building);
    }

    public function show(Building $building)
    {
        return new BuildingResource($building);
    }

    public function update(UpdateBuildingRequest $request, Building $building)
    {
        $building->update($request->validated());

        return new BuildingResource($building);
    }

    public function destroy(Building $building)
    {
        $this->authorize('delete', $building);

        $building->delete();

        return response()->noContent();
    }
}
