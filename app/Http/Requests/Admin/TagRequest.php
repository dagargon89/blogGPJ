<?php

namespace App\Http\Requests\Admin;

use App\Models\Tag;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TagRequest extends FormRequest
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
        /** @var Tag|null $tag */
        $tag = $this->route('tag');

        return [
            'name' => ['required', 'string', 'max:60'],
            'slug' => [
                'nullable',
                'string',
                'max:80',
                Rule::unique('tags', 'slug')->ignore($tag?->id),
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('slug') && $this->filled('name')) {
            $this->merge(['slug' => Str::slug((string) $this->input('name'))]);
        }
    }
}
