<?php

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
