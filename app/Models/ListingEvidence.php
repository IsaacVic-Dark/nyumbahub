<?php

namespace App\Models;

use App\Enums\EvidenceStatus;
use App\Enums\EvidenceType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

// Visible to authenticated users to back up the reporter's claims, except
// national ID documents (owner/admin only). Serve files via signed,
// short-lived URLs rather than a public disk path.

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
