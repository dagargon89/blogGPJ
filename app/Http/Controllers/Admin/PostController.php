<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PostRequest;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
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
            'status' => ['nullable', 'string', 'in:draft,published,archived'],
        ]);

        $posts = Post::query()
            ->with(['category', 'author'])
            ->when($filters['search'] ?? null, fn ($query, string $term) => $query->where('title', 'like', "%{$term}%"))
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Post $post): array => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'status' => $post->status,
                'content_type' => $post->content_type,
                'category' => $post->category?->name,
                'author' => $post->author?->name,
                'published_at' => $post->published_at?->toIso8601String(),
                'updated_at' => $post->updated_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/posts/create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'tags' => Tag::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(PostRequest $request): RedirectResponse
    {
        $data = $this->preparePayload($request);
        $data['user_id'] = $request->user()->id;

        $post = Post::create($data);
        $post->tags()->sync($request->input('tags', []));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicación creada correctamente.']);

        return redirect()->route('admin.posts.index');
    }

    public function edit(Post $post): Response
    {
        $post->load('tags');
        $disk = Storage::disk(config('filesystems.media'));

        return Inertia::render('admin/posts/edit', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'content_type' => $post->content_type,
                'status' => $post->status,
                'category_id' => $post->category_id,
                'youtube_video_id' => $post->youtube_video_id,
                'featured_image_url' => $post->featured_image_path ? $disk->url($post->featured_image_path) : null,
                'document_url' => $post->document_path ? $disk->url($post->document_path) : null,
                'published_at' => $post->published_at?->toDateTimeLocalString(),
                'tags' => $post->tags->pluck('id')->all(),
            ],
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'tags' => Tag::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(PostRequest $request, Post $post): RedirectResponse
    {
        $data = $this->preparePayload($request, $post);

        $post->update($data);
        $post->tags()->sync($request->input('tags', []));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicación actualizada correctamente.']);

        return redirect()->route('admin.posts.index');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Publicación eliminada correctamente.']);

        return redirect()->route('admin.posts.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function preparePayload(PostRequest $request, ?Post $post = null): array
    {
        $data = $request->safe()->except(['featured_image', 'document', 'tags']);
        $disk = Storage::disk(config('filesystems.media'));

        if ($request->hasFile('featured_image')) {
            if ($post?->featured_image_path) {
                $disk->delete($post->featured_image_path);
            }
            $data['featured_image_path'] = $request->file('featured_image')->store('posts/covers', config('filesystems.media'));
        }

        if ($request->hasFile('document')) {
            if ($post?->document_path) {
                $disk->delete($post->document_path);
            }
            $data['document_path'] = $request->file('document')->store('posts/documents', config('filesystems.media'));
        }

        $type = $data['content_type'] ?? null;
        if ($type !== 'video') {
            $data['youtube_video_id'] = null;
        }
        if ($type === 'article') {
            $data['document_path'] = $post?->document_path ?? null;
        }

        if (($data['status'] ?? null) === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        return $data;
    }
}
