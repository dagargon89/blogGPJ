import { Copy, Printer } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { buildPlainTextForCopy } from '@/lib/articlePlainText';
import { cn } from '@/lib/utils';

interface ArticleReaderActionsProps {
    title: string;
    excerpt: string | null | undefined;
    contentHtml: string;
    className?: string;
}

export function ArticleReaderActions({
    title,
    excerpt,
    contentHtml,
    className,
}: ArticleReaderActionsProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        const text = buildPlainTextForCopy({
            title,
            excerpt,
            html: contentHtml,
        });

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Texto copiado al portapapeles');
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error(
                'No se pudo copiar. Revisa los permisos del navegador.',
            );
        }
    }, [title, excerpt, contentHtml]);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    return (
        <div
            className={cn('mb-6 flex flex-wrap gap-2 print:hidden', className)}
        >
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => void handleCopy()}
                aria-label={
                    copied ? 'Texto copiado' : 'Copiar texto del artículo'
                }
            >
                <Copy className="h-3.5 w-3.5" aria-hidden />
                {copied ? 'Copiado' : 'Copiar texto'}
            </Button>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handlePrint}
                aria-label="Imprimir artículo"
            >
                <Printer className="h-3.5 w-3.5" aria-hidden />
                Imprimir
            </Button>
        </div>
    );
}
