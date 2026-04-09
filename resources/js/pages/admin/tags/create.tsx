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

export default function TagCreate() {
    const form = useForm({ name: '', slug: '' });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.post(admin.tags.store().url);
    };

    return (
        <>
            <Head title="Nueva etiqueta" />
            <div className="mx-auto w-full max-w-xl p-4">
                <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
                    <Link href={admin.tags.index().url}>
                        <ArrowLeft className="size-4" />
                        Volver
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Nueva etiqueta</CardTitle>
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
                                <Label htmlFor="slug">Slug (opcional)</Label>
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
                                    Guardar
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
    { title: 'Nueva', href: admin.tags.create() },
];

TagCreate.layout = { breadcrumbs };
