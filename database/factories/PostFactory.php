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
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = rtrim($this->faker->unique()->sentence(6), '.');
        $paragraphs = collect($this->faker->paragraphs(5))
            ->map(fn (string $p): string => '<p>'.$p.'</p>')
            ->implode("\n");

        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.$this->faker->unique()->numberBetween(1, 99999),
            'excerpt' => $this->faker->sentence(20),
            'content' => $paragraphs,
            'content_type' => 'article',
            'status' => 'published',
            'featured_image_path' => null,
            'youtube_video_id' => null,
            'document_path' => null,
            'published_at' => now()->subDays($this->faker->numberBetween(0, 30)),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (): array => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    public function video(): static
    {
        return $this->state(fn (): array => [
            'content_type' => 'video',
            'youtube_video_id' => $this->faker->randomElement([
                'dQw4w9WgXcQ',
                'jNQXAC9IVRw',
                '9bZkp7q19f0',
                'kJQP7kiw5Fk',
            ]),
        ]);
    }

    public function document(): static
    {
        return $this->state(fn (): array => [
            'content_type' => 'document',
            'document_path' => 'posts/documents/sample.pdf',
        ]);
    }

    public function infographic(): static
    {
        return $this->state(fn (): array => [
            'content_type' => 'infographic',
            'featured_image_path' => 'posts/infographics/sample.jpg',
        ]);
    }
}
