<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Listing::class);
    }

    public function rules(): array
    {
        return [
            'house_type' => ['required', 'string', 'max:255'],
            'last_monthly_rent' => ['required', 'numeric', 'min:0'],
            'deposit_amount' => ['nullable', 'numeric', 'min:0'],
            'move_out_date' => ['required', 'date'],
            'is_vacancy_confirmed_by_reporter' => ['sometimes', 'boolean'],
            'directions' => ['nullable', 'string'],
        ];
    }
}
