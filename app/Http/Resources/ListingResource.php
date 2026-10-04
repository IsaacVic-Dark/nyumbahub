<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'building_id' => $this->building_id,
            'reporter' => new UserResource($this->whenLoaded('reporter')),
            'house_type' => $this->house_type,
            'last_monthly_rent' => (float) $this->last_monthly_rent,
            'deposit_amount' => $this->deposit_amount !== null ? (float) $this->deposit_amount : null,
            'move_out_date' => $this->move_out_date?->toDateString(),
            'is_vacancy_confirmed_by_reporter' => $this->is_vacancy_confirmed_by_reporter,
            'directions' => $this->directions,
            'status' => $this->status?->value,
            'archive_reason' => $this->archive_reason?->value,
            'expires_at' => $this->expires_at,
            'trust_score' => $this->trust_score,
            'confirmed_count' => $this->confirmed_count,
            'last_confirmed_at' => $this->last_confirmed_at,
            'condition' => new ListingConditionResource($this->whenLoaded('condition')),
            'review' => new ListingReviewResource($this->whenLoaded('review')),
            'media' => ListingMediaResource::collection($this->whenLoaded('media')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
