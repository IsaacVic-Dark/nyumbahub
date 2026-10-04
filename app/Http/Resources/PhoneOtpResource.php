<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// Admin-only audit view — otp_code is never exposed, even hashed.
class PhoneOtpResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'phone' => $this->phone,
            'expires_at' => $this->expires_at,
            'verified_at' => $this->verified_at,
            'created_at' => $this->created_at,
        ];
    }
}
