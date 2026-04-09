<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePostRequest;
use App\Http\Requests\Admin\UpdatePostRequest;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(): Response
    {
        $posts = Post::with(['category', 'author'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts->through(fn (Post $post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'content_type' => $post->content_type,
                'status' => $post->status,
                'category' => $post->category->name,
                'author' => $post->author->name,
                'published_at' => $post->published_at?->format('d M, Y'),
                'created_at' => $post->created_at->format('d M, Y'),
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Posts/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'tags' => Tag::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['featured_image', 'document', 'tag_ids']);

        if ($request->hasFile('featured_image')) {
            $data['featured_image_path'] = Storage::disk('firebase')->put('posts/covers', $request->file('featured_image'));
        }

        if ($request->hasFile('document')) {
            $data['document_path'] = Storage::disk('firebase')->put('posts/documents', $request->file('document'));
        }

        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $post = $request->user()->posts()->create($data);
        $post->tags()->sync($request->validated('tag_ids', []));

        Cache::forget('home_recent_posts');

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post creado correctamente.');
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('Admin/Posts/Edit', [
            'post' => array_merge($post->toArray(), [
                'tag_ids' => $post->tags()->pluck('tags.id'),
                'featured_image_url' => $post->featured_image_path
                    ? Storage::disk('firebase')->url($post->featured_image_path)
                    : null,
            ]),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'tags' => Tag::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $data = $request->safe()->except(['featured_image', 'document', 'tag_ids', 'remove_featured_image']);

        if ($request->hasFile('featured_image')) {
            if ($post->featured_image_path) {
                Storage::disk('firebase')->delete($post->featured_image_path);
            }
            $data['featured_image_path'] = Storage::disk('firebase')->put('posts/covers', $request->file('featured_image'));
        } elseif ($request->boolean('remove_featured_image')) {
            if ($post->featured_image_path) {
                Storage::disk('firebase')->delete($post->featured_image_path);
            }
            $data['featured_image_path'] = null;
        }

        if ($request->hasFile('document')) {
            if ($post->document_path) {
                Storage::disk('firebase')->delete($post->document_path);
            }
            $data['document_path'] = Storage::disk('firebase')->put('posts/documents', $request->file('document'));
        }

        if ($data['status'] === 'published' && ! $post->published_at) {
            $data['published_at'] = now();
        }

        $post->update($data);
        $post->tags()->sync($request->validated('tag_ids', []));

        Cache::forget('home_recent_posts');

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post actualizado correctamente.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();
        Cache::forget('home_recent_posts');

        return redirect()->route('admin.posts.index')
            ->with('success', 'Post eliminado correctamente.');
    }
}
