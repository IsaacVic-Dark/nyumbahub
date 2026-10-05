<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubEstateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('subEstate'));
    }

    public function rules(): array
    {
        return [
            'estate_id' => ['sometimes', 'required', 'exists:estates,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }
}
