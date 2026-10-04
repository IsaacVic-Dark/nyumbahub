<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ListingReview extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'listing_id', 'lived_from', 'lived_to', 'pros', 'cons',
        'how_repairs_handled', 'recurring_issues', 'rent_changed_during_stay',
        'reason_for_leaving',
    ];

    protected function casts(): array
    {
        return [
            'lived_from' => 'date',
            'lived_to' => 'date',
            'rent_changed_during_stay' => 'boolean',
        ];
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}
