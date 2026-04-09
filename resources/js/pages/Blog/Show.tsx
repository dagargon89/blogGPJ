import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { ArticleRenderer } from '@/components/renderers/ArticleRenderer';
import { VideoRenderer } from '@/components/renderers/VideoRenderer';
import { DocumentRenderer } from '@/components/renderers/DocumentRenderer';
import PublicLayout from '@/layouts/public-layout';

interface PostMedia {
    cover: string | null;
    youtube_id: string | null;
    document: string | null;
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
}

export default function BlogShow({ post }: BlogShowProps) {
    return (
        <PublicLayout>
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
                {/* Back */}
                <Link href="/blog" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Volver al blog
                </Link>

                {/* Header */}
                <header className="mb-8">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <CategoryBadge name={post.category.name} slug={post.category.slug} />
                        <span className="text-xs text-muted-foreground">{post.content_type}</span>
                    </div>

                    <h1 className="mb-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl">{post.title}</h1>

                    <p className="mb-4 text-lg text-muted-foreground">{post.excerpt}</p>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{post.author}</span>
                        {post.published_at && (
                            <>
                                <span>&middot;</span>
                                <span>{post.published_at}</span>
                            </>
                        )}
                    </div>

                    {/* Cover image */}
                    {post.media.cover && (
                        <img
                            src={post.media.cover}
                            alt={post.title}
                            className="mt-6 w-full rounded-xl object-cover"
                            style={{ maxHeight: '420px' }}
                        />
                    )}
                </header>

                {/* Content renderer */}
                <div className="mb-10">
                    {post.content_type === 'video' && post.media.youtube_id && (
                        <VideoRenderer youtubeId={post.media.youtube_id} title={post.title} />
                    )}

                    {(post.content_type === 'document' || post.content_type === 'infographic') && post.media.document && (
                        <DocumentRenderer documentUrl={post.media.document} title={post.title} type={post.content_type} />
                    )}

                    {post.content_type === 'article' && post.content && (
                        <ArticleRenderer content={post.content} />
                    )}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
                        <span className="text-sm text-muted-foreground">Etiquetas:</span>
                        {post.tags.map((tag) => (
                            <CategoryBadge key={tag.slug} name={tag.name} slug={tag.slug} variant="tag" />
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
