<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\PostUploadValidationMessages;
use App\Support\YoutubeVideoId;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    use PostUploadValidationMessages;

    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['admin', 'editor']);
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('youtube_video_id')) {
            if ($this->input('content_type') !== 'video') {
                $this->merge(['youtube_video_id' => null]);
            } else {
                $this->merge([
                    'youtube_video_id' => YoutubeVideoId::normalize($this->input('youtube_video_id')),
                ]);
            }
        }

        if ($this->has('document_url')) {
            if (! in_array($this->input('content_type'), ['document', 'infographic'], true)) {
                $this->merge(['document_url' => null]);
            } else {
                $raw = $this->input('document_url');
                $url = is_string($raw) ? trim($raw) : '';
                $this->merge(['document_url' => $url === '' ? null : $url]);
            }
        }
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('posts', 'slug')->ignore($this->route('post')), 'regex:/^[a-z0-9-]+$/'],
            'excerpt' => ['required', 'string'],
            'content_type' => ['required', 'in:article,video,infographic,document'],
            'status' => ['required', 'in:draft,published,archived'],
            'category_id' => ['required', 'exists:categories,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['exists:tags,id'],
            'content' => ['nullable', 'string'],
            'youtube_video_id' => ['nullable', 'string', 'max:11', 'regex:/^[a-zA-Z0-9_-]{11}$/', 'required_if:content_type,video'],
            'featured_image' => ['nullable', 'file', 'image', 'max:5120'],
            'remove_featured_image' => ['sometimes', 'boolean'],
            'document_url' => [
                'nullable',
                'string',
                'max:2048',
                Rule::requiredIf(fn () => in_array($this->input('content_type'), ['document', 'infographic'], true)),
                'url:http,https',
            ],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
