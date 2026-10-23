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

    protected $fillable = ['listing_id', 'user_id', 'type', 'reported_rent_amount', 'note', 'visited_at', 'spoke_to_caretaker', 'evidence_id'];

    protected function casts(): array
    {
        return [
            'type' => ConfirmationType::class,
            'visited_at' => 'datetime',
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

    public function helpfulVoters(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'confirmation_helpful_votes', 'community_confirmation_id', 'user_id')->withTimestamps();
    }

    public function evidence(): BelongsTo
    {
        return $this->belongsTo(ListingEvidence::class, 'evidence_id');
    }
}
