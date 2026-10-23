<?php

namespace App\Support;

/** Validation for the extra listing columns collected by the post wizard. */
class ListingDetailsRules
{
    public static function rules(): array
    {
        return [
            'bedrooms' => ['nullable', 'integer', 'between:0,20'],
            'bathrooms' => ['nullable', 'integer', 'between:0,20'],
            'nearest_stage' => ['nullable', 'string', 'max:255'],
            'details' => ['nullable', 'array'],
            'details.floor' => ['nullable', 'string', 'max:100'],
            'details.furnishing' => ['nullable', 'in:Unfurnished,Partly furnished,Fully furnished'],
            'details.pets' => ['nullable', 'string', 'max:100'],
            'details.electricity' => ['nullable', 'string', 'max:100'],
            'details.water_source' => ['nullable', 'string', 'max:100'],
            'details.privacy' => ['nullable', 'in:public,verified_only'],
            'details.likely_vacant' => ['nullable', 'string', 'max:100'],
            'details.reporter_last_checked_at' => ['nullable', 'date'],
            'details.features' => ['nullable', 'array', 'max:20'],
            'details.features.*' => ['string', 'max:60'],
            'details.internet' => ['nullable', 'array', 'max:10'],
            'details.internet.*' => ['string', 'max:60'],
            'details.facilities' => ['nullable', 'array', 'max:20'],
            'details.facilities.*' => ['string', 'max:60'],
            // Private: never returned to anyone but the owner and admins.
            'details.block_wing' => ['nullable', 'string', 'max:100'],
            'details.unit_number' => ['nullable', 'string', 'max:50'],
        ];
    }
}
