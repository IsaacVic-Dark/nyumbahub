<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResolveDuplicateFlagRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('resolve', \App\Models\DuplicateFlag::class);
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:confirmed,rejected'],
        ];
    }
}
