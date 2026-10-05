<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('listing'));
    }

    public function rules(): array
    {
        return [
            'house_type' => ['sometimes', 'required', 'string', 'max:255'],
            'last_monthly_rent' => ['sometimes', 'required', 'numeric', 'min:0'],
            'deposit_amount' => ['nullable', 'numeric', 'min:0'],
            'move_out_date' => ['sometimes', 'required', 'date'],
            'is_vacancy_confirmed_by_reporter' => ['sometimes', 'boolean'],
            'directions' => ['nullable', 'string'],
            // Deliberately no `status`/`archive_reason` here — those change
            // only through Listing::transitionTo() (workflow/jobs), never a
            // raw field edit, so the audit trail in listing_status_histories
            // can't be bypassed.
        ];
    }
}
