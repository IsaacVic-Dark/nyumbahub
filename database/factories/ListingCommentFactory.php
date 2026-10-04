<?php

namespace Database\Factories;

use App\Enums\CommentRelationshipTag;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ListingCommentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'listing_id' => Listing::factory(),
            'user_id' => User::factory(),
            'parent_comment_id' => null,
            'body' => fake()->paragraph(),
            'relationship_tag' => fake()->randomElement(CommentRelationshipTag::cases()),
        ];
    }
}
