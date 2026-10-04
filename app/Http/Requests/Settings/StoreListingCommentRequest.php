<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreListingCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\ListingComment::class);
    }

    public function rules(): array
    {
        return [
            'parent_comment_id' => ['nullable', 'exists:listing_comments,id'],
            'body' => ['required', 'string'],
            'relationship_tag' => ['nullable', 'in:past_tenant,current_tenant,visitor'],
        ];
    }
}
