<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SearchAlertResource;
use App\Models\SearchAlert;
use Illuminate\Http\Request;

class SearchAlertController extends Controller
{
    private function rules(bool $creating = true): array
    {
        $req = $creating ? 'required' : 'sometimes';

        return [
            'area' => ['nullable', 'string', 'max:255'],
            'max_rent' => ['nullable', 'numeric', 'min:0'],
            'house_types' => ['nullable', 'array', 'max:10'],
            'house_types.*' => ['string', 'max:60'],
            'bedrooms' => ['nullable', 'integer', 'between:0,10'],
            'bedrooms_plus' => ['sometimes', 'boolean'],
            'amenities' => ['nullable', 'array', 'max:10'],
            'amenities.*' => ['in:water,parking,stage,gated,internet'],
            'frequency' => [$req, 'in:instant,daily,weekly'],
            'channels' => ['nullable', 'array', 'max:4'],
            'channels.*' => ['in:push,email,sms,whatsapp'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function index(Request $request)
    {
        $alerts = $request->user()->searchAlerts()->latest('id')->get()
            ->each(fn (SearchAlert $a) => $a->matches_count = $a->matchesQuery()->count());

        return SearchAlertResource::collection($alerts);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules());
        abort_if(
            empty($data['area']) && empty($data['max_rent']) && empty($data['house_types']),
            422, 'Add an area, a maximum rent or a property type so the alert has something to match.',
        );

        $alert = $request->user()->searchAlerts()->create($data);
        $alert->matches_count = $alert->matchesQuery()->count();

        return (new SearchAlertResource($alert))->response()->setStatusCode(201);
    }

    public function update(Request $request, SearchAlert $searchAlert)
    {
        abort_unless($searchAlert->user_id === $request->user()->id, 403);

        $searchAlert->update($request->validate($this->rules(false)));
        $searchAlert->matches_count = $searchAlert->matchesQuery()->count();

        return new SearchAlertResource($searchAlert);
    }

    public function destroy(Request $request, SearchAlert $searchAlert)
    {
        abort_unless($searchAlert->user_id === $request->user()->id, 403);

        $searchAlert->delete();

        return response()->noContent();
    }
}
