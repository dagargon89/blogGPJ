/** Clase compartida con el editor de preview del admin */
export const ARTICLE_PROSE_CLASSNAME = 'article-body';

interface ArticleRendererProps {
    content: string;
}

export function ArticleRenderer({ content }: ArticleRendererProps) {
    return (
        <div
            className={ARTICLE_PROSE_CLASSNAME}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
