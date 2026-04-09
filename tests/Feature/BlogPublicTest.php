<?php

use App\Models\Category;
use App\Models\Post;

test('home page renders with published posts', function () {
    $category = Category::factory()->create();
    Post::factory()->count(3)->for($category)->create();

    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('home')
        ->has('recent', 3)
    );
});

test('blog index lists published posts and excludes drafts', function () {
    $category = Category::factory()->create();
    Post::factory()->for($category)->create(['title' => 'Visible post']);
    Post::factory()->for($category)->draft()->create(['title' => 'Hidden draft']);

    $response = $this->get(route('blog.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('blog/index')
        ->has('posts.data', 1)
    );
});

test('blog show returns 404 for draft posts', function () {
    $category = Category::factory()->create();
    $post = Post::factory()->for($category)->draft()->create();

    $this->get(route('blog.show', $post->slug))->assertNotFound();
});

test('blog show renders a published post', function () {
    $category = Category::factory()->create();
    $post = Post::factory()->for($category)->create();

    $response = $this->get(route('blog.show', $post->slug));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('blog/show')
        ->where('post.slug', $post->slug)
    );
});
