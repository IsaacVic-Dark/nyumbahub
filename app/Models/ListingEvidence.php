<?php

namespace App\Models;

use App\Enums\EvidenceStatus;
use App\Enums\EvidenceType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

// file_path should sit behind encrypted storage — never exposed publicly
// (README §8). Consider an encrypted cast or a storage disk with
// server-side encryption rather than trusting the app layer alone.
class ListingEvidence extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['listing_id', 'type', 'file_path', 'status', 'verified_at'];

    protected function casts(): array
    {
        return [
            'type' => EvidenceType::class,
            'status' => EvidenceStatus::class,
            'verified_at' => 'datetime',
        ];
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function communityConfirmations(): HasMany
    {
        return $this->hasMany(CommunityConfirmation::class, 'evidence_id');
    }
}
