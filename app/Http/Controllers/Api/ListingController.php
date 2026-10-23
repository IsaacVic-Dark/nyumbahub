<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Http\Resources\ListingResource;
use App\Models\Building;
use App\Models\Listing;
use App\Models\SearchAlert;
use App\Models\Setting;
use App\Support\ListingFilters;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    /**
     * GET /api/listings — public search (Explore, Map, home page, saved ids).
     * See App\Support\ListingFilters for every supported query parameter.
     */
    public function search(Request $request)
    {
        $request->validate([
            'per_page' => ['sometimes', 'integer', 'between:1,100'],
            'sort' => ['sometimes', 'in:recent,confirmed,rent_asc,rent_desc,rating,saved,nearest'],
            'lat' => ['sometimes', 'numeric', 'between:-90,90'],
            'lng' => ['sometimes', 'numeric', 'between:-180,180'],
        ]);

        $query = Listing::query()->forDisplay($request->user('sanctum'));
        ListingFilters::apply($query, $request->query());
        ListingFilters::sort(
            $query,
            $request->query('sort'),
            $request->filled('lat') ? (float) $request->query('lat') : null,
            $request->filled('lng') ? (float) $request->query('lng') : null,
        );

        return ListingResource::collection($query->paginate((int) $request->query('per_page', 12))->withQueryString());
    }

    public function index(Request $request, Building $building)
    {
        $query = Listing::query()->forDisplay($request->user('sanctum'))
            ->where('building_id', $building->id)
            ->whereIn('listings.status', ListingFilters::publicStatuses())
            ->latest('listings.id');

        return ListingResource::collection($query->paginate());
    }

    /** Similar reports: same estate first, then same town. */
    public function similar(Request $request, Listing $listing)
    {
        $listing->loadMissing('building.subEstate.estate');
        $estateId = $listing->building?->subEstate?->estate_id;
        $townId = $listing->building?->subEstate?->estate?->town_id;

        $base = fn () => Listing::query()->forDisplay($request->user('sanctum'))
            ->whereKeyNot($listing->id)
            ->whereIn('listings.status', ListingFilters::publicStatuses());

        $items = $estateId
            ? $base()->whereHas('building.subEstate', fn ($s) => $s->where('estate_id', $estateId))->latest('listings.id')->limit(3)->get()
            : collect();

        if ($items->count() < 3 && $townId) {
            $more = $base()->whereNotIn('listings.id', $items->pluck('id'))
                ->whereHas('building.subEstate.estate', fn ($e) => $e->where('town_id', $townId))
                ->latest('listings.id')->limit(3 - $items->count())->get();
            $items = $items->concat($more);
        }

        return ListingResource::collection($items);
    }

    public function store(StoreListingRequest $request, Building $building)
    {
        $data = $request->validated();
        $data['status'] = $data['status'] ?? 'upcoming_vacancy';
        $data['bedrooms'] = $data['bedrooms'] ?? Listing::bedroomsFromType($data['house_type']);
        $data['expires_at'] = now()->addDays((int) Setting::get('archive_expired_days', 30));

        $listing = $building->listings()->create($data + [
            'user_id' => $request->user()->id,
        ]);

        // Establishes the initial row in listing_status_histories (README §4.7)
        $listing->statusHistories()->create([
            'from_status' => null,
            'to_status' => $listing->status,
            'changed_by_user_id' => $request->user()->id,
            'reason' => 'Listing created',
        ]);

        SearchAlert::notifyMatchesFor($listing);

        return new ListingResource($this->loadForShow($listing->id, $request));
    }

    public function show(Request $request, Listing $listing)
    {
        $this->authorize('view', $listing);

        return new ListingResource($this->loadForShow($listing->id, $request));
    }

    public function update(UpdateListingRequest $request, Listing $listing)
    {
        $listing->update($request->validated());

        return new ListingResource($this->loadForShow($listing->id, $request));
    }

    public function destroy(Listing $listing)
    {
        $this->authorize('delete', $listing);

        $listing->delete();

        return response()->noContent();
    }

    private function loadForShow(int $id, Request $request): Listing
    {
        return Listing::query()->forDisplay($request->user('sanctum'))
            ->with(['condition', 'review', 'media' => fn ($m) => $m->oldest('id')])
            ->findOrFail($id);
    }
}
