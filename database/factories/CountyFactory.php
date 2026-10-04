<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CountyFactory extends Factory
{
    public function definition(): array
    {
        return ['name' => fake()->unique()->city().' County'];
    }
}
