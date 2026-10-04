<?php

namespace Database\Factories;

use App\Models\SubEstate;
use Illuminate\Database\Eloquent\Factories\Factory;

class BuildingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'sub_estate_id' => SubEstate::factory(),
            'name' => fake()->streetName().' Apartments',
            'directions' => fake()->sentence(),
            'latitude' => fake()->latitude(-1.5, -1.1),   // roughly Nairobi area
            'longitude' => fake()->longitude(36.6, 37.0),
        ];
    }
}
