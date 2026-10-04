<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFlaggedContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\FlaggedContent::class);
    }

    public function rules(): array
    {
        return [
            'flaggable_type' => ['required', 'in:listing,comment'],
            'flaggable_id' => ['required', 'integer'],
            'reason' => ['required', 'in:building_not_found,information_inaccurate,fraud,safety,duplicate,policy'],
            'details' => ['nullable', 'string'],
        ];
    }
}
