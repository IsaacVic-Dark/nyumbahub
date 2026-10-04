<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\User;

class ListingPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Listing $listing): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true; // any authenticated user can report a listing (README §2 — "Reporter")
    }

    public function update(User $user, Listing $listing): bool
    {
        return $user->isAdmin() || $listing->user_id === $user->id;
    }

    public function delete(User $user, Listing $listing): bool
    {
        return $user->isAdmin() || $listing->user_id === $user->id;
    }
}
