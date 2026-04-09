<?php

namespace App\Http\Requests\Admin;

use App\Models\Post;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('access-admin') ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Post|null $post */
        $post = $this->route('post');

        return [
            'title' => ['required', 'string', 'max:200'],
            'slug' => [
                'nullable',
                'string',
                'max:220',
                Rule::unique('posts', 'slug')->ignore($post?->id),
            ],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'excerpt' => ['required', 'string', 'max:500'],
            'content_type' => ['required', Rule::in(['article', 'video', 'infographic', 'document'])],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'content' => ['nullable', 'string', 'required_if:content_type,article'],
            'youtube_video_id' => [
                'nullable',
                'string',
                'max:32',
                'required_if:content_type,video',
            ],
            'featured_image' => ['nullable', 'image', 'max:4096'],
            'document' => [
                'nullable',
                'file',
                'mimes:pdf,png,jpg,jpeg,webp',
                'max:10240',
                Rule::requiredIf(
                    fn (): bool => in_array($this->input('content_type'), ['infographic', 'document'], true)
                        && $post?->document_path === null
                ),
            ],
            'published_at' => ['nullable', 'date'],
            'tags' => ['array'],
            'tags.*' => ['integer', 'exists:tags,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('slug') && $this->filled('title')) {
            $this->merge(['slug' => Str::slug((string) $this->input('title'))]);
        }
    }
}
