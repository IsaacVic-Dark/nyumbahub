<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreCommunityConfirmationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', [\App\Models\CommunityConfirmation::class, $this->route('listing')]);
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:still_vacant,new_tenant_moved_in,occupied,rent_changed,building_not_found,information_inaccurate'],
            // Required only when type = rent_changed (README §4.5.3)
            'reported_rent_amount' => ['required_if:type,rent_changed', 'nullable', 'numeric', 'min:0'],
            'note' => ['nullable', 'string', 'max:1000'],
            'visited_at' => ['nullable', 'date', 'before_or_equal:now'],
            'spoke_to_caretaker' => ['nullable', 'in:Yes,No,Nobody was available'],
            // Required only when type = new_tenant_moved_in (README §4.5.1 — signed tenancy agreement)
            'evidence_id' => [
                'required_if:type,new_tenant_moved_in',
                'nullable',
                Rule::exists('listing_evidence', 'id')
                    ->where('listing_id', $this->route('listing')->id)
                    ->where('type', 'agreement')
                    ->whereNull('deleted_at'),
            ],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator) {
            if ($this->input('type') === 'new_tenant_moved_in' && ! $this->user()->phone_verified_at) {
                $validator->errors()->add('type', 'Verify your phone number before reporting a new tenant.');
            }
        }];
    }
}
