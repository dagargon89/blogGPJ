import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlashToast } from '@/hooks/use-flash-toast';
import admin from '@/routes/admin';
import type { BreadcrumbItem, Category } from '@/types';

type Props = {
    categories: Array<Category & { posts_count: number }>;
};

export default function CategoriesIndex({ categories }: Props) {
    useFlashToast();

    const handleDelete = (category: Category): void => {
        if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) {
            return;
        }
        router.delete(admin.categories.destroy(category.id).url, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Categorías" />
            <div className="flex flex-col gap-6 p-4">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Categorías</h1>
                        <p className="text-sm text-muted-foreground">
                            Organización principal del contenido del blog.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={admin.categories.create().url}>
                            <Plus className="size-4" />
                            Nueva categoría
                        </Link>
                    </Button>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Nombre</th>
                                        <th className="px-4 py-3 font-medium">Slug</th>
                                        <th className="px-4 py-3 font-medium">Publicaciones</th>
                                        <th className="px-4 py-3 font-medium text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                                                No hay categorías aún.
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="border-b border-border/60 last:border-b-0"
                                            >
                                                <td className="px-4 py-3 font-medium">{category.name}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{category.slug}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{category.posts_count}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button asChild variant="ghost" size="icon" aria-label="Editar">
                                                            <Link href={admin.categories.edit(category.id).url}>
                                                                <Pencil className="size-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label="Eliminar"
                                                            onClick={() => handleDelete(category)}
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
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel admin', href: admin.dashboard() },
    { title: 'Categorías', href: admin.categories.index() },
];

CategoriesIndex.layout = { breadcrumbs };
