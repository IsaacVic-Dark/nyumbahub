<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// Confirmer identity is never shown publicly (README §8) — user_id is
// deliberately omitted here even though it's stored for backend
// abuse-detection.
class CommunityConfirmationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'listing_id' => $this->listing_id,
            'type' => $this->type?->value,
            'reported_rent_amount' => $this->reported_rent_amount !== null ? (float) $this->reported_rent_amount : null,
            'created_at' => $this->created_at,
        ];
    }
}
