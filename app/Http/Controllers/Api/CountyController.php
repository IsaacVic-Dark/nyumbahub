<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCountyRequest;
use App\Http\Requests\UpdateCountyRequest;
use App\Http\Resources\CountyResource;
use App\Models\County;

class CountyController extends Controller
{
    public function index()
    {
        return CountyResource::collection(County::paginate());
    }

    public function store(StoreCountyRequest $request)
    {
        $county = County::create($request->validated());

        return new CountyResource($county);
    }

    public function show(County $county)
    {
        return new CountyResource($county);
    }

    public function update(UpdateCountyRequest $request, County $county)
    {
        $county->update($request->validated());

        return new CountyResource($county);
    }

    public function destroy(County $county)
    {
        $this->authorize('delete', $county);

        $county->delete();

        return response()->noContent();
    }
}
