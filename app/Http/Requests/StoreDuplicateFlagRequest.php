<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDuplicateFlagRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\DuplicateFlag::class);
    }

    public function rules(): array
    {
        return [
            'duplicate_of_listing_id' => [
                'required',
                'exists:listings,id',
                Rule::notIn([$this->route('listing')->id]), // can't be a duplicate of itself
            ],
        ];
    }
}
