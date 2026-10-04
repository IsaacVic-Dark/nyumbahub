<?php

namespace App\Models;

use App\Enums\ArchiveReason;
use App\Enums\ListingStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'building_id', 'house_type', 'last_monthly_rent',
        'deposit_amount', 'move_out_date', 'is_vacancy_confirmed_by_reporter',
        'directions', 'status', 'archive_reason', 'expires_at',
        'trust_score', 'confirmed_count', 'last_confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            'move_out_date' => 'date',
            'is_vacancy_confirmed_by_reporter' => 'boolean',
            'status' => ListingStatus::class,
            'archive_reason' => ArchiveReason::class,
            'expires_at' => 'datetime',
            'last_confirmed_at' => 'datetime',
        ];
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function condition(): HasOne
    {
        return $this->hasOne(ListingCondition::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(ListingReview::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ListingComment::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(ListingMedia::class);
    }

    public function evidence(): HasMany
    {
        return $this->hasMany(ListingEvidence::class);
    }

    public function confirmations(): HasMany
    {
        return $this->hasMany(CommunityConfirmation::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(ListingStatusHistory::class);
    }

    public function duplicateFlags(): HasMany
    {
        return $this->hasMany(DuplicateFlag::class);
    }

    /**
     * Record a status change and append it to the audit trail in one call.
     * Prefer this over `$listing->update(['status' => ...])` directly so the
     * listing_status_histories row (README §4.7) never gets missed.
     */
    public function transitionTo(ListingStatus $status, ?User $changedBy = null, bool $bySystem = false, ?string $reason = null): void
    {
        $from = $this->status;

        $this->update(['status' => $status]);

        $this->statusHistories()->create([
            'from_status' => $from,
            'to_status' => $status,
            'changed_by_user_id' => $changedBy?->id,
            'changed_by_system' => $bySystem,
            'reason' => $reason,
        ]);
    }
}
