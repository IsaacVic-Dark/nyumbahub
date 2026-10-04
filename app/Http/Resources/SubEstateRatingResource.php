<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubEstateRatingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sub_estate_id' => $this->sub_estate_id,
            'user_id' => $this->user_id,
            'security_rating' => $this->security_rating,
            'power_rating' => $this->power_rating,
            'water_rating' => $this->water_rating,
            'network_rating' => $this->network_rating,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
