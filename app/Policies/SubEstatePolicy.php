<?php

namespace App\Policies;

use App\Models\User;

// Location hierarchy (SubEstate) is reference data: anyone can read it,
// only admins maintain it.
class SubEstatePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user): bool
    {
        return $user->isAdmin();
    }
}
