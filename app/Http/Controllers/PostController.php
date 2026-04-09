<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'exists:categories,slug'],
            'type' => ['nullable', 'string', 'in:article,video,infographic,document'],
        ]);

        $posts = Post::query()
            ->published()
            ->with(['category', 'author'])
            ->when($filters['search'] ?? null, fn ($query, string $term) => $query->where(function ($q) use ($term): void {
                $q->where('title', 'like', "%{$term}%")
                    ->orWhere('excerpt', 'like', "%{$term}%");
            }))
            ->when($filters['category'] ?? null, fn ($query, string $slug) => $query->whereHas(
                'category',
                fn ($q) => $q->where('slug', $slug)
            ))
            ->when($filters['type'] ?? null, fn ($query, string $type) => $query->where('content_type', $type))
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Post $post): array => [
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
            ]);

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('blog/index', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'category' => $filters['category'] ?? '',
                'type' => $filters['type'] ?? '',
            ],
        ]);
    }

    public function show(Post $post): Response
    {
        abort_unless(
            $post->status === 'published' && $post->published_at !== null && $post->published_at->isPast(),
            404
        );

        $post->load(['category', 'tags', 'author']);

        $disk = Storage::disk(config('filesystems.media'));

        return Inertia::render('blog/show', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'content_type' => $post->content_type,
                'media' => [
                    'cover' => $post->featured_image_path ? $disk->url($post->featured_image_path) : null,
                    'youtube_id' => $post->youtube_video_id,
                    'document' => $post->document_path ? $disk->url($post->document_path) : null,
                ],
                'author' => $post->author?->name,
                'category' => $post->category ? [
                    'name' => $post->category->name,
                    'slug' => $post->category->slug,
                ] : null,
                'tags' => $post->tags->map(fn ($tag): array => [
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                ])->all(),
                'published_at' => $post->published_at?->toIso8601String(),
            ],
        ]);
    }
}
