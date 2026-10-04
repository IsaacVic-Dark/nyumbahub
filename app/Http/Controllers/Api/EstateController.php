<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEstateRequest;
use App\Http\Requests\UpdateEstateRequest;
use App\Http\Resources\EstateResource;
use App\Models\Estate;
use App\Models\Town;

class EstateController extends Controller
{
    public function index(Town $town)
    {
        return EstateResource::collection($town->estates()->paginate());
    }

    public function store(StoreEstateRequest $request, Town $town)
    {
        $estate = $town->estates()->create($request->validated());

        return new EstateResource($estate);
    }

    public function show(Estate $estate)
    {
        return new EstateResource($estate);
    }

    public function update(UpdateEstateRequest $request, Estate $estate)
    {
        $estate->update($request->validated());

        return new EstateResource($estate);
    }

    public function destroy(Estate $estate)
    {
        $this->authorize('delete', $estate);

        $estate->delete();

        return response()->noContent();
    }
}
