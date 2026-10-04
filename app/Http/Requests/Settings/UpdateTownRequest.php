<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTownRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('town'));
    }

    public function rules(): array
    {
        return [
            'county_id' => ['sometimes', 'required', 'exists:counties,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }
}
