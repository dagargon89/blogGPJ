<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $contentTypeLabels = [
            'article' => 'Artículo',
            'video' => 'Video',
            'infographic' => 'Infografía',
            'document' => 'Documento',
        ];

        $postsByTypePie = Post::selectRaw('content_type, count(*) as total')
            ->groupBy('content_type')
            ->get()
            ->map(fn ($row) => [
                'name' => $contentTypeLabels[$row->content_type] ?? $row->content_type,
                'value' => (int) $row->total,
            ])
            ->values()
            ->all();

        $postsByCategory = Post::selectRaw('categories.name, count(*) as total')
            ->join('categories', 'posts.category_id', '=', 'categories.id')
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->limit(6)
            ->get()
            ->map(fn ($row) => ['name' => $row->name, 'total' => (int) $row->total])
            ->all();

        $months = collect(range(5, 0))->map(fn ($i) => now()->subMonths($i)->format('Y-m'));

        $rawMonthly = Post::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, count(*) as total")
            ->where('created_at', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->pluck('total', 'month');

        $postsByMonth = $months->map(function ($month) use ($rawMonthly) {
            $date = now()->createFromFormat('Y-m', $month);

            return [
                'month' => $month,
                'label' => ucfirst($date->locale('es')->isoFormat('MMM YY')),
                'total' => (int) ($rawMonthly[$month] ?? 0),
            ];
        })->values()->all();

        $recentPosts = Post::with(['category', 'author'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Post $post) => [
                'id' => $post->id,
                'title' => $post->title,
                'content_type' => $post->content_type,
                'status' => $post->status,
                'category' => $post->category->name,
                'author' => $post->author->name,
                'created_at' => $post->created_at->format('d M, Y'),
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'totalPosts' => Post::count(),
                'publishedPosts' => Post::where('status', 'published')->count(),
                'draftPosts' => Post::where('status', 'draft')->count(),
                'archivedPosts' => Post::where('status', 'archived')->count(),
                'totalCategories' => Category::count(),
                'totalTags' => Tag::count(),
                'totalUsers' => User::count(),
            ],
            'postsByType' => $postsByTypePie,
            'postsByCategory' => $postsByCategory,
            'postsByMonth' => $postsByMonth,
            'recentPosts' => $recentPosts,
        ]);
    }
}
