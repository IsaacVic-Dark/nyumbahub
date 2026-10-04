<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Town extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['county_id', 'name'];

    public function county(): BelongsTo
    {
        return $this->belongsTo(County::class);
    }

    public function estates(): HasMany
    {
        return $this->hasMany(Estate::class);
    }
}
