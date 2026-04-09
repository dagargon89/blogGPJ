interface ArticleRendererProps {
    content: string;
}

export function ArticleRenderer({ content }: ArticleRendererProps) {
    return (
        <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
