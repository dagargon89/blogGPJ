<?php

use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'editor', 'guard_name' => 'web']);
});

// --- Category quick-store ---

test('admin can quick-store a category', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');

    $response = $this->actingAs($user)
        ->postJson('/admin/categories/quick-store', ['name' => 'Nueva Cat']);

    $response->assertOk()
        ->assertJsonStructure(['id', 'name'])
        ->assertJsonFragment(['name' => 'Nueva Cat']);

    $this->assertDatabaseHas('categories', ['name' => 'Nueva Cat', 'slug' => 'nueva-cat']);
});

test('category quick-store auto-generates a unique slug on collision', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');

    Category::factory()->create(['name' => 'Tech', 'slug' => 'tech']);

    $response = $this->actingAs($user)
        ->postJson('/admin/categories/quick-store', ['name' => 'Tech']);

    $response->assertOk();
    $this->assertDatabaseHas('categories', ['slug' => 'tech-1']);
});

test('category quick-store requires a name', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');

    $this->actingAs($user)
        ->postJson('/admin/categories/quick-store', ['name' => ''])
        ->assertUnprocessable();
});

test('editor cannot quick-store a category', function () {
    $user = User::factory()->create();
    $user->assignRole('editor');

    $this->actingAs($user)
        ->postJson('/admin/categories/quick-store', ['name' => 'Bloqueado'])
        ->assertForbidden();
});

test('guest cannot quick-store a category', function () {
    $this->postJson('/admin/categories/quick-store', ['name' => 'Test'])
        ->assertUnauthorized();
});

// --- Tag quick-store ---

test('admin can quick-store a tag', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');

    $response = $this->actingAs($user)
        ->postJson('/admin/tags/quick-store', ['name' => 'Laravel']);

    $response->assertOk()
        ->assertJsonStructure(['id', 'name'])
        ->assertJsonFragment(['name' => 'Laravel']);

    $this->assertDatabaseHas('tags', ['name' => 'Laravel', 'slug' => 'laravel']);
});

test('editor can quick-store a tag', function () {
    $user = User::factory()->create();
    $user->assignRole('editor');

    $response = $this->actingAs($user)
        ->postJson('/admin/tags/quick-store', ['name' => 'React']);

    $response->assertOk()
        ->assertJsonFragment(['name' => 'React']);
});

test('tag quick-store auto-generates a unique slug on collision', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');

    Tag::factory()->create(['name' => 'PHP', 'slug' => 'php']);

    $response = $this->actingAs($user)
        ->postJson('/admin/tags/quick-store', ['name' => 'PHP']);

    $response->assertOk();
    $this->assertDatabaseHas('tags', ['slug' => 'php-1']);
});

test('tag quick-store requires a name', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');

    $this->actingAs($user)
        ->postJson('/admin/tags/quick-store', ['name' => ''])
        ->assertUnprocessable();
});

test('guest cannot quick-store a tag', function () {
    $this->postJson('/admin/tags/quick-store', ['name' => 'Test'])
        ->assertUnauthorized();
});
