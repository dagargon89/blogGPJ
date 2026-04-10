import { router } from '@inertiajs/react';
import {
    BookOpen,
    FileText,
    Film,
    FolderOpen,
    GalleryHorizontal,
    LayoutGrid,
    Search,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PostCard } from '@/components/cards/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';

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
    filters: {
        category?: string;
        type?: string;
        tag?: string;
        search?: string;
    };
}

const CONTENT_TYPES = [
    { value: '', label: 'Todos' },
    { value: 'article', label: 'Artículos', icon: BookOpen },
    { value: 'video', label: 'Videos', icon: Film },
    { value: 'infographic', label: 'Infografías', icon: GalleryHorizontal },
    { value: 'document', label: 'Documentos', icon: FileText },
] as const;

function categoryChipClasses(active: boolean) {
    return cn(
        'shrink-0 snap-start rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200 outline-none',
        'hover:border-primary/40 hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'active:scale-[0.97]',
        active
            ? 'border-primary/30 bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary hover:text-primary-foreground'
            : 'border-border/80 bg-background text-foreground/80 hover:text-foreground',
    );
}

function formatSegmentClasses(active: boolean) {
    return cn(
        'inline-flex shrink-0 snap-start items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        'active:scale-[0.98]',
        active
            ? 'bg-background text-foreground shadow-sm ring-1 ring-border/60'
            : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
    );
}

