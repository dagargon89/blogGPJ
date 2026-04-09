import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { type FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import admin from '@/routes/admin';
import type { BreadcrumbItem, ContentType, PostStatus } from '@/types';

type Props = {
    categories: Array<{ id: number; name: string }>;
    tags: Array<{ id: number; name: string }>;
};

type FormData = {
    title: string;
    slug: string;
    category_id: string;
    excerpt: string;
    content_type: ContentType;
    status: PostStatus;
    content: string;
    youtube_video_id: string;
    featured_image: File | null;
    document: File | null;
    published_at: string;
    tags: number[];
};

export default function PostCreate({ categories, tags }: Props) {
    const form = useForm<FormData>({
        title: '',
        slug: '',
        category_id: '',
        excerpt: '',
        content_type: 'article',
        status: 'draft',
        content: '',
        youtube_video_id: '',
        featured_image: null,
        document: null,
        published_at: '',
        tags: [],
    });

    const submit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        form.post(admin.posts.store().url, { forceFormData: true });
    };

    const toggleTag = (tagId: number): void => {
        const current = form.data.tags;
        form.setData(
            'tags',
            current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId],
        );
    };

    const contentType = form.data.content_type;

    return (
        <>
            <Head title="Nueva publicación" />
            <div className="mx-auto w-full max-w-4xl p-4">
                <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
                    <Link href={admin.posts.index().url}>
                        <ArrowLeft className="size-4" />
                        Volver
                    </Link>
                </Button>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nueva publicación</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    id="title"
                                    value={form.data.title}
                                    onChange={(e) => form.setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug (opcional)</Label>
                                <Input
                                    id="slug"
                                    value={form.data.slug}
                                    onChange={(e) => form.setData('slug', e.target.value)}
                                    placeholder="se genera a partir del título"
                                />
                                <InputError message={form.errors.slug} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="excerpt">Extracto</Label>
                                <textarea
                                    id="excerpt"
                                    value={form.data.excerpt}
                                    onChange={(e) => form.setData('excerpt', e.target.value)}
                                    rows={3}
                                    required
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                <InputError message={form.errors.excerpt} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="category_id">Categoría</Label>
                                    <Select
                                        value={form.data.category_id}
                                        onValueChange={(value) => form.setData('category_id', value)}
                                    >
                                        <SelectTrigger id="category_id">
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.category_id} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="content_type">Tipo de contenido</Label>
                                    <Select
                                        value={form.data.content_type}
                                        onValueChange={(value) =>
                                            form.setData('content_type', value as ContentType)
                                        }
                                    >
                                        <SelectTrigger id="content_type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="article">Artículo</SelectItem>
                                            <SelectItem value="video">Video</SelectItem>
                                            <SelectItem value="infographic">Infografía</SelectItem>
                                            <SelectItem value="document">Documento</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.content_type} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Estado</Label>
                                    <Select
                                        value={form.data.status}
                                        onValueChange={(value) =>
                                            form.setData('status', value as PostStatus)
                                        }
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Borrador</SelectItem>
                                            <SelectItem value="published">Publicado</SelectItem>
                                            <SelectItem value="archived">Archivado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={form.errors.status} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="published_at">Fecha de publicación</Label>
                                    <Input
                                        id="published_at"
                                        type="datetime-local"
                                        value={form.data.published_at}
                                        onChange={(e) => form.setData('published_at', e.target.value)}
                                    />
                                    <InputError message={form.errors.published_at} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contenido</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-5">
                            {contentType === 'article' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="content">Cuerpo del artículo (HTML)</Label>
                                    <textarea
                                        id="content"
                                        value={form.data.content}
                                        onChange={(e) => form.setData('content', e.target.value)}
                                        rows={12}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                    <InputError message={form.errors.content} />
                                </div>
                            )}

                            {contentType === 'video' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="youtube_video_id">ID del video de YouTube</Label>
                                    <Input
                                        id="youtube_video_id"
                                        value={form.data.youtube_video_id}
                                        onChange={(e) => form.setData('youtube_video_id', e.target.value)}
                                        placeholder="dQw4w9WgXcQ"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Solo el identificador, no la URL completa.
                                    </p>
                                    <InputError message={form.errors.youtube_video_id} />
                                </div>
                            )}

                            {(contentType === 'infographic' || contentType === 'document') && (
                                <div className="grid gap-2">
                                    <Label htmlFor="document">
                                        {contentType === 'infographic' ? 'Imagen de la infografía' : 'Documento PDF'}
                                    </Label>
                                    <Input
                                        id="document"
                                        type="file"
                                        accept={
                                            contentType === 'infographic'
                                                ? 'image/png,image/jpeg,image/webp'
                                                : 'application/pdf'
                                        }
                                        onChange={(e) =>
                                            form.setData('document', e.target.files?.[0] ?? null)
                                        }
                                    />
                                    <InputError message={form.errors.document} />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="featured_image">Imagen destacada (opcional)</Label>
                                <Input
                                    id="featured_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        form.setData('featured_image', e.target.files?.[0] ?? null)
                                    }
                                />
                                <InputError message={form.errors.featured_image} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Etiquetas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tags.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No hay etiquetas disponibles.
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {tags.map((tag) => {
                                        const checked = form.data.tags.includes(tag.id);
                                        return (
                                            <label
                                                key={tag.id}
                                                className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:border-primary/50"
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={() => toggleTag(tag.id)}
                                                />
                                                <span>{tag.name}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                            <InputError message={form.errors.tags} className="mt-2" />
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="outline" type="button">
                            <Link href={admin.posts.index().url}>Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel admin', href: admin.dashboard() },
    { title: 'Publicaciones', href: admin.posts.index() },
    { title: 'Nueva', href: admin.posts.create() },
];

PostCreate.layout = { breadcrumbs };
