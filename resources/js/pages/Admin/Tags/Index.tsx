import { Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { AdminListCard } from '@/components/admin/AdminListCard';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface Tag {
    id: number;
    name: string;
    slug: string;
    posts_count: number;
}

export default function TagsIndex({ tags }: { tags: Tag[] }) {
    const destroy = (id: number) => {
        if (confirm('¿Eliminar esta etiqueta?')) {
            router.delete(`/admin/tags/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Etiquetas', href: '/admin/tags' }]}>
            <AdminListCard
                title="Etiquetas"
                actions={
                    <Button asChild>
                        <Link href="/admin/tags/create">
                            <Plus className="mr-1.5 h-4 w-4" /> Nueva
                        </Link>
                    </Button>
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                    Slug
                                </th>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                    Publicaciones
                                </th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {tags.map((tag) => (
                                <tr key={tag.id} className="hover:bg-muted/20">
                                    <td className="px-4 py-3 font-medium">
                                        {tag.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {tag.slug}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {tag.posts_count}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <Link
                                                    href={`/admin/tags/${tag.id}/edit`}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => destroy(tag.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tags.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No hay etiquetas aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </AdminListCard>
        </AppLayout>
    );
}
