import { Link } from '@inertiajs/react';
import { FileText, Image, Video } from 'lucide-react';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { Card, CardContent } from '@/components/ui/card';

const contentTypeIcon: Record<string, React.ReactNode> = {
    video: <Video className="h-3 w-3" />,
    infographic: <Image className="h-3 w-3" />,
    document: <FileText className="h-3 w-3" />,
    article: null,
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
    return (
        <Card className="group flex flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow duration-200 hover:shadow-md">
            {/* Cover image */}
            {post.featured_image_path ? (
                <div className="h-44 overflow-hidden bg-muted">
                    <img
                        src={post.featured_image_path}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            ) : (
                <div className="flex h-44 items-center justify-center bg-accent/30">
                    <span className="text-4xl text-primary/30">
                        {contentTypeIcon[post.content_type] ?? <FileText className="h-10 w-10" />}
                    </span>
                </div>
            )}

            <CardContent className="flex flex-1 flex-col gap-3 p-4">
                {/* Category + type */}
                <div className="flex items-center gap-2">
                    <CategoryBadge name={post.category.name} slug={post.category.slug} />
                    {contentTypeIcon[post.content_type] && (
                        <span className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                            {contentTypeIcon[post.content_type]}
                            {post.content_type}
                        </span>
                    )}
                </div>

                {/* Title */}
                <Link href={`/blog/${post.slug}`}>
                    <h3 className="line-clamp-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                    </h3>
                </Link>

                {/* Excerpt */}
                <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>{post.published_at}</span>
                </div>
            </CardContent>
        </Card>
    );
}
