<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Estate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['town_id', 'name'];

    public function town(): BelongsTo
    {
        return $this->belongsTo(Town::class);
    }

    public function subEstates(): HasMany
    {
        return $this->hasMany(SubEstate::class);
    }
}
