<?php

namespace Database\Factories;

use App\Enums\ConfirmationType;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommunityConfirmationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'listing_id' => Listing::factory(),
            'user_id' => User::factory(),
            'type' => ConfirmationType::StillVacant,
            'reported_rent_amount' => null,
            'evidence_id' => null,
        ];
    }
}
