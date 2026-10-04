<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubEstateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'estate_id' => $this->estate_id,
            'name' => $this->name,
            'ratings' => [
                'security' => (float) $this->avg_security_rating,
                'power' => (float) $this->avg_power_rating,
                'water' => (float) $this->avg_water_rating,
                'network' => (float) $this->avg_network_rating,
                'count' => $this->ratings_count,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
