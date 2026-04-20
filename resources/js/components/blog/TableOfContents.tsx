import { useEffect, useState } from 'react';
import { List } from 'lucide-react';
import type { Heading } from '@/lib/article-headings';

interface TableOfContentsProps {
    headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '');

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                }
            },
            { rootMargin: '-80px 0% -65% 0%', threshold: 0 },
        );

        for (const { id } of headings) {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        }

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length < 2) return null;

    return (
        <nav aria-label="Índice del artículo" className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                <List className="h-3.5 w-3.5 shrink-0" />
                En este artículo
            </p>

            <ol className="space-y-0.5 border-l border-border text-sm">
                {headings.map(({ id, text, level }) => {
                    const isActive = activeId === id;
                    return (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .getElementById(id)
                                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    setActiveId(id);
                                }}
                                className={[
                                    'block py-1.5 pr-2 leading-snug transition-colors',
                                    level === 3 ? 'pl-5' : 'pl-3',
                                    isActive
                                        ? '-ml-px border-l-2 border-primary text-primary font-medium'
                                        : 'text-muted-foreground hover:text-foreground',
                                ].join(' ')}
                            >
                                {text}
                            </a>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
