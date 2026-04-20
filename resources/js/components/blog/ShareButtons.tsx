import { Check, Link2, Mail } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ShareButtonsProps {
    title: string;
    className?: string;
}

/* ── Inline brand SVGs (Lucide doesn't include social logos) ── */
function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
    );
}

interface ShareItem {
    key: string;
    label: string;
    icon: React.ElementType;
    hoverClass: string;
    getUrl: (url: string, title: string) => string | null;
}

const shareItems: ShareItem[] = [
    {
        key: 'facebook',
        label: 'Facebook',
        icon: FacebookIcon,
        hoverClass:
            'hover:border-[#1877F2]/40 hover:bg-[#1877F2]/8 hover:text-[#1877F2] dark:hover:border-[#1877F2]/50 dark:hover:text-[#4fa3ff]',
        getUrl: (url) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
        key: 'x',
        label: 'X',
        icon: XIcon,
        hoverClass:
            'hover:border-foreground/30 hover:bg-foreground/8 hover:text-foreground',
        getUrl: (url, title) =>
            `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
        key: 'whatsapp',
        label: 'WhatsApp',
        icon: WhatsAppIcon,
        hoverClass:
            'hover:border-[#25D366]/40 hover:bg-[#25D366]/8 hover:text-[#25D366] dark:hover:border-[#25D366]/50',
        getUrl: (url, title) =>
            `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
        key: 'email',
        label: 'Correo',
        icon: Mail,
        hoverClass:
            'hover:border-primary/40 hover:bg-primary/8 hover:text-primary',
        getUrl: (url, title) =>
            `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    },
];

export function ShareButtons({ title, className }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = useCallback((getUrl: ShareItem['getUrl']) => {
        const url = window.location.href;
        const target = getUrl(url, title);
        if (target) {
            window.open(target, '_blank', 'noopener,noreferrer,width=600,height=500');
        }
    }, [title]);

    const handleCopyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            toast.success('Enlace copiado al portapapeles');
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('No se pudo copiar el enlace.');
        }
    }, []);

    return (
        <div className={cn('not-prose', className)}>
            <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Compartir
            </p>
            <div className="flex flex-wrap gap-2">
                {shareItems.map(({ key, label, icon: Icon, hoverClass, getUrl }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => handleShare(getUrl)}
                        aria-label={`Compartir en ${label}`}
                        className={cn(
                            'inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-all duration-150',
                            hoverClass,
                        )}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{label}</span>
                    </button>
                ))}

                {/* Copy link */}
                <button
                    type="button"
                    onClick={() => void handleCopyLink()}
                    aria-label={copied ? 'Enlace copiado' : 'Copiar enlace'}
                    className={cn(
                        'inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium shadow-sm transition-all duration-150',
                        copied
                            ? 'border-emerald-500/40 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                            : 'text-muted-foreground hover:border-primary/40 hover:bg-primary/8 hover:text-primary',
                    )}
                >
                    {copied ? (
                        <Check className="h-4 w-4 shrink-0" />
                    ) : (
                        <Link2 className="h-4 w-4 shrink-0" />
                    )}
                    <span>{copied ? 'Copiado' : 'Copiar enlace'}</span>
                </button>
            </div>
        </div>
    );
}
