<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateListingCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('comment'));
    }

    public function rules(): array
    {
        return [
            'body' => ['sometimes', 'required', 'string'],
            'relationship_tag' => ['nullable', 'in:past_tenant,current_tenant,visitor'],
        ];
    }
}
