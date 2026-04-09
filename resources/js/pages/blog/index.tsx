import { Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { PostCard } from '@/components/blog/post-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import * as blogRoutes from '@/routes/blog';
import type { Category, Paginated, PostCard as PostCardType } from '@/types';

type Filters = {
    search: string;
    category: string;
    type: string;
};

type Props = {
    posts: Paginated<PostCardType>;
    categories: Category[];
    filters: Filters;
};

const allValue = '__all__';

export default function BlogIndex({ posts, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search);

    const applyFilter = (next: Partial<Filters>): void => {
        const payload: Record<string, string> = {};
        const merged: Filters = { ...filters, ...next, search };
        if (merged.search) {
            payload.search = merged.search;
        }
        if (merged.category) {
            payload.category = merged.category;
        }
        if (merged.type) {
            payload.type = merged.type;
        }

        router.get(blogRoutes.index().url, payload, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        applyFilter({ search });
    };

    return (
        <PublicLayout title="Blog">
            <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
                <header className="mb-8 flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Blog interno</h1>
                    <p className="text-muted-foreground">
                        Busca por título, filtra por categoría o por tipo de contenido.
                    </p>
                </header>

                <form
                    onSubmit={onSubmit}
                    className="mb-8 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row"
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar publicaciones..."
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={filters.category || allValue}
                        onValueChange={(value) =>
                            applyFilter({ category: value === allValue ? '' : value })
                        }
                    >
                        <SelectTrigger className="sm:w-52">
                            <SelectValue placeholder="Todas las categorías" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={allValue}>Todas las categorías</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.slug}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.type || allValue}
                        onValueChange={(value) =>
                            applyFilter({ type: value === allValue ? '' : value })
                        }
                    >
                        <SelectTrigger className="sm:w-44">
                            <SelectValue placeholder="Todos los tipos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={allValue}>Todos los tipos</SelectItem>
                            <SelectItem value="article">Artículo</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="infographic">Infografía</SelectItem>
                            <SelectItem value="document">Documento</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="submit">Buscar</Button>
                </form>

                {posts.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
                        No encontramos publicaciones con estos filtros.
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {posts.last_page > 1 && (
                    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
                        {posts.links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url ?? '#'}
                                preserveScroll
                                preserveState
                                className={
                                    link.active
                                        ? 'rounded-md border border-primary bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground'
                                        : link.url
                                          ? 'rounded-md border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                          : 'rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground/50'
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                )}
            </div>
        </PublicLayout>
    );
}
