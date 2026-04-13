import { Head, Link } from '@inertiajs/react';
import {
    ArchiveIcon,
    BookOpenIcon,
    FileTextIcon,
    FolderIcon,
    TagIcon,
    UsersIcon,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

interface Stats {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    archivedPosts: number;
    totalCategories: number;
    totalTags: number;
    totalUsers: number;
}

interface PieEntry {
    name: string;
    value: number;
}

interface CategoryEntry {
    name: string;
    total: number;
}

interface MonthEntry {
    month: string;
    label: string;
    total: number;
}

interface RecentPost {
    id: number;
    title: string;
    content_type: string;
    status: string;
    category: string;
    author: string;
    created_at: string;
}

interface Props {
    stats: Stats;
    postsByType: PieEntry[];
    postsByCategory: CategoryEntry[];
    postsByMonth: MonthEntry[];
    recentPosts: RecentPost[];
}

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
    published: 'default',
    draft: 'secondary',
    archived: 'outline',
};

const contentTypeLabel: Record<string, string> = {
    article: 'Artículo',
    video: 'Video',
    infographic: 'Infografía',
    document: 'Documento',
};

function StatCard({
    title,
    value,
    icon: Icon,
    description,
}: {
    title: string;
    value: number;
    icon: React.ElementType;
    description?: string;
}) {
    return (
        <Card className="border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                {description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export default function Dashboard({
    stats,
    postsByType,
    postsByCategory,
    postsByMonth,
    recentPosts,
}: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Panel', href: dashboard() }]}>
            <Head title="Panel" />

            <div className="flex flex-col gap-6 p-6">
                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total publicaciones"
                        value={stats.totalPosts}
                        icon={FileTextIcon}
                        description={`${stats.publishedPosts} publicadas · ${stats.draftPosts} borradores`}
                    />
                    <StatCard
                        title="Categorías"
                        value={stats.totalCategories}
                        icon={FolderIcon}
                    />
                    <StatCard
                        title="Etiquetas"
                        value={stats.totalTags}
                        icon={TagIcon}
                    />
                    <StatCard
                        title="Usuarios"
                        value={stats.totalUsers}
                        icon={UsersIcon}
                    />
                </div>

                {/* Secondary stat cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                        title="Publicadas"
                        value={stats.publishedPosts}
                        icon={BookOpenIcon}
                    />
                    <StatCard
                        title="Borradores"
                        value={stats.draftPosts}
                        icon={FileTextIcon}
                    />
                    <StatCard
                        title="Archivadas"
                        value={stats.archivedPosts}
                        icon={ArchiveIcon}
                    />
                </div>

                {/* Charts row */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Bar chart: posts por mes */}
                    <Card className="border-border/80 shadow-sm lg:col-span-2">
                        <CardHeader className="border-b border-border/60 pb-4">
                            <CardTitle className="text-base">
                                Publicaciones por mes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart
                                    data={postsByMonth}
                                    margin={{
                                        top: 4,
                                        right: 8,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-border/50"
                                    />
                                    <XAxis
                                        dataKey="label"
                                        tick={{
                                            fontSize: 12,
                                            fill: 'hsl(var(--muted-foreground))',
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{
                                            fontSize: 12,
                                            fill: 'hsl(var(--muted-foreground))',
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}
                                        cursor={{
                                            fill: 'hsl(var(--muted))',
                                            opacity: 0.4,
                                        }}
                                        formatter={(value) => [
                                            value,
                                            'Publicaciones',
                                        ]}
                                    />
                                    <Bar
                                        dataKey="total"
                                        fill="#6366f1"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Pie chart: posts por tipo */}
                    <Card className="border-border/80 shadow-sm">
                        <CardHeader className="border-b border-border/60 pb-4">
                            <CardTitle className="text-base">
                                Por tipo de contenido
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-4">
                            {postsByType.length > 0 ? (
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={postsByType}
                                            cx="50%"
                                            cy="45%"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {postsByType.map((_, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={
                                                        PIE_COLORS[
                                                            index %
                                                                PIE_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                            }}
                                        />
                                        <Legend
                                            iconType="circle"
                                            iconSize={8}
                                            formatter={(value) => (
                                                <span
                                                    style={{
                                                        fontSize: '12px',
                                                        color: 'hsl(var(--foreground))',
                                                    }}
                                                >
                                                    {value}
                                                </span>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="py-16 text-sm text-muted-foreground">
                                    Sin datos aún
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Bar chart: posts por categoría */}
                {postsByCategory.length > 0 && (
                    <Card className="border-border/80 shadow-sm">
                        <CardHeader className="border-b border-border/60 pb-4">
                            <CardTitle className="text-base">
                                Publicaciones por categoría
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart
                                    data={postsByCategory}
                                    layout="vertical"
                                    margin={{
                                        top: 0,
                                        right: 16,
                                        left: 8,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        horizontal={false}
                                        className="stroke-border/50"
                                    />
                                    <XAxis
                                        type="number"
                                        allowDecimals={false}
                                        tick={{
                                            fontSize: 12,
                                            fill: 'hsl(var(--muted-foreground))',
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        width={120}
                                        tick={{
                                            fontSize: 12,
                                            fill: 'hsl(var(--muted-foreground))',
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}
                                        cursor={{
                                            fill: 'hsl(var(--muted))',
                                            opacity: 0.4,
                                        }}
                                        formatter={(value) => [
                                            value,
                                            'Publicaciones',
                                        ]}
                                    />
                                    <Bar
                                        dataKey="total"
                                        fill="#8b5cf6"
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Recent posts */}
                <Card className="border-border/80 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
                        <CardTitle className="text-base">
                            Publicaciones recientes
                        </CardTitle>
                        <Link
                            href="/admin/posts"
                            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                        >
                            Ver todas
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                            Título
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                            Tipo
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                            Categoría
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                            Autor
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium tracking-wide text-muted-foreground">
                                            Fecha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recentPosts.map((post) => (
                                        <tr
                                            key={post.id}
                                            className="hover:bg-muted/20"
                                        >
                                            <td className="max-w-xs px-4 py-3">
                                                <Link
                                                    href={`/admin/posts/${post.id}/edit`}
                                                    className="truncate font-medium hover:underline"
                                                >
                                                    {post.title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {contentTypeLabel[
                                                    post.content_type
                                                ] ?? post.content_type}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        statusVariant[
                                                            post.status
                                                        ] ?? 'outline'
                                                    }
                                                >
                                                    {post.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {post.category}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {post.author}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {post.created_at}
                                            </td>
                                        </tr>
                                    ))}
                                    {recentPosts.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-8 text-center text-muted-foreground"
                                            >
                                                No hay publicaciones aún.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
