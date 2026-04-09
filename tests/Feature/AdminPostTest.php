<?php

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'editor', 'guard_name' => 'web']);
});

test('guests cannot access admin posts', function () {
    $this->get('/admin/posts')->assertRedirect('/login');
});

test('admin can list posts', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');

    $this->actingAs($user)->get('/admin/posts')->assertStatus(200);
});

test('admin can create post', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');
    $category = Category::factory()->create();

    $this->actingAs($user)
        ->post('/admin/posts', [
            'title' => 'Mi primer post',
            'slug' => 'mi-primer-post',
            'excerpt' => 'Un resumen del post.',
            'content_type' => 'article',
            'status' => 'draft',
            'category_id' => $category->id,
            'content' => '<p>Contenido del post</p>',
        ])
        ->assertRedirect('/admin/posts');

    $this->assertDatabaseHas('posts', ['slug' => 'mi-primer-post']);
});

test('admin can delete post with soft delete', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');
    $post = Post::factory()->article()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->delete("/admin/posts/{$post->id}")
        ->assertRedirect('/admin/posts');

    $this->assertSoftDeleted('posts', ['id' => $post->id]);
});

test('editor can access admin posts list', function () {
    $user = User::factory()->create();
    $user->assignRole('editor');

    $this->actingAs($user)->get('/admin/posts')->assertStatus(200);
});

test('admin can remove featured image from post', function () {
    Storage::fake('firebase');

    $user = User::factory()->create();
    $user->assignRole('admin');
    $category = Category::factory()->create();
    $post = Post::factory()->article()->create([
        'user_id' => $user->id,
        'category_id' => $category->id,
        'featured_image_path' => 'posts/covers/remove-me.jpg',
    ]);
    Storage::disk('firebase')->put('posts/covers/remove-me.jpg', 'fake-image');

    $payload = [
        'title' => $post->title,
        'slug' => $post->slug,
        'excerpt' => $post->excerpt,
        'content_type' => $post->content_type,
        'status' => $post->status,
        'category_id' => $post->category_id,
        'tag_ids' => [],
        'content' => $post->content ?? '',
        'remove_featured_image' => true,
    ];

    if ($post->published_at) {
        $payload['published_at'] = $post->published_at->format('Y-m-d\TH:i');
    }

    $this->actingAs($user)
        ->put("/admin/posts/{$post->id}", $payload)
        ->assertRedirect('/admin/posts');

    $post->refresh();

    expect($post->featured_image_path)->toBeNull();
    Storage::disk('firebase')->assertMissing('posts/covers/remove-me.jpg');
});
