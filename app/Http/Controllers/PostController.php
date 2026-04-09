<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Post::published()->with(['category', 'author', 'tags']);

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }

        if ($request->filled('type')) {
            $query->where('content_type', $request->type);
        }

        if ($request->filled('tag')) {
            $query->whereHas('tags', fn ($q) => $q->where('slug', $request->tag));
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('excerpt', 'like', "%{$request->search}%");
            });
        }

        $posts = $query->latest('published_at')->paginate(12)->withQueryString();

        return Inertia::render('Blog/Index', [
            'posts' => $posts->through(fn (Post $post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'content_type' => $post->content_type,
                'featured_image_path' => $post->featured_image_path
                    ? Storage::disk('firebase')->url($post->featured_image_path)
                    : null,
                'category' => ['name' => $post->category->name, 'slug' => $post->category->slug],
                'tags' => $post->tags->map(fn ($t) => ['name' => $t->name, 'slug' => $t->slug]),
                'author' => $post->author->name,
                'published_at' => $post->published_at?->format('d M, Y'),
            ]),
            'categories' => Category::orderBy('name')->get(['id', 'name', 'slug']),
            'tags' => Tag::orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => $request->only(['category', 'type', 'tag', 'search']),
        ]);
    }

    public function show(Post $post): Response
    {
        abort_unless($post->status === 'published', 404);

        $post->load(['category', 'tags', 'author']);

        $tagIds = $post->tags->pluck('id');

        $relatedQuery = Post::published()
            ->where('id', '!=', $post->id)
            ->with(['category', 'author']);

        if ($tagIds->isNotEmpty()) {
            $relatedQuery->whereHas('tags', fn ($q) => $q->whereIn('tags.id', $tagIds));
        } else {
            $relatedQuery->where('category_id', $post->category_id);
        }

        $relatedPosts = $relatedQuery
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(fn (Post $p) => [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'excerpt' => $p->excerpt,
                'content_type' => $p->content_type,
                'featured_image_path' => $p->featured_image_path
                    ? Storage::disk('firebase')->url($p->featured_image_path)
                    : null,
                'category' => ['name' => $p->category->name, 'slug' => $p->category->slug],
                'tags' => [],
                'author' => $p->author->name,
                'published_at' => $p->published_at?->format('d M, Y'),
            ])
            ->values();

        return Inertia::render('Blog/Show', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'excerpt' => preg_replace('/(\*{1,2}|_{1,2})(.*?)\1/', '$2', $post->excerpt ?? ''),
                'content' => $post->content,
                'content_type' => $post->content_type,
                'media' => [
                    'cover' => $post->featured_image_path
                        ? Storage::disk('firebase')->url($post->featured_image_path)
                        : null,
                    'youtube_id' => $post->youtube_video_id,
                    'document' => $post->document_url, // already a full URL (Google Drive or Firebase)
                ],
                'category' => ['name' => $post->category->name, 'slug' => $post->category->slug],
                'tags' => $post->tags->map(fn ($t) => ['name' => $t->name, 'slug' => $t->slug]),
                'author' => $post->author->name,
                'published_at' => $post->published_at?->format('d M, Y'),
            ],
            'related_posts' => $relatedPosts,
        ]);
    }
}
