<?php

namespace Database\Factories;

use App\Enums\ListingStatus;
use App\Models\Building;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'building_id' => Building::factory(),
            'house_type' => fake()->randomElement(['Bedsitter', '1 Bedroom', '2 Bedroom', '3 Bedroom']),
            'last_monthly_rent' => fake()->numberBetween(6000, 60000),
            'deposit_amount' => fake()->numberBetween(6000, 60000),
            'move_out_date' => fake()->dateTimeBetween('-1 month', '+1 month'),
            'is_vacancy_confirmed_by_reporter' => true,
            'directions' => fake()->sentence(),
            'status' => ListingStatus::RecentlyVacated,
        ];
    }

    public function upcoming(): static
    {
        return $this->state(fn () => [
            'status' => ListingStatus::UpcomingVacancy,
            'move_out_date' => fake()->dateTimeBetween('+1 day', '+1 month'),
            'is_vacancy_confirmed_by_reporter' => false,
        ]);
    }
}
