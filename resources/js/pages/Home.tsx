import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { PostCard } from '@/components/cards/PostCard';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    posts_count: number;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content_type: string;
    featured_image_path: string | null;
    category: { name: string; slug: string };
    author: string;
    published_at: string | null;
}

interface HomeProps {
    recentPosts: Post[];
    categories: Category[];
}

export default function Home({ recentPosts, categories }: HomeProps) {
    return (
        <PublicLayout>
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/20 py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Hub de{' '}
                        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Conocimiento
                        </span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Artículos, videos, infografías y documentos del equipo para el equipo.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Button asChild size="lg">
                            <Link href="/blog">Explorar contenido</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                    <h2 className="mb-6 text-2xl font-semibold text-foreground">Categorías</h2>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/categoria/${category.slug}`}
                                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm shadow-sm transition-shadow hover:shadow-md"
                            >
                                <span className="font-medium">{category.name}</span>
                                {category.posts_count > 0 && (
                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                        {category.posts_count}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Recent posts */}
            <section className="mx-auto max-w-7xl px-4 py-4 pb-16 sm:px-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-foreground">Publicaciones recientes</h2>
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/blog" className="flex items-center gap-1">
                            Ver todo <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {recentPosts.length === 0 ? (
                    <p className="text-center text-muted-foreground">Aún no hay publicaciones.</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recentPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
