<?php

namespace App\Models;

use App\Enums\ArchiveReason;
use App\Enums\ListingStatus;
use App\Services\Notifier;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'building_id', 'house_type', 'bedrooms', 'bathrooms',
        'last_monthly_rent', 'deposit_amount', 'move_out_date',
        'is_vacancy_confirmed_by_reporter', 'directions', 'nearest_stage', 'details',
        'status', 'archive_reason', 'expires_at',
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
            'details' => 'array',
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

    /** Users who saved (hearted) this listing. */
    public function savedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'saved_listings')->withTimestamps();
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    /**
     * Everything the listing cards / detail page need, loaded in as few
     * queries as possible. Pass the viewer so `is_saved` can be computed.
     */
    public function scopeForDisplay(Builder $query, ?User $viewer = null): Builder
    {
        return $query
            ->select('listings.*')
            ->with([
                'building.subEstate.estate.town.county',
                'reporter:id,name,is_verified_contributor,phone_verified_at,national_id_verified_at,privacy_settings',
                'condition:id,listing_id,scores',
            ])
            ->withCount([
                'media as media_photos_count' => fn ($m) => $m->where('type', 'photo'),
                'media as media_videos_count' => fn ($m) => $m->where('type', 'video'),
                'savedBy',
            ])
            ->addSelect([
                'thumbnail_path' => ListingMedia::query()->select('file_path')
                    ->whereColumn('listing_media.listing_id', 'listings.id')
                    ->where('type', 'photo')->whereNull('listing_media.deleted_at')
                    ->orderBy('listing_media.id')->limit(1),
            ])
            ->when($viewer, fn ($q) => $q->withExists([
                'savedBy as is_saved' => fn ($s) => $s->where('users.id', $viewer->id),
            ]));
    }

    /** Display title, derived from the status + type + area. */
    public function title(?string $estate = null, ?string $subEstate = null): string
    {
        $place = $subEstate && $estate ? "{$subEstate}, {$estate}" : ($estate ?? $subEstate);
        $type = $this->house_type;
        $in = $place ? " in {$place}" : '';

        return match ($this->status) {
            ListingStatus::RecentlyVacated => "Recently vacated {$type}{$in}",
            ListingStatus::UpcomingVacancy => "Upcoming vacancy: {$type}{$in}",
            ListingStatus::CommunityConfirmedVacant => "{$type} confirmed vacant{$in}",
            default => "{$type}{$in}",
        };
    }

    /** "1-Bedroom" -> 1, "Bedsitter" -> 0, unknown -> null. */
    public static function bedroomsFromType(?string $type): ?int
    {
        if (! $type) {
            return null;
        }
        if (preg_match('/^(\d+)/', $type, $m)) {
            return (int) $m[1];
        }

        return in_array($type, ['Bedsitter', 'Studio', 'Single room'], true) ? 0 : null;
    }

    /** Mean of every score > 0 in a listing_conditions.scores array. */
    public static function averageScore(?array $scores): ?float
    {
        $values = collect($scores ?? [])
            ->map(fn ($s) => is_array($s) ? ($s['score'] ?? 0) : 0)
            ->filter(fn ($s) => $s > 0);

        return $values->isEmpty() ? null : round($values->avg(), 1);
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

        if ($from !== $status) {
            Notifier::listingStatusChanged($this, $status, $changedBy?->id);
        }
    }
}
