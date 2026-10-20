<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\ListingEvidence;
use App\Models\User;
use App\Enums\EvidenceType;

class ListingEvidencePolicy
{

    public function viewAny(User $user, Listing $listing): bool
    {
        return true; // any authenticated user; the controller filters out national ID rows
    }
    public function view(User $user, ListingEvidence $evidence): bool
    {
        // Any authenticated user (guests are already blocked from listing detail).
        if ($evidence->type === EvidenceType::NationalId) { // case name is a guess
            return $user->isAdmin() || $evidence->listing->user_id === $user->id;
        }

        return true;
    }

    public function update(User $user, ListingEvidence $evidence): bool
    {
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
