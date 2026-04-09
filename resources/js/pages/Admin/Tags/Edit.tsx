import { useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Tag { id: number; name: string; slug: string }

export default function TagsEdit({ tag }: { tag: Tag }) {
    const { data, setData, put, processing, errors } = useForm({ name: tag.name, slug: tag.slug });

    const submit = (e: React.FormEvent) => { e.preventDefault(); put(`/admin/tags/${tag.id}`); };

    return (
        <AppLayout breadcrumbs={[{ title: 'Etiquetas', href: '/admin/tags' }, { title: 'Editar', href: '#' }]}>
            <div className="mx-auto max-w-xl p-6">
                <h1 className="mb-6 text-2xl font-semibold">Editar etiqueta</h1>
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} autoFocus />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                        <InputError message={errors.slug} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Guardar cambios</Button>
                        <Button asChild variant="outline"><Link href="/admin/tags">Cancelar</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
