<?php

namespace App\Http\Requests;

use App\Policies\ListingReviewPolicy;
use Illuminate\Foundation\Http\FormRequest;

// See StoreListingConditionRequest for why this calls the policy directly.
class StoreListingReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return app(ListingReviewPolicy::class)->manage($this->user(), $this->route('listing'));
    }

    public function rules(): array
    {
        return [
            'lived_from' => ['nullable', 'date'],
            'lived_to' => ['nullable', 'date', 'after_or_equal:lived_from'],
            'pros' => ['nullable', 'string'],
            'cons' => ['nullable', 'string'],
            'how_repairs_handled' => ['nullable', 'string'],
            'recurring_issues' => ['nullable', 'string'],
            'rent_changed_during_stay' => ['sometimes', 'boolean'],
            'reason_for_leaving' => ['nullable', 'string'],
        ];
    }
}
