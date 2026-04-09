import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { ArticleRenderer } from '@/components/renderers/article-renderer';
import { DocumentRenderer } from '@/components/renderers/document-renderer';
import { VideoRenderer } from '@/components/renderers/video-renderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';
import * as blogRoutes from '@/routes/blog';
import type { PostDetail } from '@/types';

function formatDate(iso: string | null): string {
    if (!iso) {
        return '';
    }
    try {
        return new Date(iso).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return '';
    }
}

function renderContent(post: PostDetail) {
    switch (post.content_type) {
        case 'video':
            return <VideoRenderer youtubeId={post.media.youtube_id} />;
        case 'infographic':
            return (
                <DocumentRenderer
                    url={post.media.document ?? post.media.cover}
                    kind="infographic"
                    title={post.title}
                />
            );
        case 'document':
            return (
                <DocumentRenderer
                    url={post.media.document}
                    kind="document"
                    title={post.title}
                />
            );
        case 'article':
        default:
            return <ArticleRenderer html={post.content} />;
    }
}

export default function BlogShow({ post }: { post: PostDetail }) {
    return (
        <PublicLayout title={post.title}>
            <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
                <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
                    <Link href={blogRoutes.index().url}>
                        <ArrowLeft className="size-4" />
                        Volver al blog
                    </Link>
                </Button>

                <header className="mb-8 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {post.category && (
                            <Badge variant="secondary">{post.category.name}</Badge>
                        )}
                        <Badge className="border-0 bg-gradient-to-br from-[var(--primary-from)] to-[var(--primary-to)] text-primary-foreground">
                            {post.content_type}
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                        {post.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">{post.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {post.author && (
                            <span className="inline-flex items-center gap-1.5">
                                <User className="size-4" />
                                {post.author}
                            </span>
                        )}
                        {post.published_at && (
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="size-4" />
                                {formatDate(post.published_at)}
                            </span>
                        )}
                    </div>
                </header>

                {post.media.cover && post.content_type !== 'infographic' && (
                    <figure className="mb-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        <img src={post.media.cover} alt={post.title} className="h-auto w-full" />
                    </figure>
                )}

                <div>{renderContent(post)}</div>

                {post.tags.length > 0 && (
                    <>
                        <Separator className="my-10" />
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-muted-foreground">Etiquetas:</span>
                            {post.tags.map((tag) => (
                                <Badge key={tag.slug} variant="outline">
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    </>
                )}
            </article>
        </PublicLayout>
    );
}
