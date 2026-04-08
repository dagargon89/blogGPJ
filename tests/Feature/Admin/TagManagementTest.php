<?php

use App\Models\Tag;
use App\Models\User;

test('guests are redirected away from admin tags', function () {
    $this->get(route('admin.tags.index'))->assertRedirect(route('login'));
});

test('admin can list tags', function () {
    Tag::factory()->count(2)->create();

    $admin = User::factory()->create(['is_admin' => true]);

    $this->actingAs($admin)
        ->get(route('admin.tags.index'))
        ->assertOk();
});

test('admin can create a tag', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $this->actingAs($admin)
        ->post(route('admin.tags.store'), ['name' => 'Liderazgo'])
        ->assertRedirect(route('admin.tags.index'));

    $this->assertDatabaseHas('tags', ['name' => 'Liderazgo', 'slug' => 'liderazgo']);
});

test('admin can delete a tag', function () {
    $tag = Tag::factory()->create();
    $admin = User::factory()->create(['is_admin' => true]);

    $this->actingAs($admin)
        ->delete(route('admin.tags.destroy', $tag))
        ->assertRedirect(route('admin.tags.index'));

    $this->assertDatabaseMissing('tags', ['id' => $tag->id]);
});
