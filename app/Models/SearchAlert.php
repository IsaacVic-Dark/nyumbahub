<?php

namespace App\Models;

use App\Support\ListingFilters;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SearchAlert extends Model
{
    protected $fillable = [
        'user_id', 'area', 'max_rent', 'house_types', 'bedrooms', 'bedrooms_plus',
        'amenities', 'frequency', 'channels', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'max_rent' => 'float',
            'house_types' => 'array',
            'amenities' => 'array',
            'channels' => 'array',
            'bedrooms_plus' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Human title, e.g. "Bedsitter under KES 12,000 in South B". */
    public function title(): string
    {
        $type = $this->house_types ? implode(' / ', $this->house_types) : 'Any home';
        $title = $type;
        if ($this->max_rent) {
            $title .= ' under KES '.number_format($this->max_rent);
        }
        if ($this->area) {
            $title .= ' in '.$this->area;
        }

        return $title;
    }

    /** The same filter array the public search endpoint understands. */
    public function toFilters(): array
    {
        $amenityKeys = ['parking', 'stage', 'gated'];
        $amenities = collect($this->amenities ?? []);

        $filters = [
            'q' => $this->area,
            'max_rent' => $this->max_rent,
            'house_type' => $this->house_types,
            'amenities' => $amenities->intersect($amenityKeys)->values()->all(),
            'condition' => $amenities->map(fn ($a) => match ($a) {
                'water' => 'water4',
                'internet' => 'internet',
                default => null,
            })->filter()->values()->all(),
        ];
        if ($this->bedrooms !== null) {
            $filters[$this->bedrooms_plus ? 'bedrooms_min' : 'bedrooms'] = $this->bedrooms;
        }

        return array_filter($filters, fn ($v) => $v !== null && $v !== [] && $v !== '');
    }

    public function matchesQuery(): Builder
    {
        return ListingFilters::apply(Listing::query(), $this->toFilters());
    }

    /** Alerts (active) whose filters match a given listing. */
    public static function notifyMatchesFor(Listing $listing): void
    {
        static::query()->where('is_active', true)
            ->where('user_id', '!=', $listing->user_id)
            ->get()
            ->each(function (SearchAlert $alert) use ($listing) {
                $hit = $alert->matchesQuery()->whereKey($listing->id)->exists();
                if ($hit) {
                    \App\Services\Notifier::send(
                        $alert->user_id, 'alerts', 'A new home matches your search alert',
                        '"'.$alert->title().'"', $listing, '🔔',
                    );
                }
            });
    }
}
