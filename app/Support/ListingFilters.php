<?php

namespace App\Support;

use App\Enums\ListingStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

/**
 * One place that turns query-string filters into an Eloquent query. Used by
 * GET /api/listings and by search alerts, so an alert matches exactly what
 * the Explore page would show.
 */
class ListingFilters
{
    /** Statuses that may ever be shown publicly. */
    public static function publicStatuses(): array
    {
        return collect(ListingStatus::cases())
            ->reject(fn ($s) => in_array($s, [ListingStatus::Archived, ListingStatus::Removed], true))
            ->map->value->values()->all();
    }

    private static function list(mixed $value): array
    {
        if ($value === null || $value === '') {
            return [];
        }

        return array_values(array_filter(
            is_array($value) ? $value : explode(',', (string) $value),
            fn ($v) => $v !== null && $v !== '',
        ));
    }

    private static function like(string $term): string
    {
        return '%'.mb_strtolower(addcslashes($term, '%_\\')).'%';
    }

    public static function apply(Builder $q, array $f): Builder
    {
        // --- status (always limited to publicly visible ones) ----------------
        $statuses = array_values(array_intersect(self::list($f['status'] ?? null), self::publicStatuses()));
        $q->whereIn('listings.status', $statuses ?: self::publicStatuses());

        // --- location ---------------------------------------------------------
        if (! empty($f['county_id'])) {
            $q->whereHas('building.subEstate.estate.town', fn ($t) => $t->where('towns.county_id', (int) $f['county_id']));
        }
        if (! empty($f['town_id'])) {
            $q->whereHas('building.subEstate.estate', fn ($e) => $e->where('estates.town_id', (int) $f['town_id']));
        }
        if (! empty($f['estate_id'])) {
            $q->whereHas('building.subEstate', fn ($s) => $s->where('sub_estates.estate_id', (int) $f['estate_id']));
        }
        if (! empty($f['sub_estate_id'])) {
            $q->whereHas('building', fn ($b) => $b->where('buildings.sub_estate_id', (int) $f['sub_estate_id']));
        }
        if (! empty($f['building_id'])) {
            $q->where('listings.building_id', (int) $f['building_id']);
        }
        if (filled($f['estate'] ?? null)) {
            $t = self::like($f['estate']);
            $q->whereHas('building.subEstate', fn ($s) => $s
                ->whereRaw('LOWER(sub_estates.name) LIKE ?', [$t])
                ->orWhereHas('estate', fn ($e) => $e->whereRaw('LOWER(estates.name) LIKE ?', [$t])));
        }

        // --- free text: building, sub-estate, estate, town, county, stage -----
        if (filled($f['q'] ?? null)) {
            $t = self::like($f['q']);
            $q->where(fn ($w) => $w
                ->whereRaw('LOWER(listings.nearest_stage) LIKE ?', [$t])
                ->orWhereHas('building', fn ($b) => $b
                    ->whereRaw('LOWER(buildings.name) LIKE ?', [$t])
                    ->orWhereHas('subEstate', fn ($s) => $s
                        ->whereRaw('LOWER(sub_estates.name) LIKE ?', [$t])
                        ->orWhereHas('estate', fn ($e) => $e
                            ->whereRaw('LOWER(estates.name) LIKE ?', [$t])
                            ->orWhereHas('town', fn ($tw) => $tw
                                ->whereRaw('LOWER(towns.name) LIKE ?', [$t])
                                ->orWhereHas('county', fn ($c) => $c->whereRaw('LOWER(counties.name) LIKE ?', [$t])))))));
        }

        // --- type / money / dates --------------------------------------------
        if ($types = self::list($f['house_type'] ?? null)) {
            $q->whereIn('listings.house_type', $types);
        }
        foreach ([['min_rent', '>=', 'last_monthly_rent'], ['max_rent', '<=', 'last_monthly_rent'],
                  ['min_deposit', '>=', 'deposit_amount'], ['max_deposit', '<=', 'deposit_amount']] as [$key, $op, $col]) {
            if (isset($f[$key]) && $f[$key] !== '' && is_numeric($f[$key])) {
                $q->where("listings.$col", $op, $f[$key]);
            }
        }
        if (! empty($f['reported_within'])) {
            $q->where('listings.created_at', '>=', now()->subDays((int) $f['reported_within']));
        }
        if (! empty($f['confirmed_within'])) {
            $q->where('listings.last_confirmed_at', '>=', now()->subDays((int) $f['confirmed_within']));
        }
        if (isset($f['bedrooms']) && $f['bedrooms'] !== '') {
            $q->where('listings.bedrooms', (int) $f['bedrooms']);
        }
        if (isset($f['bedrooms_min']) && $f['bedrooms_min'] !== '') {
            $q->where('listings.bedrooms', '>=', (int) $f['bedrooms_min']);
        }

        // --- amenities (stored in details json) -------------------------------
        foreach (self::list($f['amenities'] ?? null) as $a) {
            match ($a) {
                'parking' => $q->whereJsonContains('listings.details->features', 'Parking'),
                'balcony' => $q->whereJsonContains('listings.details->features', 'Balcony'),
                'lift' => $q->whereJsonContains('listings.details->features', 'Lift'),
                'gated' => $q->whereJsonContains('listings.details->features', 'Gated compound'),
                'pets' => $q->where('listings.details->pets', 'Pets allowed'),
                'furnished' => $q->whereIn('listings.details->furnishing', ['Partly furnished', 'Fully furnished']),
                'unfurnished' => $q->where('listings.details->furnishing', 'Unfurnished'),
                'stage' => $q->whereNotNull('listings.nearest_stage')->where('listings.nearest_stage', '!=', ''),
                default => null,
            };
        }

        // --- condition & utilities -------------------------------------------
        foreach (self::list($f['condition'] ?? null) as $c) {
            match ($c) {
                'water4' => self::scoreAtLeast($q, 'Water reliability', 4),
                'security4' => self::scoreAtLeast($q, 'Security', 4),
                'condition4' => self::averageAtLeast($q, 4),
                'internet' => $q->whereJsonLength('listings.details->internet', '>', 0)
                    ->whereJsonDoesntContain('listings.details->internet', 'None known'),
                'prepaid' => $q->where('listings.details->electricity', 'Prepaid tokens'),
                default => null,
            };
        }

        // --- trust -----------------------------------------------------------
        foreach (self::list($f['trust'] ?? null) as $t) {
            match ($t) {
                'verified_tenant' => $q->whereHas('reporter', fn ($r) => $r->where('is_verified_contributor', true)),
                'has_media' => $q->whereHas('media'),
                'has_confirmation' => $q->where('listings.confirmed_count', '>=', 1),
                'multi_confirmed' => $q->where('listings.confirmed_count', '>=', 2),
                default => null,
            };
        }

        // --- map bounding box: minLat,minLng,maxLat,maxLng -------------------
        if (filled($f['bbox'] ?? null)) {
            $p = array_map('floatval', explode(',', $f['bbox']));
            if (count($p) === 4) {
                $q->whereHas('building', fn ($b) => $b
                    ->whereBetween('buildings.latitude', [$p[0], $p[2]])
                    ->whereBetween('buildings.longitude', [$p[1], $p[3]]));
            }
        }
        if (! empty($f['has_coordinates'])) {
            $q->whereHas('building', fn ($b) => $b->whereNotNull('buildings.latitude')->whereNotNull('buildings.longitude'));
        }

        if (! empty($f['ids'])) {
            $q->whereIn('listings.id', array_map('intval', self::list($f['ids'])));
        }

        return $q;
    }

