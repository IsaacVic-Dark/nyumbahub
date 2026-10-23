<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SearchAlertResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title(),
            'area' => $this->area,
            'max_rent' => $this->max_rent,
            'house_types' => $this->house_types ?? [],
            'bedrooms' => $this->bedrooms,
            'bedrooms_plus' => $this->bedrooms_plus,
            'amenities' => $this->amenities ?? [],
            'frequency' => $this->frequency,
            'channels' => $this->channels ?? [],
            'is_active' => $this->is_active,
            'matches_count' => $this->when(isset($this->matches_count), fn () => $this->matches_count),
            'created_at' => $this->created_at,
        ];
    }
}
