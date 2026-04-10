import { useForm, Link } from '@inertiajs/react';
import { AdminFormCard } from '@/components/admin/AdminFormCard';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

export default function TagsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
    });

    const slugify = (v: string) =>
        v
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

    const handleName = (value: string) => {
        setData('name', value);

        if (!data.slug || data.slug === slugify(data.name)) {
setData('slug', slugify(value));
}
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/tags');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Etiquetas', href: '/admin/tags' },
                { title: 'Nueva', href: '#' },
            ]}
        >
            <AdminFormCard title="Nueva etiqueta">
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => handleName(e.target.value)}
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
                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Guardar
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/tags">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </AdminFormCard>
        </AppLayout>
    );
}
