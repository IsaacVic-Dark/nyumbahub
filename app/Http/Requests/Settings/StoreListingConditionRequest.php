<?php

namespace App\Http\Requests;

use App\Policies\ListingConditionPolicy;
use Illuminate\Foundation\Http\FormRequest;

// Covers both create and update — condition is a 1:1 "upsert" resource
// (README §4.1 step 3), so the controller uses updateOrCreate.
//
// Called directly on the policy (rather than $this->user()->can(...)) since
// this ability is keyed by the parent Listing, not by ListingCondition
// itself — Laravel's can() would resolve the wrong policy class here.
class StoreListingConditionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return app(ListingConditionPolicy::class)->manage($this->user(), $this->route('listing'));
    }

    public function rules(): array
    {
        return [
            'water' => ['nullable', 'string'],
            'electricity' => ['nullable', 'string'],
            'internet' => ['nullable', 'string'],
            'plumbing' => ['nullable', 'string'],
            'kitchen' => ['nullable', 'string'],
            'walls_floors' => ['nullable', 'string'],
            'natural_light' => ['nullable', 'string'],
            'noise' => ['nullable', 'string'],
            'security' => ['nullable', 'string'],
            'parking' => ['nullable', 'string'],
            'garbage_collection' => ['nullable', 'string'],
            'has_lift' => ['nullable', 'boolean'],
            'pest_mould_leakage_history' => ['nullable', 'string'],
            'expected_hidden_costs' => ['nullable', 'array'],
        ];
    }
}
