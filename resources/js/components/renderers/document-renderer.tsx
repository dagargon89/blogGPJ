import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
    url: string | null;
    kind: 'infographic' | 'document';
    title: string;
};

export function DocumentRenderer({ url, kind, title }: Props) {
    if (!url) {
        return (
            <p className="text-muted-foreground">No hay archivo adjunto para esta publicación.</p>
        );
    }

    const isImage = /\.(png|jpe?g|webp|gif)$/i.test(url);

    if (kind === 'infographic' || isImage) {
        return (
            <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <img src={url} alt={title} className="h-auto w-full" loading="lazy" />
            </figure>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <iframe
                    src={url}
                    title={title}
                    className="h-[70vh] w-full"
                />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="size-4" />
                    <span>Documento adjunto</span>
                </div>
                <Button asChild size="sm" variant="outline">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        Abrir
                    </a>
                </Button>
            </div>
        </div>
    );
}
