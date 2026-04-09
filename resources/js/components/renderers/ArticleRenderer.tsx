/** Misma tipografía que la vista previa del admin y el detalle del post. */
export const ARTICLE_PROSE_CLASSNAME =
    'prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline';

interface ArticleRendererProps {
    content: string;
}

export function ArticleRenderer({ content }: ArticleRendererProps) {
    return (
        <div
            className={ARTICLE_PROSE_CLASSNAME}
            // Content comes from our own editor — stored as sanitized HTML
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
