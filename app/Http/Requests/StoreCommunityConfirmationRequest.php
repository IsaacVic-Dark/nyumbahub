<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommunityConfirmationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\CommunityConfirmation::class);
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:still_vacant,new_tenant_moved_in,occupied,rent_changed,building_not_found,information_inaccurate'],
            // Required only when type = rent_changed (README §4.5.3)
            'reported_rent_amount' => ['required_if:type,rent_changed', 'nullable', 'numeric', 'min:0'],
            // Required only when type = new_tenant_moved_in (README §4.5.1 — signed tenancy agreement)
            'evidence_id' => ['required_if:type,new_tenant_moved_in', 'nullable', 'exists:listing_evidence,id'],
        ];
    }
}
