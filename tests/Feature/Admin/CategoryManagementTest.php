<?php

use App\Models\Category;
use App\Models\User;

function adminUser(): User
{
    return User::factory()->create(['is_admin' => true]);
}

test('non-admin users cannot access category index', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this->actingAs($user)
        ->get(route('admin.categories.index'))
        ->assertForbidden();
});

test('admin can list categories', function () {
    Category::factory()->count(3)->create();

    $this->actingAs(adminUser())
        ->get(route('admin.categories.index'))
        ->assertOk();
});

test('admin can create a category', function () {
    $this->actingAs(adminUser())
        ->post(route('admin.categories.store'), [
            'name' => 'Innovación',
            'description' => 'Nuevas ideas',
        ])
        ->assertRedirect(route('admin.categories.index'));

    $this->assertDatabaseHas('categories', [
        'name' => 'Innovación',
        'slug' => 'innovacion',
    ]);
});

test('admin can update a category', function () {
    $category = Category::factory()->create(['name' => 'Old']);

    $this->actingAs(adminUser())
        ->put(route('admin.categories.update', $category), [
            'name' => 'Nuevo nombre',
            'slug' => $category->slug,
            'description' => 'descripción',
        ])
        ->assertRedirect(route('admin.categories.index'));

    expect($category->fresh()->name)->toBe('Nuevo nombre');
});

test('admin can delete a category', function () {
    $category = Category::factory()->create();

    $this->actingAs(adminUser())
        ->delete(route('admin.categories.destroy', $category))
        ->assertRedirect(route('admin.categories.index'));

    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});
