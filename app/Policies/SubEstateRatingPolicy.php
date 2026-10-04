<?php

namespace App\Policies;

use App\Models\SubEstateRating;
use App\Models\User;

class SubEstateRatingPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true; // eligibility (linked to a building in the sub-estate) enforced in the FormRequest, not here
    }

    public function update(User $user, SubEstateRating $rating): bool
    {
        return $user->isAdmin() || $rating->user_id === $user->id;
    }

    public function delete(User $user, SubEstateRating $rating): bool
    {
        return $user->isAdmin() || $rating->user_id === $user->id;
    }
}
