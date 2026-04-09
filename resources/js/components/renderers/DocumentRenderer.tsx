import { Download, ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentRendererProps {
    documentUrl: string;
    title?: string;
    type?: 'document' | 'infographic';
}

function hasImageExtension(url: string): boolean {
    try {
        const path = new URL(url).pathname;

        return /\.(png|jpe?g|webp|gif)$/i.test(path);
    } catch {
        return /\.(png|jpe?g|webp|gif)$/i.test(url);
    }
}

function hasPdfExtension(url: string): boolean {
    try {
        const path = new URL(url).pathname;

        return path.toLowerCase().endsWith('.pdf');
    } catch {
        return url.toLowerCase().endsWith('.pdf');
    }
}

export function DocumentRenderer({ documentUrl, title = 'Documento', type = 'document' }: DocumentRendererProps) {
    const isPdf = hasPdfExtension(documentUrl);
    const isImage = hasImageExtension(documentUrl);

    if (type === 'infographic' && isImage) {
        return (
            <div className="overflow-hidden rounded-xl border border-border">
                <img src={documentUrl} alt={title} className="w-full object-contain" />
            </div>
        );
    }

    if (type === 'infographic' && !isImage) {
        return (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-8 text-center">
                <FileText className="h-12 w-12 text-primary/60" />
                <p className="font-medium text-foreground">{title}</p>
                <p className="max-w-md text-sm text-muted-foreground">
                    Enlace a infografía alojada externamente (p. ej. Google Drive). Ábrela en una pestaña nueva si no se
                    muestra aquí.
                </p>
                <Button asChild>
                    <a href={documentUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir infografía
                    </a>
                </Button>
            </div>
        );
    }

    if (isPdf) {
        return (
            <div className="overflow-hidden rounded-xl border border-border">
                <iframe src={documentUrl} title={title} className="h-[70vh] w-full" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-8 text-center">
            <FileText className="h-12 w-12 text-primary/60" />
            <p className="font-medium text-foreground">{title}</p>
            <Button asChild>
                <a href={documentUrl} download target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Abrir o descargar
                </a>
            </Button>
        </div>
    );
}
