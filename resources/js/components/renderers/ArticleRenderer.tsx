interface ArticleRendererProps {
    content: string;
}

export function ArticleRenderer({ content }: ArticleRendererProps) {
    return (
        <div
            className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            // Content comes from our own editor — stored as sanitized HTML
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
