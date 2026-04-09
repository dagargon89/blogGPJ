import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

export default function CategoriesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        icon: '',
    });

    const slugify = (value: string) =>
        value
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

    const handleNameChange = (value: string) => {
        setData('name', value);
        if (!data.slug || data.slug === slugify(data.name)) {
            setData('slug', slugify(value));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Categorías', href: '/admin/categories' }, { title: 'Nueva', href: '/admin/categories/create' }]}>
            <div className="mx-auto max-w-xl p-6">
                <h1 className="mb-6 text-2xl font-semibold">Nueva categoría</h1>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" value={data.name} onChange={(e) => handleNameChange(e.target.value)} autoFocus />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                        <InputError message={errors.slug} />
                    </div>

                    <div>
                        <Label htmlFor="description">Descripción</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div>
                        <Label htmlFor="icon">Icono (opcional)</Label>
                        <Input id="icon" value={data.icon} onChange={(e) => setData('icon', e.target.value)} placeholder="cpu, users, code..." />
                        <InputError message={errors.icon} />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Guardar</Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/categories">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
