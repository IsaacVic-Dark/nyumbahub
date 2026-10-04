<?php

namespace App\Policies;

use App\Models\User;

// Fully public read-only audit trail (README §4.7 — "auditable").
class ListingStatusHistoryPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }
}
