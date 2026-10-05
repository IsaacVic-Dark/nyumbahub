<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEstateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('estate'));
    }

    public function rules(): array
    {
        return [
            'town_id' => ['sometimes', 'required', 'exists:towns,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }
}
