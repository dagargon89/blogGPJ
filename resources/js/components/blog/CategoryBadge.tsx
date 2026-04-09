import { Link } from '@inertiajs/react';

interface CategoryBadgeProps {
    name: string;
    slug: string;
    variant?: 'category' | 'tag';
}

export function CategoryBadge({ name, slug, variant = 'category' }: CategoryBadgeProps) {
    const href = variant === 'tag' ? `/blog?tag=${slug}` : `/categoria/${slug}`;

    return (
        <Link
            href={href}
            className={
                variant === 'tag'
                    ? 'inline-block rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary'
                    : 'inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20'
            }
        >
            {name}
        </Link>
    );
}
