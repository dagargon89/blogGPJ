import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthCardLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/60 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="flex h-9 w-9 items-center justify-center">
                        <AppLogoIcon className="size-9 fill-current text-foreground" />
                    </div>
                </Link>

                <Card className="rounded-xl border-border/80 shadow-md">
                    <CardHeader className="space-y-2 px-6 pt-8 pb-0 text-center sm:px-8">
                        <CardTitle className="text-xl">{title}</CardTitle>
                        {description ? (
                            <CardDescription>{description}</CardDescription>
                        ) : null}
                    </CardHeader>
                    <CardContent className="px-6 py-8 sm:px-8">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
