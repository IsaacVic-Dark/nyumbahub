<?php

namespace Database\Factories;

use App\Models\Town;
use Illuminate\Database\Eloquent\Factories\Factory;

class EstateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'town_id' => Town::factory(),
            'name' => fake()->streetName().' Estate',
        ];
    }
}
