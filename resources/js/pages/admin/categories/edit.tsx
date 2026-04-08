import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { type FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import admin from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';

type Props = {
    category: {
        id: number;
        name: string;
        slug: string;
        description: string | null;
        icon: string | null;
    };
};

export default function CategoryEdit({ category }: Props) {
    const form = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        icon: category.icon ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.put(admin.categories.update(category.id).url);
    };

    return (
        <>
            <Head title={`Editar: ${category.name}`} />
            <div className="mx-auto w-full max-w-2xl p-4">
                <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
                    <Link href={admin.categories.index().url}>
                        <ArrowLeft className="size-4" />
                        Volver
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Editar categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={form.data.slug}
                                    onChange={(e) => form.setData('slug', e.target.value)}
                                />
                                <InputError message={form.errors.slug} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción</Label>
                                <textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                <InputError message={form.errors.description} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="icon">Icono</Label>
                                <Input
                                    id="icon"
                                    value={form.data.icon}
                                    onChange={(e) => form.setData('icon', e.target.value)}
                                />
                                <InputError message={form.errors.icon} />
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <Button asChild variant="outline" type="button">
                                    <Link href={admin.categories.index().url}>Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={form.processing}>
                                    Actualizar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel admin', href: admin.dashboard() },
    { title: 'Categorías', href: admin.categories.index() },
    { title: 'Editar', href: '#' },
];

CategoryEdit.layout = { breadcrumbs };
