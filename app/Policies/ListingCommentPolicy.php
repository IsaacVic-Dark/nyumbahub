<?php

namespace App\Policies;

use App\Models\ListingComment;
use App\Models\User;

class ListingCommentPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, ListingComment $comment): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true; // README §4.4 — any past or current tenant, self-declared
    }

    public function update(User $user, ListingComment $comment): bool
    {
        return $user->isAdmin() || $comment->user_id === $user->id;
    }

    public function delete(User $user, ListingComment $comment): bool
    {
        return $user->isAdmin() || $comment->user_id === $user->id;
    }
}
