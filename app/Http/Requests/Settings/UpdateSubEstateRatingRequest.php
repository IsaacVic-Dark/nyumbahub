<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubEstateRatingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('rating'));
    }

    public function rules(): array
    {
        return [
            'security_rating' => ['sometimes', 'required', 'integer', 'between:1,5'],
            'power_rating' => ['sometimes', 'required', 'integer', 'between:1,5'],
            'water_rating' => ['sometimes', 'required', 'integer', 'between:1,5'],
            'network_rating' => ['sometimes', 'required', 'integer', 'between:1,5'],
        ];
    }
}