    public static function sort(Builder $q, ?string $sort, ?float $lat = null, ?float $lng = null): Builder
    {
        $pg = DB::getDriverName() === 'pgsql';

        return match ($sort) {
            'confirmed' => $q->orderByRaw('listings.last_confirmed_at DESC NULLS LAST')->latest('listings.id'),
            'rent_asc' => $q->orderBy('listings.last_monthly_rent')->latest('listings.id'),
            'rent_desc' => $q->orderByDesc('listings.last_monthly_rent')->latest('listings.id'),
            'saved' => $q->orderByDesc('saved_by_count')->latest('listings.id'),
            'rating' => $pg
                ? $q->orderByRaw(self::AVG_SQL.' DESC NULLS LAST')->latest('listings.id')
                : $q->latest('listings.id'),
            'nearest' => ($lat !== null && $lng !== null)
                ? $q->orderByRaw(
                    '(SELECT 2 * 6371 * ASIN(SQRT(POWER(SIN(RADIANS(b.latitude - ?) / 2), 2) + COS(RADIANS(?)) * COS(RADIANS(b.latitude)) * POWER(SIN(RADIANS(b.longitude - ?) / 2), 2)))
                       FROM buildings b WHERE b.id = listings.building_id AND b.latitude IS NOT NULL) ASC '.($pg ? 'NULLS LAST' : ''),
                    [$lat, $lat, $lng],
                )->latest('listings.id')
                : $q->latest('listings.id'),
            default => $q->latest('listings.created_at')->latest('listings.id'),
        };
    }

    /** Average of every non-zero condition score of one listing (Postgres). */
    private const AVG_SQL = "(SELECT AVG((e.value->>'score')::numeric) FROM listing_conditions lc, jsonb_each(lc.scores) e
                              WHERE lc.listing_id = listings.id AND lc.deleted_at IS NULL AND (e.value->>'score')::numeric > 0)";

    private static function scoreAtLeast(Builder $q, string $key, int $min): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }
        // $key comes from the fixed whitelist above, never from user input.
        $k = str_replace("'", "''", $key);
        $q->whereRaw("EXISTS (SELECT 1 FROM listing_conditions lc WHERE lc.listing_id = listings.id AND lc.deleted_at IS NULL
                      AND (lc.scores->'{$k}'->>'score')::numeric >= ?)", [$min]);
    }

    private static function averageAtLeast(Builder $q, int $min): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }
        $q->whereRaw(self::AVG_SQL.' >= ?', [$min]);
    }
}
