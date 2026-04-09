import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { PostCard } from '@/components/cards/PostCard';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content_type: string;
    featured_image_path: string | null;
    category: { name: string; slug: string };
    tags: { name: string; slug: string }[];
    author: string;
    published_at: string | null;
}

interface PaginatedPosts {
    data: Post[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: { current_page: number; last_page: number; total: number };
}

interface BlogIndexProps {
    posts: PaginatedPosts;
    categories: { id: number; name: string; slug: string }[];
    tags: { id: number; name: string; slug: string }[];
    filters: { category?: string; tag?: string; search?: string };
}

export default function BlogIndex({ posts, categories, tags, filters }: BlogIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const applyFilter = useCallback((params: Record<string, string>) => {
        router.get('/blog', { ...filters, ...params }, { preserveState: true, replace: true });
    }, [filters]);

    const clearFilters = () => {
        setSearch('');
        router.get('/blog', {}, { preserveState: false });
    };

    const hasFilters = filters.category || filters.tag || filters.search;

    return (
        <PublicLayout>
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
                <h1 className="mb-2 text-3xl font-bold text-foreground">Blog</h1>
                <p className="mb-8 text-muted-foreground">
                    {posts.meta.total} publicación{posts.meta.total !== 1 ? 'es' : ''}
                </p>

                {/* Filters */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter({ search })}
                            placeholder="Buscar publicaciones..."
                            className="pl-9"
                        />
                    </div>

                    {/* Category filter */}
                    <select
                        value={filters.category ?? ''}
                        onChange={(e) => applyFilter({ category: e.target.value })}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.slug}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="mr-1 h-4 w-4" />
                            Limpiar
                        </Button>
                    )}
                </div>

                {/* Active tag filter */}
                {filters.tag && (
                    <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                        Etiqueta:
                        <CategoryBadge name={filters.tag} slug={filters.tag} variant="tag" />
                    </div>
                )}

                {/* Posts grid */}
                {posts.data.length === 0 ? (
                    <div className="py-16 text-center text-muted-foreground">
                        No se encontraron publicaciones con los filtros seleccionados.
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {posts.meta.last_page > 1 && (
                    <div className="mt-10 flex justify-center gap-2">
                        {posts.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
