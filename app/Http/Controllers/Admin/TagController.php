<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TagRequest;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(): Response
    {
        $tags = Tag::query()
            ->withCount('posts')
            ->orderBy('name')
            ->get()
            ->map(fn (Tag $tag): array => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
                'posts_count' => $tag->posts_count,
            ]);

        return Inertia::render('admin/tags/index', [
            'tags' => $tags,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/tags/create');
    }

    public function store(TagRequest $request): RedirectResponse
    {
        Tag::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Etiqueta creada correctamente.']);

        return redirect()->route('admin.tags.index');
    }

    public function edit(Tag $tag): Response
    {
        return Inertia::render('admin/tags/edit', [
            'tag' => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ],
        ]);
    }

    public function update(TagRequest $request, Tag $tag): RedirectResponse
    {
        $tag->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Etiqueta actualizada correctamente.']);

        return redirect()->route('admin.tags.index');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Etiqueta eliminada correctamente.']);

        return redirect()->route('admin.tags.index');
    }
}
