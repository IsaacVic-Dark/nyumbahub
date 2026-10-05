<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CountyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->city() . ' County',
            'latitude' => fake()->latitude(-4.7, 5.0),
            'longitude' => fake()->longitude(33.9, 41.9),
        ];
    }

    public function withCode(): static
    {
        return $this->state(fn() => [
            'code' => str_pad((string) fake()->unique()->numberBetween(1, 47), 3, '0', STR_PAD_LEFT),
        ]);
    }
}
