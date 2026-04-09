<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'posts_total' => Post::count(),
                'posts_published' => Post::where('status', 'published')->count(),
                'posts_drafts' => Post::where('status', 'draft')->count(),
                'categories' => Category::count(),
                'tags' => Tag::count(),
            ],
            'latest_posts' => Post::query()
                ->with(['category', 'author'])
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (Post $post): array => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'status' => $post->status,
                    'content_type' => $post->content_type,
                    'category' => $post->category?->name,
                    'author' => $post->author?->name,
                    'updated_at' => $post->updated_at?->toIso8601String(),
                ]),
        ]);
    }
}
