export interface Heading {
    id: string;
    text: string;
    level: 2 | 3;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-{2,}/g, '-');
}

/**
 * Parses article HTML, injects unique IDs into h2/h3 elements,
 * and returns the modified HTML alongside a headings list for the TOC.
 */
export function processArticleContent(html: string): { content: string; headings: Heading[] } {
    if (typeof window === 'undefined') {
        return { content: html, headings: [] };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = Array.from(doc.querySelectorAll('h2, h3'));

    const headings: Heading[] = [];
    const seen = new Map<string, number>();

    for (const el of elements) {
        const text = el.textContent?.trim() ?? '';
        let id = slugify(text) || `heading-${headings.length}`;
        const count = seen.get(id) ?? 0;
        seen.set(id, count + 1);
        if (count > 0) id = `${id}-${count}`;

        el.id = id;
        headings.push({ id, text, level: parseInt(el.tagName[1]) as 2 | 3 });
    }

    return { content: doc.body.innerHTML, headings };
}
