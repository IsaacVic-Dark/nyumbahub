<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingConditionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'listing_id' => $this->listing_id,
            'water' => $this->water,
            'electricity' => $this->electricity,
            'internet' => $this->internet,
            'plumbing' => $this->plumbing,
            'kitchen' => $this->kitchen,
            'walls_floors' => $this->walls_floors,
            'natural_light' => $this->natural_light,
            'noise' => $this->noise,
            'security' => $this->security,
            'parking' => $this->parking,
            'garbage_collection' => $this->garbage_collection,
            'has_lift' => $this->has_lift,
            'pest_mould_leakage_history' => $this->pest_mould_leakage_history,
            'expected_hidden_costs' => $this->expected_hidden_costs,
        ];
    }
}
