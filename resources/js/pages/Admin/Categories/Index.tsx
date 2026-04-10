import { Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { AdminListCard } from '@/components/admin/AdminListCard';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    posts_count: number;
}

interface Props {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: Props) {
    const destroy = (id: number) => {
        if (confirm('¿Eliminar esta categoría?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Categorías', href: '/admin/categories' }]}
        >
            <AdminListCard
                title="Categorías"
                actions={
                    <Button asChild>
                        <Link href="/admin/categories/create">
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
                            {categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="hover:bg-muted/20"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {category.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {category.slug}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {category.posts_count}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <Link
                                                    href={`/admin/categories/${category.id}/edit`}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() =>
                                                    destroy(category.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No hay categorías aún.
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
