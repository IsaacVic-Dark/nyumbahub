<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ListingCommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'listing_id' => $this->listing_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'parent_comment_id' => $this->parent_comment_id,
            'body' => $this->body,
            'relationship_tag' => $this->relationship_tag?->value,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
