<?php

namespace App\Policies;

use App\Models\User;

// Internal configuration — admin-only, full stop.
class SettingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user): bool
    {
        return $user->isAdmin();
    }
}
