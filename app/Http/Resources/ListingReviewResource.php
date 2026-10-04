<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'listing_id' => $this->listing_id,
            'lived_from' => $this->lived_from?->toDateString(),
            'lived_to' => $this->lived_to?->toDateString(),
            'pros' => $this->pros,
            'cons' => $this->cons,
            'how_repairs_handled' => $this->how_repairs_handled,
            'recurring_issues' => $this->recurring_issues,
            'rent_changed_during_stay' => $this->rent_changed_during_stay,
            'reason_for_leaving' => $this->reason_for_leaving,
        ];
    }
}
