<?php

namespace App\Policies;

use App\Models\FlaggedContent;
use App\Models\User;

class FlaggedContentPolicy
{
    // The moderation queue itself is admin-only to browse (README §4.8).
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, FlaggedContent $flag): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return true; // any community member can flag content
    }

    public function resolve(User $user): bool
    {
        return $user->isAdmin();
    }
}
