<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingStatusHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'listing_id' => $this->listing_id,
            'from_status' => $this->from_status?->value,
            'to_status' => $this->to_status?->value,
            'changed_by_system' => $this->changed_by_system,
            'reason' => $this->reason,
            'created_at' => $this->created_at,
        ];
    }
}
