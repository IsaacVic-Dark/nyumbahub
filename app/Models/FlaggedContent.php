<?php

namespace App\Models;

use App\Enums\FlagReason;
use App\Enums\FlagStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FlaggedContent extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'flaggable_type', 'flaggable_id', 'flagged_by_user_id', 'reason',
        'details', 'status', 'resolved_by_admin_id', 'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'reason' => FlagReason::class,
            'status' => FlagStatus::class,
            'resolved_at' => 'datetime',
        ];
    }

    public function flaggable(): MorphTo
    {
        return $this->morphTo();
    }

    public function flaggedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'flagged_by_user_id');
    }

    public function resolvedByAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by_admin_id');
    }
}
