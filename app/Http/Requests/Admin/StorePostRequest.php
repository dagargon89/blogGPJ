<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\PostUploadValidationMessages;
use App\Support\YoutubeVideoId;
use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    use PostUploadValidationMessages;

    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['admin', 'editor']);
    }

    protected function prepareForValidation(): void
    {
        if (! $this->has('youtube_video_id')) {
            return;
        }

        if ($this->input('content_type') !== 'video') {
            $this->merge(['youtube_video_id' => null]);

            return;
        }

        $this->merge([
            'youtube_video_id' => YoutubeVideoId::normalize($this->input('youtube_video_id')),
        ]);
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:posts,slug', 'regex:/^[a-z0-9-]+$/'],
            'excerpt' => ['required', 'string'],
            'content_type' => ['required', 'in:article,video,infographic,document'],
            'status' => ['required', 'in:draft,published,archived'],
            'category_id' => ['required', 'exists:categories,id'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['exists:tags,id'],
            'content' => ['nullable', 'string'],
            'youtube_video_id' => ['nullable', 'string', 'max:11', 'regex:/^[a-zA-Z0-9_-]{11}$/', 'required_if:content_type,video'],
            'featured_image' => ['nullable', 'file', 'image', 'max:5120'],
            'document' => ['nullable', 'file', 'mimes:pdf,doc,docx,png,jpg,jpeg', 'max:20480'],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
