<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCountyRequest;
use App\Http\Requests\UpdateCountyRequest;
use App\Http\Resources\CountyResource;
use App\Models\County;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CountyController extends Controller
{
    public function index(Request $request)
    {
        $counties = County::query()
            ->search($request->query('search'))
            ->withCount('towns')
            ->orderBy('name')
            ->paginate();

        return CountyResource::collection($counties);
    }

    public function store(StoreCountyRequest $request)
    {
        $county = County::create($request->validated());

        return new CountyResource($county->loadCount('towns'));
    }

    public function show(County $county)
    {
        return new CountyResource($county->loadCount('towns'));
    }

    public function update(UpdateCountyRequest $request, County $county)
    {
        $county->update($request->validated());

        return new CountyResource($county->loadCount('towns'));
    }

    public function destroy(County $county)
    {
        $this->authorize('delete', $county);

        $county->delete(); // soft delete

        return response()->noContent();
    }

    public function restore(County $county)
    {
        $this->authorize('restore', $county);

        if (! $county->trashed()) {
            return new CountyResource($county->loadCount('towns'));
        }

        // Validation ignores trashed rows, so an active county may have taken
        // this name/code since deletion. Block the restore if so.
        $errors = [];
        if (County::where('name', $county->name)->exists()) {
            $errors['name'] = 'An active county with this name already exists.';
        }
        if ($county->code && County::where('code', $county->code)->exists()) {
            $errors['code'] = 'An active county with this code already exists.';
        }
        if ($errors) {
            throw ValidationException::withMessages($errors);
        }

        $county->restore();

        return new CountyResource($county->loadCount('towns'));
    }
}