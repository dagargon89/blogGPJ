import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AdminFormCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    /** Contenedor exterior, p. ej. max-w-xl o max-w-3xl */
    className?: string;
}

export function AdminFormCard({
    title,
    description,
    children,
    className,
}: AdminFormCardProps) {
    return (
        <div className={cn('mx-auto p-6', className ?? 'max-w-xl')}>
            <Card className="border-border/80 shadow-sm">
                <CardHeader className="border-b border-border/60 pb-4">
                    <CardTitle className="text-xl">{title}</CardTitle>
                    {description ? (
                        <CardDescription>{description}</CardDescription>
                    ) : null}
                </CardHeader>
                <CardContent className="pt-6">{children}</CardContent>
            </Card>
        </div>
    );
}
