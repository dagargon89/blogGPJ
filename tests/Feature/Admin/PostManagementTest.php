<?php

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;

test('non-admin cannot access posts index', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user)
        ->get(route('admin.posts.index'))
        ->assertForbidden();
});

test('admin can list posts', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    Post::factory()->count(2)->create();

    $this->actingAs($admin)
        ->get(route('admin.posts.index'))
        ->assertOk();
});

test('admin can create an article post', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $category = Category::factory()->create();
    $tag = Tag::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.posts.store'), [
            'title' => 'Nuevo artículo',
            'excerpt' => 'Un extracto breve',
            'content' => '<p>Cuerpo del artículo</p>',
            'category_id' => $category->id,
            'content_type' => 'article',
            'status' => 'published',
            'tags' => [$tag->id],
        ])
        ->assertRedirect(route('admin.posts.index'));

    $post = Post::first();
    expect($post)->not->toBeNull();
    expect($post->slug)->toBe('nuevo-articulo');
    expect($post->tags)->toHaveCount(1);
    expect($post->published_at)->not->toBeNull();
});

test('video post requires a youtube id', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $category = Category::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.posts.store'), [
            'title' => 'Sin video',
            'excerpt' => 'extracto',
            'category_id' => $category->id,
            'content_type' => 'video',
            'status' => 'draft',
        ])
        ->assertSessionHasErrors('youtube_video_id');
});

test('admin can update a post', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $post = Post::factory()->create(['title' => 'Original']);

    $this->actingAs($admin)
        ->put(route('admin.posts.update', $post), [
            'title' => 'Actualizado',
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'category_id' => $post->category_id,
            'content_type' => 'article',
            'status' => 'published',
        ])
        ->assertRedirect(route('admin.posts.index'));

    expect($post->fresh()->title)->toBe('Actualizado');
});

test('admin can soft delete a post', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $post = Post::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.posts.destroy', $post))
        ->assertRedirect(route('admin.posts.index'));

    expect(Post::find($post->id))->toBeNull();
    expect(Post::withTrashed()->find($post->id))->not->toBeNull();
});
