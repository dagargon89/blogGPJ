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
    tag: {
        id: number;
        name: string;
        slug: string;
    };
};

export default function TagEdit({ tag }: Props) {
    const form = useForm({ name: tag.name, slug: tag.slug });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.put(admin.tags.update(tag.id).url);
    };

    return (
        <>
            <Head title={`Editar: ${tag.name}`} />
            <div className="mx-auto w-full max-w-xl p-4">
                <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
                    <Link href={admin.tags.index().url}>
                        <ArrowLeft className="size-4" />
                        Volver
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Editar etiqueta</CardTitle>
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

                            <div className="flex items-center justify-end gap-2">
                                <Button asChild variant="outline" type="button">
                                    <Link href={admin.tags.index().url}>Cancelar</Link>
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
    { title: 'Etiquetas', href: admin.tags.index() },
    { title: 'Editar', href: '#' },
];

TagEdit.layout = { breadcrumbs };
