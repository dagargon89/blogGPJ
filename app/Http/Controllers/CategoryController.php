<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function show(Category $category): Response
    {
        $posts = $category->posts()
            ->published()
            ->with(['author', 'tags'])
            ->latest('published_at')
            ->paginate(12);

        return Inertia::render('Category/Show', [
            'category' => $category->only(['id', 'name', 'slug', 'description', 'icon']),
            'posts' => $posts->through(fn ($post) => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'content_type' => $post->content_type,
                'featured_image_path' => $post->featured_image_path,
                'tags' => $post->tags->map(fn ($t) => ['name' => $t->name, 'slug' => $t->slug]),
                'author' => $post->author->name,
                'published_at' => $post->published_at?->format('d M, Y'),
            ]),
        ]);
    }
}
