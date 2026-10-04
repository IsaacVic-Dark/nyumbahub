<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\ListingEvidence;
use App\Models\User;

class ListingEvidencePolicy
{
    public function view(User $user, ListingEvidence $evidence): bool
    {
        // Evidence is sensitive (README §8) — never public. Owner or admin only.
        return $user->isAdmin() || $evidence->listing->user_id === $user->id;
    }

    public function create(User $user, Listing $listing): bool
    {
        return $user->isAdmin() || $listing->user_id === $user->id;
    }

    public function delete(User $user, ListingEvidence $evidence): bool
    {
        return $user->isAdmin() || $evidence->listing->user_id === $user->id;
    }

    public function verify(User $user): bool
    {
        return $user->isAdmin();
    }
}
