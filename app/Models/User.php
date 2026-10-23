<?php

namespace App\Models;

use App\Enums\UserRole;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// This assumes Laravel's default users migration already exists; the
// 2024_01_01_000003_add_trust_and_role_fields_to_users_table migration
// only adds the columns below to it.
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'national_id_verified_at' => 'datetime',
            'is_verified_contributor' => 'boolean',
            'role' => UserRole::class,
            'privacy_settings' => 'array',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, [UserRole::Admin, UserRole::SuperAdmin], true);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === UserRole::SuperAdmin;
    }

    /** A privacy toggle from Profile -> Privacy settings (see MeController). */
    public function privacy(string $key, mixed $default = false): mixed
    {
        return ($this->privacy_settings ?? [])[$key] ?? $default;
    }

    public function savedListings(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Listing::class, 'saved_listings')->withTimestamps();
    }

    public function searchAlerts(): HasMany
    {
        return $this->hasMany(SearchAlert::class);
    }

    public function userNotifications(): HasMany
    {
        return $this->hasMany(UserNotification::class);
    }

    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ListingComment::class);
    }

    public function communityConfirmations(): HasMany
    {
        return $this->hasMany(CommunityConfirmation::class);
    }

    public function subEstateRatings(): HasMany
    {
        return $this->hasMany(SubEstateRating::class);
    }

    public function flaggedContents(): HasMany
    {
        return $this->hasMany(FlaggedContent::class, 'flagged_by_user_id');
    }
}
