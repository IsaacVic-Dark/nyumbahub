<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreListingMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', [\App\Models\ListingMedia::class, $this->route('listing')]);
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:photo,video'],
            // Swap for an actual `file` upload rule once storage is wired up;
            // accepting a pre-uploaded path/URL for now to match the schema.
            'file_path' => ['required', 'string'],
        ];
    }
}
