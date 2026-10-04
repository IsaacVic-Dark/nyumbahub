<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// Only ever returned to the evidence owner or an admin (gated by
// ListingEvidencePolicy) — but per README §8 ("never shown publicly") we
// still don't expose the raw file_path here, only whether one exists.
class ListingEvidenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'listing_id' => $this->listing_id,
            'type' => $this->type?->value,
            'file_uploaded' => filled($this->file_path),
            'status' => $this->status?->value,
            'verified_at' => $this->verified_at,
            'created_at' => $this->created_at,
        ];
    }
}
