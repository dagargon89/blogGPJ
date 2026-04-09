import { Link } from '@inertiajs/react';
import { FileText, Film, GalleryHorizontal, BookOpen, User, Calendar } from 'lucide-react';
import { CategoryBadge } from '@/components/blog/CategoryBadge';

const contentTypeMeta: Record<string, { icon: React.ElementType; label: string; color: string }> = {
    video: { icon: Film, label: 'Video', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
    infographic: { icon: GalleryHorizontal, label: 'Infografía', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
    document: { icon: FileText, label: 'Documento', color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40' },
    article: { icon: BookOpen, label: 'Artículo', color: 'text-primary bg-primary/10' },
};

interface PostCardProps {
    post: {
        id: number;
        title: string;
        slug: string;
        excerpt: string;
        content_type: string;
        featured_image_path: string | null;
        category: { name: string; slug: string };
        author: string;
        published_at: string | null;
    };
}

export function PostCard({ post }: PostCardProps) {
    const meta = contentTypeMeta[post.content_type] ?? contentTypeMeta.article;
    const Icon = meta.icon;

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {/* Cover image */}
            <div className="relative aspect-video overflow-hidden bg-muted">
                {post.featured_image_path ? (
                    <img
                        src={post.featured_image_path}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5">
                        <Icon className="h-12 w-12 text-primary/25" />
                    </div>
                )}

                {/* Content-type pill overlaid on image */}
                <div className="absolute left-3 top-3">
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm backdrop-blur-sm ${meta.color}`}>
                        <Icon className="h-3 w-3" />
                        {meta.label}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-3 p-5">
                <CategoryBadge name={post.category.name} slug={post.category.slug} />

                <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                </h3>

                <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                </p>

                {/* Footer meta */}
                <div className="flex items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                    </span>
                    {post.published_at && (
                        <span className="flex items-center gap-1 ml-auto">
                            <Calendar className="h-3 w-3" />
                            {post.published_at}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
