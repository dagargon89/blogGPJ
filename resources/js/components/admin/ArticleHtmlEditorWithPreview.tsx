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

const PANEL_MIN_HEIGHT = 'min-h-[min(22rem,55vh)] lg:min-h-[22rem]';

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

    const panelChrome =
        'rounded-lg border border-border/80 bg-background shadow-sm';

    const editor = (
        <div className={cn('flex flex-col p-2', PANEL_MIN_HEIGHT)}>
            <textarea
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className="min-h-[min(20rem,50vh)] w-full flex-1 resize-y rounded-md border border-border/60 bg-background px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring lg:min-h-[20rem]"
                placeholder={placeholder}
            />
        </div>
    );

    const preview = (
        <div
            className={cn(
                'flex min-h-0 flex-col overflow-hidden',
                PANEL_MIN_HEIGHT,
                panelChrome,
            )}
        >
            <div className="min-h-[min(20rem,50vh)] flex-1 overflow-y-auto bg-muted/15 p-4 lg:min-h-[20rem]">
                {safePreviewHtml ? (
                    <div
                        className={ARTICLE_PROSE_CLASSNAME}
                        // Sanitized for admin preview only (DOMPurify)
                        dangerouslySetInnerHTML={{ __html: safePreviewHtml }}
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">
                        La vista previa aparecerá aquí al escribir HTML.
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-3">
            <Label htmlFor={id}>{label}</Label>

            <div
                className={cn(
                    'rounded-xl border border-border/70 bg-card/40 p-4 shadow-sm dark:bg-card/30',
                )}
            >
                <div className="mb-3 flex gap-2 lg:hidden">
                    <Button
                        type="button"
                        size="sm"
                        variant={
                            mobilePanel === 'edit' ? 'default' : 'outline'
                        }
                        onClick={() => setMobilePanel('edit')}
                    >
                        Editor HTML
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant={
                            mobilePanel === 'preview' ? 'default' : 'outline'
                        }
                        onClick={() => setMobilePanel('preview')}
                    >
                        Vista previa
                    </Button>
                </div>

                <div className="hidden gap-4 lg:grid lg:grid-cols-2">
                    <div className="flex min-h-0 flex-col space-y-2">
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            Editor HTML
                        </p>
                        <div className={panelChrome}>{editor}</div>
                    </div>
                    <div className="flex min-h-0 flex-col space-y-2">
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            Vista previa
                        </p>
                        {preview}
                    </div>
                </div>

                <div className="space-y-2 lg:hidden">
                    {mobilePanel === 'edit' ? (
                        <div className={panelChrome}>{editor}</div>
                    ) : (
                        preview
                    )}
                </div>
            </div>

            <InputError message={error} />
        </div>
    );
}
