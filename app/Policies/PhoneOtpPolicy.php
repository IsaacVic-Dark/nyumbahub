<?php

namespace App\Policies;

use App\Models\User;

// Read-only audit log of OTP issuance — admin-only.
class PhoneOtpPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }
}
