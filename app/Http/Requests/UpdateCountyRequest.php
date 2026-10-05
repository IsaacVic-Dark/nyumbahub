<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCountyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('county'));
    }

    public function rules(): array
    {
        $county = $this->route('county');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('counties', 'name')->whereNull('deleted_at')->ignore($county)],
            'code' => ['sometimes', 'nullable', 'string', 'regex:/^0(0[1-9]|[1-3][0-9]|4[0-7])$/', Rule::unique('counties', 'code')->whereNull('deleted_at')->ignore($county)],
            'latitude' => ['sometimes', 'nullable', 'numeric', 'between:-4.72,5.03'],
            'longitude' => ['sometimes', 'nullable', 'numeric', 'between:33.90,41.91'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.regex' => 'The code must be a 3-digit county code between 001 and 047.',
            'latitude.between' => 'The latitude must be within Kenya (-4.72 to 5.03).',
            'longitude.between' => 'The longitude must be within Kenya (33.90 to 41.91).',
        ];
    }
}