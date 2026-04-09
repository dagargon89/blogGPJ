<?php

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutVite();
    // Ensure roles table exists for Spatie
    Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'editor', 'guard_name' => 'web']);
});

test('guests cannot access admin categories', function () {
    $this->get('/admin/categories')->assertRedirect('/login');
});

test('admin can list categories', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');

    $this->actingAs($user)->get('/admin/categories')->assertStatus(200);
});

test('admin can create a category', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');

    $this->actingAs($user)
        ->post('/admin/categories', [
            'name' => 'Tecnología',
            'slug' => 'tecnologia',
            'description' => 'Todo sobre tech',
            'icon' => null,
        ])
        ->assertRedirect('/admin/categories');

    $this->assertDatabaseHas('categories', ['slug' => 'tecnologia']);
});

test('admin can update a category', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');
    $category = Category::factory()->create();

    $this->actingAs($user)
        ->put("/admin/categories/{$category->id}", [
            'name' => 'Nuevo nombre',
            'slug' => 'nuevo-nombre',
        ])
        ->assertRedirect('/admin/categories');

    $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'Nuevo nombre']);
});

test('admin can delete a category', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');
    $category = Category::factory()->create();

    $this->actingAs($user)
        ->delete("/admin/categories/{$category->id}")
        ->assertRedirect('/admin/categories');

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});
