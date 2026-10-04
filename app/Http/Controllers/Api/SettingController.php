<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSettingRequest;
use App\Http\Resources\SettingResource;
use App\Models\Setting;

// No store/destroy — the set of config keys is fixed by SettingsSeeder;
// admins only ever read and update values, never add/remove keys via the API.
class SettingController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Setting::class);

        return SettingResource::collection(Setting::orderBy('key')->get());
    }

    public function update(UpdateSettingRequest $request, string $key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();

        Setting::set($key, $request->validated('value'), $request->validated('description') ?? $setting->description);

        return new SettingResource($setting->fresh());
    }
}
