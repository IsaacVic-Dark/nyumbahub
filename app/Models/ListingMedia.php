<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ListingMedia extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['listing_id', 'type', 'label', 'file_path'];

    /** Public URL for a stored path (public disk), or the value itself if it is already a URL. */
    public static function publicUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return (str_starts_with($path, 'http') || str_starts_with($path, '/')) ? $path : '/storage/'.ltrim($path, '/');
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}
