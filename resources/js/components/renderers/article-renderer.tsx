export function ArticleRenderer({ html }: { html: string | null }) {
    if (!html) {
        return (
            <p className="text-muted-foreground">Este artículo aún no tiene contenido.</p>
        );
    }

    return (
        <div
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
