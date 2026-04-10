<?php

use App\Models\Category;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(fn () => $this->withoutVite());

test('home page renders correctly', function () {
    $this->get('/')->assertStatus(200);
});

test('blog index renders correctly', function () {
    $this->get('/blog')->assertStatus(200);
});

test('published post is accessible on blog', function () {
    $post = Post::factory()->published()->article()->create();

    $this->get("/blog/{$post->slug}")->assertStatus(200);
});

test('draft post returns 404 on public blog', function () {
    $post = Post::factory()->draft()->article()->create();

    $this->get("/blog/{$post->slug}")->assertStatus(404);
});

test('blog filters by category', function () {
    $category = Category::factory()->create();
    Post::factory()->published()->article()->create(['category_id' => $category->id]);

    $this->get("/blog?category={$category->slug}")->assertStatus(200);
});

test('category show page renders', function () {
    $category = Category::factory()->create();

    $this->get("/categoria/{$category->slug}")->assertStatus(200);
});

test('category show exposes featured image as storage public url', function () {
    $category = Category::factory()->create();
    $storedPath = 'posts/covers/category-card.jpg';
    Post::factory()->published()->article()->create([
        'category_id' => $category->id,
        'featured_image_path' => $storedPath,
    ]);

    $this->get("/categoria/{$category->slug}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Category/Show')
            ->has('posts.data', 1)
            ->where(
                'posts.data.0.featured_image_path',
                fn (?string $url) => is_string($url) && $url !== $storedPath,
            ));
});
