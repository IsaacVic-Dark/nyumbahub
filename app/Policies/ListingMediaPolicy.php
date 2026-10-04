<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\ListingMedia;
use App\Models\User;

class ListingMediaPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, ListingMedia $media): bool
    {
        return true;
    }

    // Media is uploaded by the reporter as part of their own listing
    // (README §4.1 step 5) — check against the parent Listing.
    public function create(User $user, Listing $listing): bool
    {
        return $user->isAdmin() || $listing->user_id === $user->id;
    }

    public function delete(User $user, ListingMedia $media): bool
    {
        return $user->isAdmin() || $media->listing->user_id === $user->id;
    }
}
