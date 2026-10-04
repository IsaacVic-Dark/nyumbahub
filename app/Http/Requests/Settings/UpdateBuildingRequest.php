<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBuildingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('building'));
    }

    public function rules(): array
    {
        return [
            'sub_estate_id' => ['sometimes', 'required', 'exists:sub_estates,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'directions' => ['nullable', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ];
    }
}
