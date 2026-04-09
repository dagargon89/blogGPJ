import { router } from '@inertiajs/react';
import { BookOpen, FileText, Film, GalleryHorizontal, Search, SlidersHorizontal, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PostCard } from '@/components/cards/PostCard';
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
    total: number;
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface BlogIndexProps {
    posts: PaginatedPosts;
    categories: { id: number; name: string; slug: string }[];
    filters: { category?: string; type?: string; tag?: string; search?: string };
}

const CONTENT_TYPES = [
    { value: '', label: 'Todos' },
    { value: 'article', label: 'Artículos', icon: BookOpen },
    { value: 'video', label: 'Videos', icon: Film },
    { value: 'infographic', label: 'Infografías', icon: GalleryHorizontal },
    { value: 'document', label: 'Documentos', icon: FileText },
];

function pill(active: boolean) {
    return active
        ? 'flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors'
        : 'flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:border-primary/50 hover:text-foreground';
}

export default function BlogIndex({ posts, categories, filters }: BlogIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilter = useCallback(
        (params: Record<string, string>) => {
            const next = { ...filters, ...params };
            // remove empty values so URL stays clean
            Object.keys(next).forEach((k) => {
                if (!next[k as keyof typeof next]) delete next[k as keyof typeof next];
            });
            router.get('/blog', next, { preserveState: true, replace: true });
        },
        [filters],
    );

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (search !== (filters.search ?? '')) {
                applyFilter({ search });
            }
        }, 450);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [search]);

    const clearFilters = () => {
        setSearch('');
        router.get('/blog', {}, { preserveState: false });
    };

    const hasFilters = filters.category || filters.type || filters.tag || filters.search;

    return (
        <PublicLayout>
            {/* Page header */}
            <div className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/10">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Publicaciones</h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {posts.total} {posts.total === 1 ? 'resultado' : 'resultados'}
                                {hasFilters && ' con los filtros aplicados'}
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar publicaciones..."
                                className="pl-9 pr-9"
                            />
                            {search && (
                                <button
                                    onClick={() => { setSearch(''); applyFilter({ search: '' }); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                {/* Filters row */}
                <div className="mb-8 space-y-4">
                    {/* Categories */}
                    {categories.length > 0 && (
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                <button onClick={() => applyFilter({ category: '' })} className={pill(!filters.category)}>
                                    Todas
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => applyFilter({ category: cat.slug })}
                                        className={pill(filters.category === cat.slug)}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Content type */}
                    <div className="flex gap-2 overflow-x-auto pb-1 pl-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {CONTENT_TYPES.map((t) => {
                            const Icon = t.icon;
                            return (
                                <button
                                    key={t.value}
                                    onClick={() => applyFilter({ type: t.value })}
                                    className={pill(filters.type === t.value || (!filters.type && t.value === ''))}
                                >
                                    {Icon && <Icon className="h-3.5 w-3.5" />}
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active tag filter indicator */}
                    {filters.tag && (
                        <div className="flex items-center gap-2 pl-6 text-sm text-muted-foreground">
                            <span>Etiqueta:</span>
                            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                                {filters.tag}
                            </span>
                            <button
                                onClick={() => applyFilter({ tag: '' })}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Results */}
                {posts.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20 text-center">
                        <Search className="h-12 w-12 text-muted-foreground/30" />
                        <div>
                            <p className="font-medium text-foreground">Sin resultados</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Prueba con otros filtros o términos de búsqueda.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                            Limpiar filtros
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!posts.prev_page_url}
                            onClick={() => posts.prev_page_url && router.get(posts.prev_page_url)}
                        >
                            ← Anterior
                        </Button>

                        <span className="px-4 text-sm text-muted-foreground">
                            Página {posts.current_page} de {posts.last_page}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!posts.next_page_url}
                            onClick={() => posts.next_page_url && router.get(posts.next_page_url)}
                        >
                            Siguiente →
                        </Button>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
