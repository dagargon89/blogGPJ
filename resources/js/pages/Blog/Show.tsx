import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Clock,
    FileText,
    Film,
    GalleryHorizontal,
    Tag,
} from 'lucide-react';
import { useEffect } from 'react';
import { ArticleReaderActions } from '@/components/blog/ArticleReaderActions';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { PostCard } from '@/components/cards/PostCard';
import { ArticleRenderer } from '@/components/renderers/ArticleRenderer';
import { DocumentRenderer } from '@/components/renderers/DocumentRenderer';
import { VideoRenderer } from '@/components/renderers/VideoRenderer';
import PublicLayout from '@/layouts/public-layout';

/* ── Types ── */
type ContentType = 'article' | 'video' | 'infographic' | 'document';

interface PostMedia {
    cover: string | null;
    youtube_id: string | null;
    document: string | null;
}

interface RelatedPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content_type: string;
    featured_image_path: string | null;
    category: { name: string; slug: string };
    tags: { name: string; slug: string }[];
    author: string;
    published_at: string | null;
}

interface Post {
    id: number;
    title: string;
    excerpt: string;
    content: string | null;
    content_type: ContentType;
    media: PostMedia;
    category: { name: string; slug: string };
    tags: { name: string; slug: string }[];
    author: string;
    published_at: string | null;
}

interface BlogShowProps {
    post: Post;
    related_posts: RelatedPost[];
}

/* ── Helpers ── */
function readingTime(content: string | null): number {
    if (!content) {
        return 0;
    }

    const words = content
        .replace(/<[^>]+>/g, '')
        .trim()
        .split(/\s+/).length;

    return Math.max(1, Math.ceil(words / 200));
}

function AuthorAvatar({ name }: { name: string }) {
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-1 ring-primary/20">
            {initials}
        </div>
    );
}

const typeConfig: Record<
    ContentType,
    { label: string; icon: React.ElementType; color: string }
> = {
    article: {
        label: 'Artículo',
        icon: BookOpen,
        color: 'text-primary bg-primary/10 ring-primary/20',
    },
    video: {
        label: 'Video',
        icon: Film,
        color: 'text-rose-600 bg-rose-50 ring-rose-200 dark:text-rose-400 dark:bg-rose-950/40 dark:ring-rose-900',
    },
    infographic: {
        label: 'Infografía',
        icon: GalleryHorizontal,
        color: 'text-amber-600 bg-amber-50 ring-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:ring-amber-900',
    },
    document: {
        label: 'Documento',
        icon: FileText,
        color: 'text-sky-600 bg-sky-50 ring-sky-200 dark:text-sky-400 dark:bg-sky-950/40 dark:ring-sky-900',
    },
};

/* ── Component ── */
export default function BlogShow({ post, related_posts }: BlogShowProps) {
    const minutes = readingTime(post.content);
    const type = typeConfig[post.content_type] ?? typeConfig.article;
    const TypeIcon = type.icon;

    useEffect(() => {
        document.documentElement.classList.add('blog-post-print-scope');

        return () => {
            document.documentElement.classList.remove('blog-post-print-scope');
        };
    }, []);

    return (
        <PublicLayout>
            {/* ── Hero ── */}
            {post.media.cover ? (
                <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96 print:hidden">
                    <img
                        src={post.media.cover}
                        alt={post.title}
                        className="h-full w-full object-cover"
                    />
                    {/* Gradient: subtle top → strong bottom so text stays readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                </div>
            ) : (
                /* Thin accent stripe when no cover */
                <div className="h-1.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50 print:hidden" />
            )}

            {/* ── Article shell ── */}
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
                {/* Back link — floats over the hero gradient */}
                <div
                    className={
                        post.media.cover
                            ? 'relative z-10 -mt-14 pb-2 print:hidden'
                            : 'pt-10 print:hidden'
                    }
                >
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Volver al blog
                    </Link>
                </div>

                <div id="printable-article" className="article-printable">
                    {/* ── Post header ── */}
                    <header className="mt-6 mb-10">
                        {/* Badges */}
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <CategoryBadge
                                name={post.category.name}
                                slug={post.category.slug}
                            />
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${type.color}`}
                            >
                                <TypeIcon className="h-3 w-3" />
                                {type.label}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl leading-tight font-bold text-foreground sm:text-4xl">
                            {post.title}
                        </h1>

                        {/* Excerpt — lead paragraph */}
                        {post.excerpt && (
                            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Author / Meta */}
                        <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                            <AuthorAvatar name={post.author} />
                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    {post.author}
                                </p>
                                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                    {post.published_at && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {post.published_at}
                                        </span>
                                    )}
                                    {post.content_type === 'article' &&
                                        minutes > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {minutes} min de lectura
                                            </span>
                                        )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* ── Content section ── */}
                    <div className="mb-12">
                        {post.content_type === 'article' && post.content && (
                            <ArticleReaderActions
                                title={post.title}
                                excerpt={post.excerpt}
                                contentHtml={post.content}
                            />
                        )}

                        {post.content_type === 'video' &&
                            post.media.youtube_id && (
                                <VideoRenderer
                                    youtubeId={post.media.youtube_id}
                                    title={post.title}
                                />
                            )}

                        {(post.content_type === 'document' ||
                            post.content_type === 'infographic') &&
                            post.media.document && (
                                <DocumentRenderer
                                    documentUrl={post.media.document}
                                    title={post.title}
                                    type={post.content_type}
                                />
                            )}

                        {post.content_type === 'article' && post.content && (
                            <ArticleRenderer content={post.content} />
                        )}

                        {/* Empty state when no renderable content */}
                        {!post.content &&
                            !post.media.youtube_id &&
                            !post.media.document && (
                                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-14 text-center text-muted-foreground">
                                    <TypeIcon className="h-10 w-10 opacity-25" />
                                    <p className="text-sm">
                                        Contenido no disponible aún.
                                    </p>
                                </div>
                            )}
                    </div>
                </div>

                {/* ── Tags ── */}
                {post.tags.length > 0 && (
                    <div className="mb-16 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 px-5 py-3.5 print:hidden">
                        <Tag className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="mr-1 text-xs font-medium text-muted-foreground">
                            Etiquetas:
                        </span>
                        {post.tags.map((tag) => (
                            <CategoryBadge
                                key={tag.slug}
                                name={tag.name}
                                slug={tag.slug}
                                variant="tag"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Te puede interesar ── */}
            {related_posts.length > 0 && (
                <div className="border-t border-border bg-muted/20 py-12 print:hidden">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <div className="mb-6 flex items-end justify-between">
                            <div>
                                <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                                    Contenido relacionado
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-foreground">
                                    Te puede interesar
                                </h2>
                            </div>
                            <Link
                                href="/blog"
                                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                Ver todo →
                            </Link>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related_posts.map((p) => (
                                <PostCard key={p.id} post={p} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
