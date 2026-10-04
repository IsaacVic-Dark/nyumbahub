<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTownRequest;
use App\Http\Requests\UpdateTownRequest;
use App\Http\Resources\TownResource;
use App\Models\County;
use App\Models\Town;

// Shallow nesting: index/store are scoped under the parent county
// (/counties/{county}/towns), show/update/destroy operate directly on the
// resource (/towns/{town}) since they don't need the parent in the URL.
class TownController extends Controller
{
    public function index(County $county)
    {
        return TownResource::collection($county->towns()->paginate());
    }

    public function store(StoreTownRequest $request, County $county)
    {
        $town = $county->towns()->create($request->validated());

        return new TownResource($town);
    }

    public function show(Town $town)
    {
        return new TownResource($town);
    }

    public function update(UpdateTownRequest $request, Town $town)
    {
        $town->update($request->validated());

        return new TownResource($town);
    }

    public function destroy(Town $town)
    {
        $this->authorize('delete', $town);

        $town->delete();

        return response()->noContent();
    }
}
