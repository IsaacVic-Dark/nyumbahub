<?php

namespace Database\Factories;

use App\Models\SubEstate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubEstateRatingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'sub_estate_id' => SubEstate::factory(),
            'user_id' => User::factory(),
            'security_rating' => fake()->numberBetween(1, 5),
            'power_rating' => fake()->numberBetween(1, 5),
            'water_rating' => fake()->numberBetween(1, 5),
            'network_rating' => fake()->numberBetween(1, 5),
        ];
    }
}
