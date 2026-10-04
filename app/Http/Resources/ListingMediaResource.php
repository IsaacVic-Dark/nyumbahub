<?php

namespace App\Http\Resources;

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
            'url' => $this->file_path, // swap for Storage::url() once a disk is wired up
            'created_at' => $this->created_at,
        ];
    }
}
