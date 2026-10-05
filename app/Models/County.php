<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class County extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['code', 'name', 'slug', 'latitude', 'longitude'];

    protected static function booted(): void
    {
        // Slug follows the name: generated on create, regenerated when name changes.
        static::saving(function (County $county) {
            if ($county->isDirty('name') || blank($county->slug)) {
                $county->slug = static::generateUniqueSlug($county->name, $county->id);
            }
        });
    }

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    public function towns(): HasMany
    {
        return $this->hasMany(Town::class);
    }

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        return $query->when(filled($term), fn (Builder $q) => $q->where(
            'name', 'ilike', '%'.addcslashes($term, '%_\\').'%'
        ));
    }

    // Checks trashed rows too, because the DB unique index on slug still counts them.
    protected static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 2;

        while (static::withTrashed()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}