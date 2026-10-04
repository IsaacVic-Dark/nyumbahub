<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\ListingReview;
use App\Models\User;

class ListingReviewPolicy
{
    public function view(?User $user, ListingReview $review): bool
    {
        return true;
    }

    public function manage(User $user, Listing $listing): bool
    {
        return $user->isAdmin() || $listing->user_id === $user->id;
    }
}
