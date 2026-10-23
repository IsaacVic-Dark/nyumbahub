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
            'label' => ['nullable', 'string', 'max:60'],
            // Upload a file (stored on the public disk)...
            'file' => [
                'required_without:file_path', 'file', 'max:51200', // 50 MB
                'mimetypes:image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm',
            ],
            // ...or, for API clients, reference an already-hosted path/URL.
            'file_path' => ['required_without:file', 'nullable', 'string'],
        ];
    }
}
