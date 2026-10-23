<?php

namespace App\Http\Resources;

use App\Models\ListingMedia;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingMediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'listing_id' => $this->listing_id,
            'type' => $this->type,
            'label' => $this->label,
            'url' => ListingMedia::publicUrl($this->file_path),
            'created_at' => $this->created_at,
        ];
    }
}
