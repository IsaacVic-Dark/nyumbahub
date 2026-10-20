<?php

namespace App\Policies;

use App\Models\User;
use App\Enums\UserRole;

// Admin accounts are managed by SuperAdmins only.
class UserPolicy
{
    public function createAdmin(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    public function removeAdmin(User $user, User $target): bool
    {
        // SuperAdmins can only remove plain admins, never each other or themselves.
        return $user->isSuperAdmin() && $target->role === UserRole::Admin;
    }
}
