<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommunityConfirmationResource extends JsonResource
{
    private const SUMMARIES = [
        'still_vacant' => 'Found the home still vacant.',
        'occupied' => 'Reported that the home is no longer vacant.',
        'new_tenant_moved_in' => 'Reported that a new tenant has moved in.',
        'rent_changed' => 'Reported a rent change.',
        'building_not_found' => 'Could not confirm the home at this location.',
        'information_inaccurate' => 'Reported that some location details need correction.',
    ];

    public function toArray(Request $request): array
    {
        $viewer = $request->user('sanctum');
        $type = $this->type?->value;
        $author = $this->relationLoaded('user') ? $this->user : null;

        // Contributors are always anonymised: only a trust label is shown.
        $who = $author?->is_verified_contributor ? 'Trusted Tenant' : 'Verified community member';

        $text = trim(self::SUMMARIES[$type] ?? '');
        if ($type === 'rent_changed' && $this->reported_rent_amount !== null) {
            $text = 'Reported rent is now KES '.number_format((float) $this->reported_rent_amount).'.';
        }
        if (filled($this->note)) {
            $text .= ' '.$this->note;
        }

        return [
            'id' => $this->id,
            'listing_id' => $this->listing_id,
            'user_id' => $this->when($viewer?->isAdmin(), $this->user_id),
            'type' => $type,
            'who' => $who,
            'text' => trim($text),
            'note' => $this->note,
            'reported_rent_amount' => $this->reported_rent_amount !== null ? (float) $this->reported_rent_amount : null,
            'visited_at' => $this->visited_at,
            'helpful_count' => (int) ($this->getAttribute('helpful_voters_count') ?? 0),
            'is_helpful' => (bool) ($this->getAttribute('is_helpful') ?? false),
            'is_mine' => $viewer !== null && $viewer->id === $this->user_id,
            'created_at' => $this->created_at,
        ];
    }
}
