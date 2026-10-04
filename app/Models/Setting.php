<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'value', 'description'];

    /**
     * Read a setting value, cached, with a fallback if the row doesn't exist.
     * e.g. Setting::get('occupied_confirmation_threshold', 2)
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::rememberForever("setting:{$key}", function () use ($key, $default) {
            return static::where('key', $key)->value('value') ?? $default;
        });
    }

    public static function set(string $key, mixed $value, ?string $description = null): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value, 'description' => $description]);
        Cache::forget("setting:{$key}");
    }
}
