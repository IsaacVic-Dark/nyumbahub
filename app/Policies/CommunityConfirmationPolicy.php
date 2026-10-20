<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Listing;

// A confirmation is a workflow trigger, not editable content (README §4.5):
// anyone verified can submit one; nobody edits or deletes one afterwards.
class CommunityConfirmationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user, Listing $listing): bool
    {
        return $listing->user_id !== $user->id;
    }
}
