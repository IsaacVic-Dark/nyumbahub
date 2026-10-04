<?php

namespace Database\Factories;

use App\Models\Listing;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListingReviewFactory extends Factory
{
    public function definition(): array
    {
        return [
            'listing_id' => Listing::factory(),
            'lived_from' => fake()->dateTimeBetween('-3 years', '-1 year'),
            'lived_to' => fake()->dateTimeBetween('-1 year', 'now'),
            'pros' => fake()->sentence(),
            'cons' => fake()->sentence(),
            'how_repairs_handled' => fake()->sentence(),
            'recurring_issues' => fake()->optional()->sentence(),
            'rent_changed_during_stay' => fake()->boolean(20),
            'reason_for_leaving' => fake()->sentence(),
        ];
    }
}
