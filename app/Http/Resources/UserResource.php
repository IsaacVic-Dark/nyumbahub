<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// Deliberately thin — public-facing author info only. Never expose phone,
// national_id_verified_at details, trust_score internals, etc. here.
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'is_verified_contributor' => $this->is_verified_contributor,
        ];
    }
}
