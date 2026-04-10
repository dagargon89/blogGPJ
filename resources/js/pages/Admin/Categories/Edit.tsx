import { useForm, Link } from '@inertiajs/react';
import { AdminFormCard } from '@/components/admin/AdminFormCard';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
}

export default function CategoriesEdit({ category }: { category: Category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        icon: category.icon ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/categories/${category.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Categorías', href: '/admin/categories' },
                { title: 'Editar', href: '#' },
            ]}
        >
            <AdminFormCard title="Editar categoría">
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoFocus
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                        />
                        <InputError message={errors.slug} />
                    </div>

                    <div>
                        <Label htmlFor="description">Descripción</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div>
                        <Label htmlFor="icon">Icono</Label>
                        <Input
                            id="icon"
                            value={data.icon}
                            onChange={(e) => setData('icon', e.target.value)}
                        />
                        <InputError message={errors.icon} />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Guardar cambios
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/categories">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </AdminFormCard>
        </AppLayout>
    );
}
