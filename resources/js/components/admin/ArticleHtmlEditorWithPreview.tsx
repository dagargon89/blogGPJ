import DOMPurify from 'dompurify';
import { useDeferredValue, useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { ARTICLE_PROSE_CLASSNAME } from '@/components/renderers/ArticleRenderer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const PREVIEW_ALLOWED_TAGS = [
    'a',
    'article',
    'b',
    'blockquote',
    'br',
    'code',
    'div',
    'em',
    'figcaption',
    'figure',
    'footer',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'hr',
    'i',
    'img',
    'li',
    'main',
    'nav',
    'ol',
    'p',
    'pre',
    'section',
    'span',
    'strong',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
];

const PREVIEW_ALLOWED_ATTR = [
    'alt',
    'class',
    'colspan',
    'href',
    'id',
    'rel',
    'rowspan',
    'src',
    'target',
    'title',
];

export interface ArticleHtmlEditorWithPreviewProps {
    id: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    rows?: number;
}

export function ArticleHtmlEditorWithPreview({
    id,
    label = 'Contenido (HTML)',
    value,
    onChange,
    error,
    placeholder,
    rows = 12,
}: ArticleHtmlEditorWithPreviewProps) {
    const [mobilePanel, setMobilePanel] = useState<'edit' | 'preview'>('edit');
    const deferredValue = useDeferredValue(value);

    const safePreviewHtml = useMemo(() => {
        const trimmed = deferredValue.trim();

        if (!trimmed) {
            return '';
        }

        return DOMPurify.sanitize(trimmed, {
            ALLOWED_TAGS: PREVIEW_ALLOWED_TAGS,
            ALLOWED_ATTR: PREVIEW_ALLOWED_ATTR,
        });
    }, [deferredValue]);

    const editor = (
        <div className="flex min-h-[min(28rem,70vh)] flex-col lg:min-h-[28rem]">
            <textarea
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className="min-h-[min(28rem,70vh)] w-full flex-1 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring lg:min-h-[28rem]"
                placeholder={placeholder}
            />
        </div>
    );

    const preview = (
        <div
            className={cn(
                'min-h-[min(28rem,70vh)] overflow-y-auto rounded-md border border-input bg-muted/30 p-4 lg:min-h-[28rem]',
            )}
        >
            {safePreviewHtml ? (
                <div
                    className={ARTICLE_PROSE_CLASSNAME}
                    // Sanitized for admin preview only (DOMPurify)
                    dangerouslySetInnerHTML={{ __html: safePreviewHtml }}
                />
            ) : (
                <p className="text-sm text-muted-foreground">La vista previa aparecerá aquí al escribir HTML.</p>
            )}
        </div>
    );

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>

            {/* Sale del max-w-3xl del formulario: ancho = 75vw respecto al viewport */}
            <div className="relative ml-[calc(50%-50vw)] w-screen max-w-[100vw] overflow-x-clip px-3 sm:px-6">
                <div className="mx-auto w-full min-w-0 space-y-2 lg:w-[75vw]">
                    <div className="flex gap-2 lg:hidden">
                        <Button
                            type="button"
                            size="sm"
                            variant={mobilePanel === 'edit' ? 'default' : 'outline'}
                            onClick={() => setMobilePanel('edit')}
                        >
                            Editor
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={mobilePanel === 'preview' ? 'default' : 'outline'}
                            onClick={() => setMobilePanel('preview')}
                        >
                            Vista previa
                        </Button>
                    </div>

                    <div className="hidden gap-4 lg:grid lg:grid-cols-2">
                        {editor}
                        <div className="flex min-h-0 flex-col">
                            <p className="mb-2 text-xs font-medium text-muted-foreground">Vista previa</p>
                            {preview}
                        </div>
                    </div>

                    <div className="lg:hidden">
                        {mobilePanel === 'edit' ? editor : preview}
                    </div>
                </div>
            </div>

            <InputError message={error} />
        </div>
    );
}
