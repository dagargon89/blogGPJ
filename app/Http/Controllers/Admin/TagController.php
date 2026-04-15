<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTagRequest;
use App\Http\Requests\Admin\UpdateTagRequest;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Tags/Index', [
            'tags' => Tag::withCount('posts')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Tags/Create');
    }

    public function store(StoreTagRequest $request): RedirectResponse
    {
        Tag::create($request->validated());

        return redirect()->route('admin.tags.index')
            ->with('success', 'Etiqueta creada correctamente.');
    }

    public function quickStore(Request $request): JsonResponse
    {
        abort_unless($request->user()->hasAnyRole(['admin', 'editor']), 403);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $base = Str::slug($request->string('name'));
        $slug = $base;
        $i = 1;

        while (Tag::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        $tag = Tag::create([
            'name' => $request->string('name'),
            'slug' => $slug,
        ]);

        return response()->json(['id' => $tag->id, 'name' => $tag->name]);
    }

    public function edit(Tag $tag): Response
    {
        return Inertia::render('Admin/Tags/Edit', [
            'tag' => $tag,
        ]);
    }

    public function update(UpdateTagRequest $request, Tag $tag): RedirectResponse
    {
        $tag->update($request->validated());

        return redirect()->route('admin.tags.index')
            ->with('success', 'Etiqueta actualizada correctamente.');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();

        return redirect()->route('admin.tags.index')
            ->with('success', 'Etiqueta eliminada correctamente.');
    }
}
