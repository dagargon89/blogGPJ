import { useForm, Link } from '@inertiajs/react';
import { AdminFormCard } from '@/components/admin/AdminFormCard';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    user: User;
    roles: string[];
}

export default function UsersEdit({ user, roles }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        role: user.role,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Usuarios', href: '/admin/users' },
                { title: 'Editar rol', href: '#' },
            ]}
        >
            <AdminFormCard
                title="Editar rol"
                description={`${user.name} — ${user.email}`}
                className="max-w-sm"
            >
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <Label htmlFor="role">Rol</Label>
                        <select
                            id="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            {roles.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Guardar
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/users">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </AdminFormCard>
        </AppLayout>
    );
}
