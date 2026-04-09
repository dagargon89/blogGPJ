<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(6, true);
        $contentType = fake()->randomElement(['article', 'video', 'infographic', 'document']);
        $status = fake()->randomElement(['draft', 'published', 'archived']);

        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => rtrim($title, '.'),
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1, 9999),
            'excerpt' => fake()->paragraph(2),
            'content' => $contentType === 'article' ? '<p>'.implode('</p><p>', fake()->paragraphs(4)).'</p>' : null,
            'content_type' => $contentType,
            'status' => $status,
            'featured_image_path' => null,
            'youtube_video_id' => $contentType === 'video' ? fake()->regexify('[A-Za-z0-9_-]{11}') : null,
            'document_path' => in_array($contentType, ['document', 'infographic']) ? 'documents/sample.pdf' : null,
            'published_at' => $status === 'published' ? now()->subDays(fake()->numberBetween(1, 60)) : null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now()->subDays(fake()->numberBetween(1, 30)),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    public function article(): static
    {
        return $this->state(fn (array $attributes) => [
            'content_type' => 'article',
            'content' => '<p>'.implode('</p><p>', fake()->paragraphs(4)).'</p>',
            'youtube_video_id' => null,
            'document_path' => null,
        ]);
    }
}
