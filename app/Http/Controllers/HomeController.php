<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $recentPosts = Cache::remember('home_recent_posts', 3600, function () {
            return Post::published()
                ->with(['category', 'author'])
                ->latest('published_at')
                ->take(6)
                ->get()
                ->map(fn (Post $post) => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'content_type' => $post->content_type,
                    'featured_image_path' => $post->featured_image_path
                        ? Storage::disk('firebase')->url($post->featured_image_path)
                        : null,
                    'category' => ['name' => $post->category->name, 'slug' => $post->category->slug],
                    'author' => $post->author->name,
                    'published_at' => $post->published_at?->format('d M, Y'),
                ])
                ->values()
                ->toArray();
        });

        $categories = Cache::remember('home_categories', 3600, function () {
            return Category::withCount(['posts' => fn ($q) => $q->published()])
                ->orderByDesc('posts_count')
                ->get(['id', 'name', 'slug', 'icon', 'description'])
                ->values()
                ->toArray();
        });

        return Inertia::render('Home', [
            'recentPosts' => $recentPosts,
            'categories' => $categories,
        ]);
    }
}
