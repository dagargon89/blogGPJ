import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentRendererProps {
    documentUrl: string;
    title?: string;
    type?: 'document' | 'infographic';
}

export function DocumentRenderer({ documentUrl, title = 'Documento', type = 'document' }: DocumentRendererProps) {
    const isPdf = documentUrl.toLowerCase().endsWith('.pdf');
    const isImage = /\.(png|jpe?g|webp|gif)$/i.test(documentUrl);

    if (type === 'infographic' && isImage) {
        return (
            <div className="overflow-hidden rounded-xl border border-border">
                <img src={documentUrl} alt={title} className="w-full object-contain" />
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
                    Descargar
                </a>
            </Button>
        </div>
    );
}
