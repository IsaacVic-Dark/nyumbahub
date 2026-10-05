<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreListingEvidenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', [\App\Models\ListingEvidence::class, $this->route('listing')]);
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:phone_otp,photo,video,receipt,agreement,national_id'],
            'file_path' => ['nullable', 'string'],
        ];
    }
}
