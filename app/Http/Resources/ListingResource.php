<?php

namespace App\Http\Resources;

use App\Enums\ListingStatus;
use App\Models\Listing;
use App\Models\ListingMedia;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Arr;

/** @mixin Listing */
class ListingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $viewer = $request->user('sanctum');
        $isOwner = $viewer && $viewer->id === $this->user_id;
        $isAdmin = (bool) $viewer?->isAdmin();

        $building = $this->relationLoaded('building') ? $this->building : null;
        $subEstate = $building?->subEstate;
        $estate = $subEstate?->estate;
        $town = $estate?->town;
        $county = $town?->county;

        $photos = $this->countOf('media_photos_count', fn () => $this->media()->where('type', 'photo')->count());
        $videos = $this->countOf('media_videos_count', fn () => $this->media()->where('type', 'video')->count());
        $scores = $this->relationLoaded('condition') ? ($this->condition?->scores ?? []) : [];

        // Directions: only for signed-in users, and only for verified members
        // when the reporter asked for that.
        $details = $this->details ?? [];
        $restricted = ($details['privacy'] ?? null) === 'verified_only'
            || ($this->relationLoaded('reporter') && $this->reporter?->privacy('directions_verified_only', false));
        $canSeeDirections = $viewer && (! $restricted || $isOwner || $isAdmin || $viewer->phone_verified_at);

        return [
            'id' => $this->id,
            'building_id' => $this->building_id,
            'title' => $this->title($estate?->name, $subEstate?->name),
            'house_type' => $this->house_type,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'last_monthly_rent' => (float) $this->last_monthly_rent,
            'deposit_amount' => $this->deposit_amount !== null ? (float) $this->deposit_amount : null,
            'move_out_date' => $this->move_out_date?->toDateString(),
            'is_vacancy_confirmed_by_reporter' => $this->is_vacancy_confirmed_by_reporter,
            'status' => $this->status?->value,
            'archive_reason' => $this->archive_reason?->value,
            'expires_at' => $this->expires_at,
            'trust_score' => $this->trust_score,
            'confirmed_count' => $this->confirmed_count,
            'last_confirmed_at' => $this->last_confirmed_at,

            'location' => $building ? [
                'county' => $county ? ['id' => $county->id, 'name' => $county->name] : null,
                'town' => $town ? ['id' => $town->id, 'name' => $town->name] : null,
                'estate' => $estate ? ['id' => $estate->id, 'name' => $estate->name] : null,
                'sub_estate' => $subEstate ? ['id' => $subEstate->id, 'name' => $subEstate->name] : null,
                // Exact building name is for signed-in users only ("shared with verified members").
                'building' => $viewer ? ['id' => $building->id, 'name' => $building->name] : null,
                // ~110 m precision: an approximate area, never the exact building point.
                'latitude' => $building->latitude !== null ? round((float) $building->latitude, 3) : null,
                'longitude' => $building->longitude !== null ? round((float) $building->longitude, 3) : null,
            ] : null,

            'directions' => $canSeeDirections ? $this->directions : null,
            'directions_restricted' => $restricted && ! $canSeeDirections && $viewer !== null,
            'nearest_stage' => $this->nearest_stage,
            // unit_number / block_wing are private: owner and admins only.
            'details' => $isOwner || $isAdmin ? $details : Arr::except($details, ['unit_number', 'block_wing']),

            'photos_count' => $photos,
            'has_video' => $videos > 0,
            'thumbnail' => ListingMedia::publicUrl($this->getAttribute('thumbnail_path')),
            'saved_count' => $this->countOf('saved_by_count', fn () => $this->savedBy()->count()),
            'is_saved' => (bool) ($this->getAttribute('is_saved') ?? false),
            'is_owner' => $isOwner,
            'rating' => Listing::averageScore($scores),
            'badges' => $this->badges($photos + $videos),

            'reporter' => $this->when($isOwner || $isAdmin, fn () => new UserResource($this->reporter)),
            'condition' => new ListingConditionResource($this->whenLoaded('condition')),
            'review' => new ListingReviewResource($this->whenLoaded('review')),
            'media' => ListingMediaResource::collection($this->whenLoaded('media')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    private function countOf(string $attribute, callable $fallback): int
    {
        return (int) ($this->getAttribute($attribute) ?? $fallback());
    }

    /** Verification badges derived from data we already hold. */
    private function badges(int $mediaCount): array
    {
        $r = $this->relationLoaded('reporter') ? $this->reporter : null;
        $badges = [];

        if ($r?->phone_verified_at) {
            $badges[] = 'phone';
        }
        if ($r?->national_id_verified_at) {
            $badges[] = 'id';
        }
        if ($r?->is_verified_contributor) {
            $badges[] = 'tenant';
        }
        if ($mediaCount > 0) {
            $badges[] = 'evidence';
        }
        if ($this->confirmed_count >= 2) {
            $badges[] = 'multi';
        }
        if ($this->updated_at?->gt(now()->subDays(7)) && $this->created_at?->lt(now()->subDay())) {
            $badges[] = 'updated';
        }

        return $badges;
    }
}
