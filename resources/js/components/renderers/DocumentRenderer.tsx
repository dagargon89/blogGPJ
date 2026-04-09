import { ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentRendererProps {
    documentUrl: string;
    title?: string;
    type?: 'document' | 'infographic';
}

/* ── Google Drive / Docs helpers ── */
function isGoogleUrl(url: string): boolean {
    return url.includes('drive.google.com') || url.includes('docs.google.com');
}

/**
 * Converts any Google Drive/Docs sharing URL to its embeddable form.
 *
 * drive.google.com/file/d/ID/view  →  /file/d/ID/preview
 * docs.google.com/presentation/…/edit  →  …/embed
 * docs.google.com/document/…/edit      →  …/pub?embedded=true
 * docs.google.com/spreadsheets/…/edit  →  …/pubhtml?widget=true&headers=false
 */
function toEmbedUrl(url: string): string {
    // Strip query params for cleaner replacement, then re-apply only what's needed
    const base = url.split('?')[0];

    if (/\/file\/d\/[^/]+/.test(base)) {
        return base.replace(/\/file\/d\/([^/]+)(\/.*)?$/, '/file/d/$1/preview');
    }
    if (/\/presentation\/d\//.test(base)) {
        return base.replace(/\/presentation\/d\/([^/]+)(\/.*)?$/, '/presentation/d/$1/embed?start=false&loop=false');
    }
    if (/\/document\/d\//.test(base)) {
        return base.replace(/\/document\/d\/([^/]+)(\/.*)?$/, '/document/d/$1/pub?embedded=true');
    }
    if (/\/spreadsheets\/d\//.test(base)) {
        return base.replace(/\/spreadsheets\/d\/([^/]+)(\/.*)?$/, '/spreadsheets/d/$1/pubhtml?widget=true&headers=false');
    }

    // Fallback: return as-is
    return url;
}

function hasImageExtension(url: string): boolean {
    return /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(url);
}

/* ── Shared iframe wrapper ── */
function EmbedFrame({ src, title, tall = false }: { src: string; title: string; tall?: boolean }) {
    return (
        <div className={`overflow-hidden rounded-xl border border-border ${tall ? 'h-[75vh]' : 'aspect-[4/3] sm:aspect-video'}`}>
            <iframe
                src={src}
                title={title}
                className="h-full w-full"
                allow="autoplay"
                allowFullScreen
            />
        </div>
    );
}

/* ── Fallback: open-in-browser card ── */
function ExternalCard({ url, title }: { url: string; title: string }) {
    return (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-10 text-center">
            <FileText className="h-12 w-12 text-primary/40" />
            <div>
                <p className="font-medium text-foreground">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Este archivo no puede mostrarse directamente. Ábrelo en Google Drive.
                </p>
            </div>
            <Button asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir en Google Drive
                </a>
            </Button>
        </div>
    );
}

/* ── Main component ── */
export function DocumentRenderer({ documentUrl, title = 'Documento', type = 'document' }: DocumentRendererProps) {
    // Google Drive / Docs — embed directly
    if (isGoogleUrl(documentUrl)) {
        const embedUrl = toEmbedUrl(documentUrl);
        return <EmbedFrame src={embedUrl} title={title} tall={type === 'document'} />;
    }

    // Local image (infographic stored as image file)
    if (type === 'infographic' && hasImageExtension(documentUrl)) {
        return (
            <div className="overflow-hidden rounded-xl border border-border">
                <img src={documentUrl} alt={title} className="w-full object-contain" />
            </div>
        );
    }

    // PDF
    if (/\.pdf(\?|$)/i.test(documentUrl)) {
        return <EmbedFrame src={documentUrl} title={title} tall />;
    }

    // Unknown external link
    return <ExternalCard url={documentUrl} title={title} />;
}
