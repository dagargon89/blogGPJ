<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin GPJ',
            'email' => 'admin@bloggpj.test',
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        $editor = User::factory()->create([
            'name' => 'Editor GPJ',
            'email' => 'editor@bloggpj.test',
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        $categories = collect([
            ['name' => 'Inteligencia Artificial', 'description' => 'Novedades, herramientas y buenas prácticas de IA aplicada.'],
            ['name' => 'Recursos Humanos', 'description' => 'Cultura, procesos y bienestar del equipo.'],
            ['name' => 'Tecnología', 'description' => 'Ingeniería, plataformas y mejores prácticas técnicas.'],
            ['name' => 'Comunicación Interna', 'description' => 'Anuncios, cambios y comunicados oficiales.'],
        ])->map(fn (array $data): Category => Category::factory()->create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
            'description' => $data['description'],
        ]));

        $tags = collect(['Productividad', 'Herramientas', 'Onboarding', 'Seguridad', 'Cultura', 'Innovación', 'Procesos', 'Guía'])
            ->map(fn (string $name): Tag => Tag::factory()->create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]));

        $authors = collect([$admin, $editor]);

        $categories->each(function (Category $category) use ($authors, $tags): void {
            Post::factory()
                ->count(3)
                ->sequence(
                    fn ($sequence): array => [
                        'user_id' => $authors->random()->id,
                        'category_id' => $category->id,
                    ]
                )
                ->create()
                ->each(fn (Post $post) => $post->tags()->sync($tags->random(rand(1, 3))->pluck('id')));

            Post::factory()
                ->video()
                ->create([
                    'user_id' => $authors->random()->id,
                    'category_id' => $category->id,
                ])
                ->tags()->sync($tags->random(2)->pluck('id'));
        });

        Post::factory()
            ->draft()
            ->create([
                'user_id' => $admin->id,
                'category_id' => $categories->first()->id,
            ]);
    }
}
