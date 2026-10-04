<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', \App\Models\Setting::class);
    }

    public function rules(): array
    {
        return [
            'value' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ];
    }
}
