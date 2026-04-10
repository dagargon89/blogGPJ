/**
 * Convierte fragmento HTML a texto plano (respeta saltos aproximados del DOM).
 */
export function htmlToPlainText(html: string): string {
    if (typeof document === 'undefined') {
        return html
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.innerText ?? doc.body.textContent ?? '';

    return text.replace(/\n{3,}/g, '\n\n').trim();
}

interface BuildPlainTextForCopyParams {
    title: string;
    excerpt: string | null | undefined;
    html: string;
}

/**
 * Texto listo para portapapeles: título, extracto opcional y cuerpo.
 */
export function buildPlainTextForCopy({
    title,
    excerpt,
    html,
}: BuildPlainTextForCopyParams): string {
    const parts: string[] = [title.trim()];

    if (excerpt?.trim()) {
        parts.push('', excerpt.trim());
    }

    const body = htmlToPlainText(html);

    if (body) {
        parts.push('', body);
    }

    return parts.join('\n').trim();
}
