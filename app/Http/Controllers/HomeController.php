<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $recentPosts = Post::query()
            ->published()
            ->with(['category', 'author'])
            ->latest('published_at')
            ->limit(6)
            ->get()
            ->map(fn (Post $post): array => $this->transformCard($post));

        $featuredPost = Post::query()
            ->published()
            ->with(['category', 'author'])
            ->latest('published_at')
            ->first();

        $categories = Category::query()
            ->withCount(['posts' => fn ($query) => $query->published()])
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category): array => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'posts_count' => $category->posts_count,
            ]);

        return Inertia::render('home', [
            'featured' => $featuredPost ? $this->transformCard($featuredPost) : null,
            'recent' => $recentPosts,
            'categories' => $categories,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformCard(Post $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'content_type' => $post->content_type,
            'cover' => $post->featured_image_path
                ? Storage::disk(config('filesystems.media'))->url($post->featured_image_path)
                : null,
            'author' => $post->author?->name,
            'category' => $post->category ? [
                'name' => $post->category->name,
                'slug' => $post->category->slug,
            ] : null,
            'published_at' => $post->published_at?->toIso8601String(),
        ];
    }
}
