<?php

namespace Database\Factories;

use App\Models\Listing;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListingConditionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'listing_id' => Listing::factory(),
            'water' => fake()->randomElement(['Reliable, borehole backup', 'Occasional shortages']),
            'electricity' => 'Stable, KPLC',
            'internet' => fake()->randomElement(['Fiber ready', 'No fiber, mobile data only']),
            'plumbing' => 'No known issues',
            'kitchen' => 'Built-in cabinets',
            'walls_floors' => 'Tiled floors, painted walls',
            'natural_light' => 'Good, south-facing',
            'noise' => fake()->randomElement(['Quiet', 'Moderate street noise']),
            'security' => '24hr guard, perimeter wall',
            'parking' => fake()->randomElement(['Allocated parking', 'Street parking only']),
            'garbage_collection' => 'Twice weekly',
            'has_lift' => fake()->boolean(),
            'pest_mould_leakage_history' => fake()->randomElement(['None reported', 'Minor damp during rains']),
            'expected_hidden_costs' => ['garbage_fee' => 500, 'service_charge' => 1500],
        ];
    }
}
