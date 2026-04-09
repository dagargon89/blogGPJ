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
                'featured_image_path' => $post->featured_image_path,
                'category' => ['name' => $post->category->name, 'slug' => $post->category->slug],
                'tags' => $post->tags->map(fn ($t) => ['name' => $t->name, 'slug' => $t->slug]),
                'author' => $post->author->name,
                'published_at' => $post->published_at?->format('d M, Y'),
            ]),
            'categories' => Category::all(['id', 'name', 'slug']),
            'tags' => Tag::all(['id', 'name', 'slug']),
            'filters' => $request->only(['category', 'tag', 'search']),
        ]);
    }

    public function show(Post $post): Response
    {
        abort_unless($post->status === 'published', 404);

        $post->load(['category', 'tags', 'author']);

        return Inertia::render('Blog/Show', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'content_type' => $post->content_type,
                'media' => [
                    'cover' => $post->featured_image_path
                        ? Storage::disk('firebase')->url($post->featured_image_path)
                        : null,
                    'youtube_id' => $post->youtube_video_id,
                    'document' => $post->document_path
                        ? Storage::disk('firebase')->url($post->document_path)
                        : null,
                ],
                'category' => ['name' => $post->category->name, 'slug' => $post->category->slug],
                'tags' => $post->tags->map(fn ($t) => ['name' => $t->name, 'slug' => $t->slug]),
                'author' => $post->author->name,
                'published_at' => $post->published_at?->format('d M, Y'),
            ],
        ]);
    }
}
