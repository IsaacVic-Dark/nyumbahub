<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DuplicateFlagResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'listing_id' => $this->listing_id,
            'duplicate_of_listing_id' => $this->duplicate_of_listing_id,
            'status' => $this->status?->value,
            'created_at' => $this->created_at,
        ];
    }
}
