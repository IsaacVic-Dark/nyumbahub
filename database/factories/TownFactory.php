<?php

namespace Database\Factories;

use App\Models\County;
use Illuminate\Database\Eloquent\Factories\Factory;

class TownFactory extends Factory
{
    public function definition(): array
    {
        return [
            'county_id' => County::factory(),
            'name' => fake()->city(),
        ];
    }
}
