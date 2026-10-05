<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResolveFlaggedContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('resolve', \App\Models\FlaggedContent::class);
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:actioned,dismissed'],
        ];
    }
}
