import { Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calendar, Clock, Tag } from 'lucide-react';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { PostCard } from '@/components/cards/PostCard';
import { ArticleRenderer } from '@/components/renderers/ArticleRenderer';
import { VideoRenderer } from '@/components/renderers/VideoRenderer';
import { DocumentRenderer } from '@/components/renderers/DocumentRenderer';
import PublicLayout from '@/layouts/public-layout';

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
    content_type: 'article' | 'video' | 'infographic' | 'document';
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

function readingTime(content: string | null): number {
    if (!content) return 0;
    const words = content.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
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
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {initials}
        </div>
    );
}

const contentTypeLabel: Record<string, string> = {
    article: 'Artículo',
    video: 'Video',
    infographic: 'Infografía',
    document: 'Documento',
};

export default function BlogShow({ post, related_posts }: BlogShowProps) {
    const minutes = readingTime(post.content);
    const isArticle = post.content_type === 'article';

    return (
        <PublicLayout>
            {/* Hero: cover image full-width OR gradient header */}
            {post.media.cover ? (
                <div className="relative h-72 w-full overflow-hidden sm:h-96 lg:h-[480px]">
                    <img
                        src={post.media.cover}
                        alt={post.title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>
            ) : (
                <div className="h-6 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
            )}

            {/* Content area */}
            <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
                {/* Back link */}
                <div className={post.media.cover ? '-mt-16 relative z-10' : 'mt-10'}>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al blog
                    </Link>
                </div>

                {/* Header */}
                <header className="mt-6">
                    {/* Category + type */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <CategoryBadge name={post.category.name} slug={post.category.slug} />
                        <span className="flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                            <BookOpen className="h-3 w-3" />
                            {contentTypeLabel[post.content_type]}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                        {post.title}
                    </h1>

                    <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>

                    {/* Meta */}
                    <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                        <AuthorAvatar name={post.author} />
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-foreground">{post.author}</span>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {post.published_at && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {post.published_at}
                                    </span>
                                )}
                                {isArticle && minutes > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {minutes} min de lectura
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="mt-10">
                    {post.content_type === 'video' && post.media.youtube_id && (
                        <VideoRenderer youtubeId={post.media.youtube_id} title={post.title} />
                    )}

                    {(post.content_type === 'document' || post.content_type === 'infographic') && post.media.document && (
                        <DocumentRenderer documentUrl={post.media.document} title={post.title} type={post.content_type} />
                    )}

                    {isArticle && post.content && (
                        <ArticleRenderer content={post.content} />
                    )}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="mt-10 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 px-5 py-4">
                        <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {post.tags.map((tag) => (
                            <CategoryBadge key={tag.slug} name={tag.name} slug={tag.slug} variant="tag" />
                        ))}
                    </div>
                )}
            </div>

            {/* Related posts */}
            {related_posts.length > 0 && (
                <div className="border-t border-border bg-muted/20">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                        <h2 className="mb-6 text-xl font-semibold text-foreground">
                            Más de{' '}
                            <Link
                                href={`/categoria/${post.category.slug}`}
                                className="text-primary hover:underline"
                            >
                                {post.category.name}
                            </Link>
                        </h2>
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
