import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AdminListCardProps {
    title: React.ReactNode;
    actions?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function AdminListCard({
    title,
    actions,
    children,
    className,
}: AdminListCardProps) {
    return (
        <div className={cn('mx-auto max-w-7xl p-6', className)}>
            <Card className="border-border/80 shadow-sm">
                <CardHeader className="flex flex-col gap-4 space-y-0 border-b border-border/60 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-xl">{title}</CardTitle>
                    {actions ? (
                        <div className="flex shrink-0 flex-wrap gap-2">
                            {actions}
                        </div>
                    ) : null}
                </CardHeader>
                <CardContent className="p-0 sm:p-6">{children}</CardContent>
            </Card>
        </div>
    );
}
