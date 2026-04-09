import { Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Post {
    id: number;
    title: string;
    slug: string;
    content_type: string;
    status: string;
    category: string;
    author: string;
    published_at: string | null;
    created_at: string;
}

// Laravel paginator serializa en estructura plana (sin clave "meta")
interface PaginatedPosts {
    data: Post[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    current_page: number;
    last_page: number;
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    published: 'default',
    draft: 'secondary',
    archived: 'outline',
};

export default function PostsIndex({ posts }: { posts: PaginatedPosts }) {
    const destroy = (id: number) => {
        if (confirm('¿Mover este post a la papelera?')) {
            router.delete(`/admin/posts/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Posts', href: '/admin/posts' }]}>
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Posts{' '}
                        <span className="ml-2 text-base font-normal text-muted-foreground">
                            ({posts.total})
                        </span>
                    </h1>
                    <Button asChild>
                        <Link href="/admin/posts/create">
                            <Plus className="mr-1.5 h-4 w-4" /> Nuevo
                        </Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">Título</th>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">Categoría</th>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">Tipo</th>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">Estado</th>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">Autor</th>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">Publicado</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {posts.data.map((post) => (
                                <tr key={post.id} className="hover:bg-muted/20">
                                    <td className="max-w-xs px-4 py-3">
                                        <p className="truncate font-medium">{post.title}</p>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{post.category}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{post.content_type}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusVariant[post.status] ?? 'outline'}>
                                            {post.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{post.author}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{post.published_at ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/admin/posts/${post.id}/edit`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => destroy(post.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {posts.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        No hay posts aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {posts.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
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
        </AppLayout>
    );
}
