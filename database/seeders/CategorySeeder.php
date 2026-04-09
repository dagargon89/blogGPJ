<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Inteligencia Artificial', 'description' => 'Artículos sobre IA, machine learning y automatización.', 'icon' => 'cpu'],
            ['name' => 'Recursos Humanos', 'description' => 'Gestión de talento, cultura organizacional y bienestar.', 'icon' => 'users'],
            ['name' => 'Tecnología', 'description' => 'Noticias y guías sobre herramientas y plataformas tecnológicas.', 'icon' => 'code'],
            ['name' => 'Liderazgo', 'description' => 'Estrategias, metodologías y mejores prácticas de liderazgo.', 'icon' => 'star'],
            ['name' => 'Comunicación', 'description' => 'Comunicación interna, presentaciones y habilidades blandas.', 'icon' => 'message-circle'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['slug' => Str::slug($category['name'])],
                array_merge($category, ['slug' => Str::slug($category['name'])])
            );
        }
    }
}
