<?php

namespace App\Models;

use App\Enums\ListingStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingStatusHistory extends Model
{
    use HasFactory;

    public $timestamps = false; // only created_at, set via useCurrent() in the migration
    const UPDATED_AT = null;

    protected $fillable = ['listing_id', 'from_status', 'to_status', 'changed_by_user_id', 'changed_by_system', 'reason'];

    protected function casts(): array
    {
        return [
            'from_status' => ListingStatus::class,
            'to_status' => ListingStatus::class,
            'changed_by_system' => 'boolean',
            'created_at' => 'datetime',
        ];
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by_user_id');
    }
}
