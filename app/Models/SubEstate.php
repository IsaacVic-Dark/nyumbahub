<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubEstate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['estate_id', 'name'];

    protected function casts(): array
    {
        return [
            'avg_security_rating' => 'decimal:2',
            'avg_power_rating' => 'decimal:2',
            'avg_water_rating' => 'decimal:2',
            'avg_network_rating' => 'decimal:2',
        ];
    }

    public function estate(): BelongsTo
    {
        return $this->belongsTo(Estate::class);
    }

    public function buildings(): HasMany
    {
        return $this->hasMany(Building::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(SubEstateRating::class);
    }

    /**
     * Recompute the four denormalized averages from sub_estate_ratings.
     * Call this after a rating is created or updated (README §4.6).
     */
    public function recalculateRatingAverages(): void
    {
        $agg = $this->ratings()->selectRaw('
                avg(security_rating) as security,
                avg(power_rating) as power,
                avg(water_rating) as water,
                avg(network_rating) as network,
                count(*) as total
            ')->first();

        $this->update([
            'avg_security_rating' => $agg->security ?? 0,
            'avg_power_rating' => $agg->power ?? 0,
            'avg_water_rating' => $agg->water ?? 0,
            'avg_network_rating' => $agg->network ?? 0,
            'ratings_count' => $agg->total ?? 0,
        ]);
    }
}
