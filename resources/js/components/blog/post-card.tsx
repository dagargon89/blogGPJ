import { Link } from '@inertiajs/react';
import { FileText, Image as ImageIcon, Newspaper, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import * as blogRoutes from '@/routes/blog';
import type { ContentType, PostCard as PostCardType } from '@/types';

const typeMeta: Record<ContentType, { label: string; icon: typeof Newspaper }> = {
    article: { label: 'Artículo', icon: Newspaper },
    video: { label: 'Video', icon: Video },
    infographic: { label: 'Infografía', icon: ImageIcon },
    document: { label: 'Documento', icon: FileText },
};

function formatDate(iso: string | null): string {
    if (!iso) {
        return '';
    }
    try {
        return new Date(iso).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return '';
    }
}

export function PostCard({ post }: { post: PostCardType }) {
    const meta = typeMeta[post.content_type];
    const Icon = meta.icon;

    return (
        <Link
            href={blogRoutes.show(post.slug).url}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-accent/40 to-accent">
                {post.cover ? (
                    <img
                        src={post.cover}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary-from)] to-[var(--primary-to)] text-primary-foreground shadow-sm">
                            <Icon className="size-6" />
                        </div>
                    </div>
                )}
                <div className="absolute left-3 top-3 flex items-center gap-2">
                    <Badge className="border-0 bg-background/80 text-foreground backdrop-blur">
                        <Icon className="size-3" /> {meta.label}
                    </Badge>
                    {post.category && (
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                            {post.category.name}
                        </Badge>
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                </h3>
                <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author ?? 'Equipo'}</span>
                    <span>{formatDate(post.published_at)}</span>
                </div>
            </div>
        </Link>
    );
}
