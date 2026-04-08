import { Head, Link } from '@inertiajs/react';
import {
    FileText,
    FolderKanban,
    Newspaper,
    PenLine,
    Tags,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import admin from '@/routes/admin';
import type { ContentType, PostStatus } from '@/types';

type LatestPost = {
    id: number;
    title: string;
    slug: string;
    status: PostStatus;
    content_type: ContentType;
    category: string | null;
    author: string | null;
    updated_at: string | null;
};

type Props = {
    stats: {
        posts_total: number;
        posts_published: number;
        posts_drafts: number;
        categories: number;
        tags: number;
    };
    latest_posts: LatestPost[];
};

const statusMeta: Record<PostStatus, { label: string; className: string }> = {
    published: { label: 'Publicado', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200' },
    draft: { label: 'Borrador', className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200' },
    archived: { label: 'Archivado', className: 'bg-muted text-muted-foreground' },
};

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

export default function AdminDashboard({ stats, latest_posts }: Props) {
    const cards = [
        { label: 'Publicaciones', value: stats.posts_total, icon: Newspaper },
        { label: 'Publicadas', value: stats.posts_published, icon: FileText },
        { label: 'Borradores', value: stats.posts_drafts, icon: PenLine },
        { label: 'Categorías', value: stats.categories, icon: FolderKanban },
        { label: 'Etiquetas', value: stats.tags, icon: Tags },
    ];

    return (
        <>
            <Head title="Panel admin" />
            <div className="flex flex-col gap-6 p-4">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight">Panel admin</h1>
                    <p className="text-sm text-muted-foreground">
                        Resumen del Hub de Conocimiento.
                    </p>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {cards.map((card) => (
                        <Card key={card.label}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {card.label}
                                </CardTitle>
                                <card.icon className="size-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Últimas publicaciones</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Título</th>
                                        <th className="px-4 py-3 font-medium">Estado</th>
                                        <th className="px-4 py-3 font-medium">Categoría</th>
                                        <th className="px-4 py-3 font-medium">Autor</th>
                                        <th className="px-4 py-3 font-medium">Actualizado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latest_posts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                                                Aún no hay publicaciones.
                                            </td>
                                        </tr>
                                    ) : (
                                        latest_posts.map((post) => (
                                            <tr
                                                key={post.id}
                                                className="border-b border-border/60 last:border-b-0"
                                            >
                                                <td className="px-4 py-3">
                                                    <Link
                                                        href={admin.posts.edit(post.id).url}
                                                        className="font-medium text-foreground hover:text-primary"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge className={`border-0 ${statusMeta[post.status].className}`}>
                                                        {statusMeta[post.status].label}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {post.category ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {post.author ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {formatDate(post.updated_at)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
