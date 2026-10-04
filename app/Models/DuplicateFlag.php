<?php

namespace App\Models;

use App\Enums\DuplicateFlagStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DuplicateFlag extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['listing_id', 'duplicate_of_listing_id', 'flagged_by_user_id', 'status'];

    protected function casts(): array
    {
        return [
            'status' => DuplicateFlagStatus::class,
        ];
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function duplicateOf(): BelongsTo
    {
        return $this->belongsTo(Listing::class, 'duplicate_of_listing_id');
    }

    public function flaggedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'flagged_by_user_id');
    }
}
