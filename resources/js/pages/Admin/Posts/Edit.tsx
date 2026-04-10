import { useForm, Link } from '@inertiajs/react';
import { AdminFormCard } from '@/components/admin/AdminFormCard';
import { ArticleHtmlEditorWithPreview } from '@/components/admin/ArticleHtmlEditorWithPreview';
import { FeaturedImageField } from '@/components/admin/FeaturedImageField';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

interface Option {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string | null;
    content_type: string;
    status: string;
    category_id: number;
    tag_ids: number[];
    youtube_video_id: string | null;
    featured_image_path: string | null;
    featured_image_url: string | null;
    document_url: string | null;
    published_at: string | null;
}

interface Props {
    post: Post;
    categories: Option[];
    tags: Option[];
}

export default function PostsEdit({ post, categories, tags }: Props) {
    const {
        data,
        setData,
        post: submit,
        processing,
        errors,
    } = useForm<{
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        content_type: string;
        status: string;
        category_id: string;
        tag_ids: number[];
        youtube_video_id: string;
        featured_image: File | null;
        remove_featured_image: boolean;
        document_url: string;
        published_at: string;
        _method: string;
    }>({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content ?? '',
        content_type: post.content_type,
        status: post.status,
        category_id: String(post.category_id),
        tag_ids: post.tag_ids,
        youtube_video_id: post.youtube_video_id ?? '',
        featured_image: null,
        remove_featured_image: false,
        document_url: post.document_url ?? '',
        published_at: post.published_at
            ? post.published_at.substring(0, 16)
            : '',
        _method: 'PUT',
    });

    const toggleTag = (id: number) => {
        setData(
            'tag_ids',
            data.tag_ids.includes(id)
                ? data.tag_ids.filter((t) => t !== id)
                : [...data.tag_ids, id],
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit(`/admin/posts/${post.id}`, { forceFormData: true });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Posts', href: '/admin/posts' },
                { title: 'Editar', href: '#' },
            ]}
        >
            <AdminFormCard title="Editar post" className="max-w-3xl">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    encType="multipart/form-data"
                >
                    <input type="hidden" name="_method" value="PUT" />

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="title">Título</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                            />
                            <InputError message={errors.title} />
                        </div>
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) =>
                                    setData('slug', e.target.value)
                                }
                            />
                            <InputError message={errors.slug} />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="excerpt">Resumen</Label>
                        <textarea
                            id="excerpt"
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            rows={2}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                        <InputError message={errors.excerpt} />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                        <div>
                            <Label htmlFor="content_type">Tipo</Label>
                            <select
                                id="content_type"
                                value={data.content_type}
                                onChange={(e) =>
                                    setData('content_type', e.target.value)
                                }
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                            >
                                <option value="article">Artículo</option>
                                <option value="video">Video</option>
                                <option value="infographic">Infografía</option>
                                <option value="document">Documento</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="status">Estado</Label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                            >
                                <option value="draft">Borrador</option>
                                <option value="published">Publicado</option>
                                <option value="archived">Archivado</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="category_id">Categoría</Label>
                            <select
                                id="category_id"
                                value={data.category_id}
                                onChange={(e) =>
                                    setData('category_id', e.target.value)
                                }
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.category_id} />
                        </div>
                    </div>

                    {data.content_type === 'article' && (
                        <ArticleHtmlEditorWithPreview
                            id="content"
                            value={data.content}
                            onChange={(v) => setData('content', v)}
                            error={errors.content}
                            rows={12}
                        />
                    )}

                    {data.content_type === 'video' && (
                        <div>
                            <Label htmlFor="youtube_video_id">
                                ID o enlace del video de YouTube
                            </Label>
                            <Input
                                id="youtube_video_id"
                                value={data.youtube_video_id}
                                onChange={(e) =>
                                    setData('youtube_video_id', e.target.value)
                                }
                            />
                            <InputError message={errors.youtube_video_id} />
                        </div>
                    )}

                    {(data.content_type === 'document' ||
                        data.content_type === 'infographic') && (
                        <div>
                            <Label htmlFor="document_url">
                                Enlace al archivo (Drive u otro)
                            </Label>
                            <p className="mb-1.5 text-xs text-muted-foreground">
                                URL pública del PDF o imagen alojada fuera del
                                sitio.
                            </p>
                            <Input
                                id="document_url"
                                type="url"
                                inputMode="url"
                                value={data.document_url}
                                onChange={(e) =>
                                    setData('document_url', e.target.value)
                                }
                                placeholder="https://…"
                            />
                            <InputError message={errors.document_url} />
                        </div>
                    )}

                    <FeaturedImageField
                        mode="edit"
                        file={data.featured_image}
                        onFileChange={(f) => {
                            setData('featured_image', f);

                            if (f) {
                                setData('remove_featured_image', false);
                            }
                        }}
                        removeFeaturedImage={data.remove_featured_image}
                        onRemoveFeaturedImageChange={(v) =>
                            setData('remove_featured_image', v)
                        }
                        serverImageUrl={post.featured_image_url}
                        serverImagePath={post.featured_image_path}
                        error={errors.featured_image}
                    />

                    {tags.length > 0 && (
                        <div>
                            <Label>Etiquetas</Label>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <label
                                        key={tag.id}
                                        className="flex cursor-pointer items-center gap-1.5"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.tag_ids.includes(
                                                tag.id,
                                            )}
                                            onChange={() => toggleTag(tag.id)}
                                            className="rounded border-input"
                                        />
                                        <span className="text-sm">
                                            {tag.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="published_at">
                            Fecha de publicación
                        </Label>
                        <Input
                            id="published_at"
                            type="datetime-local"
                            value={data.published_at}
                            onChange={(e) =>
                                setData('published_at', e.target.value)
                            }
                        />
                        <InputError message={errors.published_at} />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button type="submit" disabled={processing}>
                            Guardar cambios
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin/posts">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </AdminFormCard>
        </AppLayout>
    );
}
