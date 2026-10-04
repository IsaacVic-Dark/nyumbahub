<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ListingCondition extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'listing_id', 'water', 'electricity', 'internet', 'plumbing', 'kitchen',
        'walls_floors', 'natural_light', 'noise', 'security', 'parking',
        'garbage_collection', 'has_lift', 'pest_mould_leakage_history',
        'expected_hidden_costs',
    ];

    protected function casts(): array
    {
        return [
            'has_lift' => 'boolean',
            'expected_hidden_costs' => 'array',
        ];
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}
