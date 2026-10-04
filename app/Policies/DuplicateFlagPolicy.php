<?php

namespace App\Policies;

use App\Models\User;

class DuplicateFlagPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    // Only an admin resolves (confirms/rejects) a duplicate flag.
    public function resolve(User $user): bool
    {
        return $user->isAdmin();
    }
}
