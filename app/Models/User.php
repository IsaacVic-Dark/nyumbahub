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
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
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
