<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FlaggedContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'flaggable_type' => $this->flaggable_type,
            'flaggable_id' => $this->flaggable_id,
            'reason' => $this->reason?->value,
            'details' => $this->details,
            'status' => $this->status?->value,
            'resolved_by_admin_id' => $this->resolved_by_admin_id,
            'resolved_at' => $this->resolved_at,
            'created_at' => $this->created_at,
        ];
    }
}
