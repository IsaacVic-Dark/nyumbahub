<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ListingMedia extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['listing_id', 'type', 'file_path'];

    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}
