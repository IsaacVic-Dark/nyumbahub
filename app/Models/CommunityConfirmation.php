<?php

namespace App\Models;

use App\Enums\ConfirmationType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CommunityConfirmation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['listing_id', 'user_id', 'type', 'reported_rent_amount', 'evidence_id'];

    protected function casts(): array
    {
        return [
            'type' => ConfirmationType::class,
        ];
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function evidence(): BelongsTo
    {
        return $this->belongsTo(ListingEvidence::class, 'evidence_id');
    }
}
