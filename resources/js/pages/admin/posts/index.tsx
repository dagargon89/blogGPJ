import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useFlashToast } from '@/hooks/use-flash-toast';
import admin from '@/routes/admin';
import type { BreadcrumbItem, ContentType, Paginated, PostStatus } from '@/types';

type AdminPostRow = {
    id: number;
    title: string;
    slug: string;
    status: PostStatus;
    content_type: ContentType;
    category: string | null;
    author: string | null;
    published_at: string | null;
    updated_at: string | null;
};

type Props = {
    posts: Paginated<AdminPostRow>;
    filters: { search: string; status: string };
};

const statusMeta: Record<PostStatus, { label: string; className: string }> = {
    published: {
        label: 'Publicado',
        className:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
    },
    draft: {
        label: 'Borrador',
        className:
            'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
    },
    archived: {
        label: 'Archivado',
        className: 'bg-muted text-muted-foreground',
    },
};

const allValue = '__all__';

function formatDate(iso: string | null): string {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return '';
    }
}

export default function PostsIndex({ posts, filters }: Props) {
    useFlashToast();
    const [search, setSearch] = useState(filters.search);

    const apply = (overrides: Partial<{ search: string; status: string }>): void => {
        const payload: Record<string, string> = {};
        const merged = { ...filters, search, ...overrides };
        if (merged.search) payload.search = merged.search;
        if (merged.status) payload.status = merged.status;

        router.get(admin.posts.index().url, payload, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        apply({ search });
    };

    const handleDelete = (post: AdminPostRow): void => {
        if (!confirm(`¿Eliminar "${post.title}"?`)) return;
        router.delete(admin.posts.destroy(post.id).url, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Publicaciones" />
            <div className="flex flex-col gap-6 p-4">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Publicaciones</h1>
                        <p className="text-sm text-muted-foreground">
                            Gestión del contenido del Hub.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={admin.posts.create().url}>
                            <Plus className="size-4" />
                            Nueva publicación
                        </Link>
                    </Button>
                </header>

                <Card>
                    <CardHeader className="gap-3">
                        <CardTitle>Listado</CardTitle>
                        <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por título..."
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={filters.status || allValue}
                                onValueChange={(value) =>
                                    apply({ status: value === allValue ? '' : value })
                                }
                            >
                                <SelectTrigger className="sm:w-48">
                                    <SelectValue placeholder="Todos los estados" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={allValue}>Todos los estados</SelectItem>
                                    <SelectItem value="published">Publicado</SelectItem>
                                    <SelectItem value="draft">Borrador</SelectItem>
                                    <SelectItem value="archived">Archivado</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" variant="secondary">
                                Filtrar
                            </Button>
                        </form>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Título</th>
                                        <th className="px-4 py-3 font-medium">Tipo</th>
                                        <th className="px-4 py-3 font-medium">Categoría</th>
                                        <th className="px-4 py-3 font-medium">Estado</th>
                                        <th className="px-4 py-3 font-medium">Publicado</th>
                                        <th className="px-4 py-3 font-medium text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                                                No hay publicaciones con estos filtros.
                                            </td>
                                        </tr>
                                    ) : (
                                        posts.data.map((post) => (
                                            <tr
                                                key={post.id}
                                                className="border-b border-border/60 last:border-b-0"
                                            >
                                                <td className="px-4 py-3 font-medium">{post.title}</td>
                                                <td className="px-4 py-3 text-muted-foreground capitalize">{post.content_type}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{post.category ?? '—'}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={`border-0 ${statusMeta[post.status].className}`}>
                                                        {statusMeta[post.status].label}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {formatDate(post.published_at)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button asChild variant="ghost" size="icon" aria-label="Editar">
                                                            <Link href={admin.posts.edit(post.id).url}>
                                                                <Pencil className="size-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label="Eliminar"
                                                            onClick={() => handleDelete(post)}
                                                        >
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {posts.last_page > 1 && (
                    <nav className="flex flex-wrap items-center justify-center gap-2">
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
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel admin', href: admin.dashboard() },
    { title: 'Publicaciones', href: admin.posts.index() },
];

PostsIndex.layout = { breadcrumbs };
