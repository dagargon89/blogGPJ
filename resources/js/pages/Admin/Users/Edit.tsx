import { useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

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
    const { data, setData, put, processing, errors } = useForm({ role: user.role });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Usuarios', href: '/admin/users' }, { title: 'Editar rol', href: '#' }]}>
            <div className="mx-auto max-w-sm p-6">
                <h1 className="mb-1 text-2xl font-semibold">Editar rol</h1>
                <p className="mb-6 text-muted-foreground">{user.name} — {user.email}</p>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <Label htmlFor="role">Rol</Label>
                        <select
                            id="role"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing}>Guardar</Button>
                        <Button asChild variant="outline"><Link href="/admin/users">Cancelar</Link></Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
