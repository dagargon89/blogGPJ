import { PostCard } from '@/components/cards/PostCard';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { router } from '@inertiajs/react';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content_type: string;
    featured_image_path: string | null;
    tags: { name: string; slug: string }[];
    author: string;
    published_at: string | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
}

interface PaginatedPosts {
    data: Post[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: { current_page: number; last_page: number; total: number };
}

interface CategoryShowProps {
    category: Category;
    posts: PaginatedPosts;
}

export default function CategoryShow({ category, posts }: CategoryShowProps) {
    // Posts need category info — inject it
    const postsWithCategory = posts.data.map((p) => ({ ...p, category: { name: category.name, slug: category.slug } }));

    return (
        <PublicLayout>
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
                <header className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-foreground">{category.name}</h1>
                    {category.description && (
                        <p className="text-muted-foreground">{category.description}</p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">
                        {posts.meta.total} publicación{posts.meta.total !== 1 ? 'es' : ''}
                    </p>
                </header>

                {postsWithCategory.length === 0 ? (
                    <p className="py-16 text-center text-muted-foreground">No hay publicaciones en esta categoría aún.</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {postsWithCategory.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {posts.meta.last_page > 1 && (
                    <div className="mt-10 flex justify-center gap-2">
                        {posts.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
