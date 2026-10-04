<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\ListingCondition;
use App\Models\User;

// Condition report belongs to the listing's reporter; there is no
// standalone "create" ability — it's created/updated through the parent
// listing, so the controller checks against the Listing, not this model.
class ListingConditionPolicy
{
    public function view(?User $user, ListingCondition $condition): bool
    {
        return true;
    }

    public function manage(User $user, Listing $listing): bool
    {
        return $user->isAdmin() || $listing->user_id === $user->id;
    }
}
