<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserNotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category,
            'icon' => $this->icon,
            'title' => $this->title,
            'body' => $this->body,
            'listing_id' => $this->listing_id,
            'unread' => $this->read_at === null,
            'created_at' => $this->created_at,
        ];
    }
}
