<?php

namespace Database\Factories;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'phone' => '2547'.fake()->numerify('########'),
            'phone_verified_at' => null,
            'national_id_verified_at' => null,
            'is_verified_contributor' => false,
            'trust_score' => 0,
            'role' => UserRole::User,
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn () => ['role' => UserRole::Admin]);
    }

    public function verifiedContributor(): static
    {
        return $this->state(fn () => [
            'phone_verified_at' => now(),
            'is_verified_contributor' => true,
        ]);
    }
}
