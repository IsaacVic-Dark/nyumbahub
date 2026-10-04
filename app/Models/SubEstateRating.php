<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubEstateRating extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['sub_estate_id', 'user_id', 'security_rating', 'power_rating', 'water_rating', 'network_rating'];

    protected static function booted(): void
    {
        // Keep sub_estates' denormalized averages in sync automatically
        // (README §4.6: "recalculated whenever a rating is submitted or edited").
        static::saved(fn (SubEstateRating $rating) => $rating->subEstate->recalculateRatingAverages());
        static::deleted(fn (SubEstateRating $rating) => $rating->subEstate->recalculateRatingAverages());
    }

    public function subEstate(): BelongsTo
    {
        return $this->belongsTo(SubEstate::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
