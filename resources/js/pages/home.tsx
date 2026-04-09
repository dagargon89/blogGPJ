import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PostCard } from '@/components/blog/post-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import * as blogRoutes from '@/routes/blog';
import type { Category, PostCard as PostCardType } from '@/types';

type Props = {
    featured: PostCardType | null;
    recent: PostCardType[];
    categories: Category[];
};

export default function Home({ featured, recent, categories }: Props) {
    return (
        <PublicLayout title="Inicio">
            <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-accent/40 to-background">
                <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
                    <div className="flex flex-col justify-center gap-5">
                        <Badge
                            variant="secondary"
                            className="w-fit rounded-full border-0 bg-background/80 backdrop-blur"
                        >
                            <Sparkles className="size-3 text-primary" />
                            Hub de Conocimiento
                        </Badge>
                        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                            Todo lo que tu equipo necesita saber,{' '}
                            <span className="bg-gradient-to-br from-[var(--primary-from)] to-[var(--primary-to)] bg-clip-text text-transparent">
                                en un solo lugar.
                            </span>
                        </h1>
                        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                            Artículos, vídeos, infografías y documentos internos para
                            compartir lo aprendido y mantener al equipo alineado.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button asChild size="lg">
                                <Link href={blogRoutes.index().url}>
                                    Explorar publicaciones
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href={blogRoutes.index({ query: { type: 'video' } }).url}>
                                    Ver vídeos
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {featured && (
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--primary-from)]/30 to-[var(--primary-to)]/10 blur-2xl" />
                            <div className="relative">
                                <PostCard post={featured} />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {categories.length > 0 && (
                <section className="border-b border-border/60 bg-background">
                    <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-4 py-6 sm:px-6">
                        <span className="mr-2 text-sm font-medium text-muted-foreground">
                            Categorías:
                        </span>
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={
                                    blogRoutes.index({ query: { category: category.slug } }).url
                                }
                                className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                            >
                                {category.name}
                                {typeof category.posts_count === 'number' && (
                                    <span className="ml-1 text-xs text-muted-foreground/70">
                                        ({category.posts_count})
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Publicaciones recientes
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Novedades y conocimiento publicado por el equipo.
                        </p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                        <Link href={blogRoutes.index().url}>
                            Ver todo
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>

                {recent.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
                        Todavía no hay publicaciones disponibles.
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recent.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
