<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

// Eligibility rule from README §4.6 ("must be linked to a building in this
// sub-estate, either as a listing reporter or a self-tagged comment") is
// enforced here rather than in the policy, since it needs a DB query
// against the specific sub-estate in the route, not just role/ownership.
class StoreSubEstateRatingRequest extends FormRequest
{
    public function authorize(): bool
    {
        if (! $this->user()->can('create', \App\Models\SubEstateRating::class)) {
            return false;
        }

        $subEstateId = $this->route('subEstate')->id;
        $userId = $this->user()->id;

        $hasListing = \App\Models\Listing::whereHas(
            'building', fn ($q) => $q->where('sub_estate_id', $subEstateId)
        )->where('user_id', $userId)->exists();

        $hasComment = \App\Models\ListingComment::where('user_id', $userId)
            ->whereHas('listing.building', fn ($q) => $q->where('sub_estate_id', $subEstateId))
            ->exists();

        return $hasListing || $hasComment;
    }

    public function rules(): array
    {
        return [
            'security_rating' => ['required', 'integer', 'between:1,5'],
            'power_rating' => ['required', 'integer', 'between:1,5'],
            'water_rating' => ['required', 'integer', 'between:1,5'],
            'network_rating' => ['required', 'integer', 'between:1,5'],
        ];
    }
}
