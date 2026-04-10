import { Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { AdminListCard } from '@/components/admin/AdminListCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

const roleVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    admin: 'default',
    editor: 'secondary',
    viewer: 'outline',
};

export default function UsersIndex({ users }: { users: User[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Usuarios', href: '/admin/users' }]}>
            <AdminListCard title="Usuarios">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                    Rol
                                </th>
                                <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                    Desde
                                </th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/20">
                                    <td className="px-4 py-3 font-medium">
                                        {user.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                roleVariant[user.role] ??
                                                'outline'
                                            }
                                        >
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {user.created_at}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <Link
                                                href={`/admin/users/${user.id}/edit`}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminListCard>
        </AppLayout>
    );
}