export default function BlogIndex({
    posts,
    categories,
    filters,
}: BlogIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilter = useCallback(
        (params: Record<string, string>) => {
            const next = { ...filters, ...params };
            // remove empty values so URL stays clean
            Object.keys(next).forEach((k) => {
                if (!next[k as keyof typeof next]) {
                    delete next[k as keyof typeof next];
                }
            });
            router.get('/blog', next, { preserveState: true, replace: true });
        },
        [filters],
    );

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (search !== (filters.search ?? '')) {
                applyFilter({ search });
            }
        }, 450);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
        // Solo `search`: incluir `applyFilter`/`filters` provocaría peticiones en bucle al sincronizar la URL.
    }, [search]); // eslint-disable-line react-hooks/exhaustive-deps -- debounce de búsqueda

    const clearFilters = () => {
        setSearch('');
        router.get('/blog', {}, { preserveState: false });
    };

    const hasFilters = Boolean(
        filters.category || filters.type || filters.tag || filters.search,
    );

    const activeCategoryLabel = useMemo(() => {
        if (!filters.category) {
            return null;
        }

        return (
            categories.find((c) => c.slug === filters.category)?.name ??
            filters.category
        );
    }, [categories, filters.category]);

    const activeTypeLabel = useMemo(() => {
        if (!filters.type) {
            return null;
        }

        return (
            CONTENT_TYPES.find((t) => t.value === filters.type)?.label ??
            filters.type
        );
    }, [filters.type]);

    return (
        <PublicLayout>
            <div className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/10">
                <div className="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6 sm:pt-8">
                    {/* Panel de filtros */}
                    <section
                        className="mb-10 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-card/90 to-card/40 shadow-sm backdrop-blur-sm dark:from-card/80 dark:to-card/30"
                        aria-label="Filtros de publicaciones"
                    >
                        <div className="border-b border-border/50 bg-muted/30 px-4 py-3 sm:px-5">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-sm font-semibold tracking-tight text-foreground">
                                        Refinar resultados
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Combina categoría y formato; los cambios
                                        se aplican al instante.
                                    </p>
                                </div>
                                <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:max-w-md">
                                    <div className="relative w-full sm:max-w-xs lg:max-w-sm">
                                        <label
                                            htmlFor="blog-search"
                                            className="sr-only"
                                        >
                                            Buscar publicaciones
                                        </label>
                                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="blog-search"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="Buscar publicaciones..."
                                            className="pr-9 pl-9"
                                            aria-label="Buscar publicaciones"
                                        />
                                        {search && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearch('');
                                                    applyFilter({ search: '' });
                                                }}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                                <span className="sr-only">
                                                    Limpiar búsqueda
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                    {hasFilters && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 shrink-0 self-start text-xs text-muted-foreground hover:text-foreground sm:self-center"
                                            onClick={clearFilters}
                                        >
                                            Limpiar todo
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {hasFilters && (
                                <div
                                    className="mt-3 flex flex-wrap items-center gap-2"
                                    aria-live="polite"
                                >
                                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        Activos
                                    </span>
                                    {filters.search && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch('');
                                                applyFilter({ search: '' });
                                            }}
                                            className="group inline-flex max-w-[220px] items-center gap-1 rounded-full border border-border bg-background py-0.5 pr-1 pl-2.5 text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-accent/40"
                                        >
                                            <Search className="h-3 w-3 shrink-0 text-muted-foreground" />
                                            <span className="truncate">
                                                &ldquo;{filters.search}&rdquo;
                                            </span>
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground group-hover:bg-muted group-hover:text-foreground">
                                                <X
                                                    className="h-3 w-3"
                                                    aria-hidden
                                                />
                                            </span>
                                            <span className="sr-only">
                                                Quitar búsqueda
                                            </span>
                                        </button>
                                    )}
                                    {activeCategoryLabel && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                applyFilter({ category: '' })
                                            }
                                            className="group inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 py-0.5 pr-1 pl-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
                                        >
                                            <FolderOpen
                                                className="h-3 w-3 shrink-0 opacity-80"
                                                aria-hidden
                                            />
                                            {activeCategoryLabel}
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full text-primary/70 group-hover:bg-primary/20">
                                                <X
                                                    className="h-3 w-3"
                                                    aria-hidden
                                                />
                                            </span>
                                            <span className="sr-only">
                                                Quitar filtro de categoría
                                            </span>
                                        </button>
                                    )}
                                    {activeTypeLabel && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                applyFilter({ type: '' })
                                            }
                                            className="group inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 py-0.5 pr-1 pl-2.5 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-500/15 dark:text-amber-200/90"
                                        >
                                            <LayoutGrid
                                                className="h-3 w-3 shrink-0 opacity-80"
                                                aria-hidden
                                            />
                                            {activeTypeLabel}
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full opacity-70 group-hover:bg-amber-500/20">
                                                <X
                                                    className="h-3 w-3"
                                                    aria-hidden
                                                />
                                            </span>
                                            <span className="sr-only">
                                                Quitar filtro de formato
                                            </span>
                                        </button>
                                    )}
                                    {filters.tag && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                applyFilter({ tag: '' })
                                            }
                                            className="group inline-flex items-center gap-1 rounded-full border border-violet-500/25 bg-violet-500/10 py-0.5 pr-1 pl-2.5 text-xs font-medium text-violet-900 transition-colors hover:bg-violet-500/15 dark:text-violet-200/90"
                                        >
                                            <span
                                                className="opacity-80"
                                                aria-hidden
                                            >
                                                #
                                            </span>
                                            {filters.tag}
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full opacity-70 group-hover:bg-violet-500/20">
                                                <X
                                                    className="h-3 w-3"
                                                    aria-hidden
                                                />
                                            </span>
                                            <span className="sr-only">
                                                Quitar filtro de etiqueta
                                            </span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6 px-4 py-5 sm:px-5">
                            {/* Categorías */}
                            {categories.length > 0 && (
                                <div>
                                    <div className="mb-2 flex items-start gap-2">
                                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <FolderOpen
                                                className="h-3.5 w-3.5"
                                                aria-hidden
                                            />
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                Área temática
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Elige un tema;
                                                &ldquo;Todas&rdquo; muestra
                                                todas las categorías.
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pt-0.5 pb-1 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
                                        role="toolbar"
                                        aria-label="Filtro por categoría"
                                    >
                                        <button
                                            type="button"
                                            aria-pressed={!filters.category}
                                            onClick={() =>
                                                applyFilter({ category: '' })
                                            }
                                            className={categoryChipClasses(
                                                !filters.category,
                                            )}
                                        >
                                            Todas
                                        </button>
                                        {categories.map((cat) => {
                                            const active =
                                                filters.category === cat.slug;

                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    aria-pressed={active}
                                                    onClick={() =>
                                                        applyFilter({
                                                            category: cat.slug,
                                                        })
                                                    }
                                                    className={categoryChipClasses(
                                                        active,
                                                    )}
                                                >
                                                    {cat.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Formato — control segmentado */}
                            <div>
                                <div className="mb-2 flex items-start gap-2">
                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                        <LayoutGrid
                                            className="h-3.5 w-3.5"
                                            aria-hidden
                                        />
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            Formato del contenido
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Artículos, videos, infografías o
                                            documentos.
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="rounded-xl border border-border/60 bg-muted/50 p-1 dark:bg-muted/30"
                                    role="toolbar"
                                    aria-label="Filtro por tipo de contenido"
                                >
                                    <div className="flex flex-wrap gap-0.5 sm:inline-flex sm:snap-x sm:snap-mandatory sm:flex-nowrap sm:overflow-x-auto sm:scroll-smooth sm:pb-0.5 sm:[scrollbar-width:thin] sm:[&::-webkit-scrollbar]:h-1.5 sm:[&::-webkit-scrollbar-thumb]:rounded-full sm:[&::-webkit-scrollbar-thumb]:bg-border">
                                        {CONTENT_TYPES.map((t) => {
                                            const Icon =
                                                'icon' in t
                                                    ? t.icon
                                                    : undefined;
                                            const active =
                                                filters.type === t.value ||
                                                (!filters.type &&
                                                    t.value === '');

                                            return (
                                                <button
                                                    key={t.value || 'all'}
                                                    type="button"
                                                    aria-pressed={active}
                                                    onClick={() =>
                                                        applyFilter({
                                                            type: t.value,
                                                        })
                                                    }
                                                    className={formatSegmentClasses(
                                                        active,
                                                    )}
                                                >
                                                    {Icon && (
                                                        <Icon
                                                            className="h-3.5 w-3.5 shrink-0 opacity-80"
                                                            aria-hidden
                                                        />
                                                    )}
                                                    {t.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                {/* Results */}
                {posts.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20 text-center">
                        <Search className="h-12 w-12 text-muted-foreground/30" />
                        <div>
                            <p className="font-medium text-foreground">
                                Sin resultados
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Prueba con otros filtros o términos de búsqueda.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                        >
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
                            onClick={() =>
                                posts.prev_page_url &&
                                router.get(posts.prev_page_url)
                            }
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
                            onClick={() =>
                                posts.next_page_url &&
                                router.get(posts.next_page_url)
                            }
                        >
                            Siguiente →
                        </Button>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
