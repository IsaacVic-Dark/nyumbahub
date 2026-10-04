<?php

namespace Database\Factories;

use App\Models\Estate;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubEstateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'estate_id' => Estate::factory(),
            'name' => 'Zone '.fake()->randomLetter(),
        ];
    }
}
