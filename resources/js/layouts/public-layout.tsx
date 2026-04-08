import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpenText, LayoutDashboard, LogIn, Menu } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dashboard, login } from '@/routes';
import admin from '@/routes/admin';
import * as blogRoutes from '@/routes/blog';

type PublicLayoutProps = {
    children: ReactNode;
    title?: string;
};

export default function PublicLayout({ children, title }: PublicLayoutProps) {
    const page = usePage();
    const auth = page.props.auth as { user?: { name: string } | null; is_admin?: boolean } | undefined;
    const appName = (page.props.name as string | undefined) ?? 'Hub de Conocimiento';
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Head title={title} />

            <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary-from)] to-[var(--primary-to)] text-sm font-bold text-primary-foreground shadow-sm">
                            HC
                        </span>
                        <span className="text-base font-semibold leading-tight">
                            {appName}
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        <Link
                            href="/"
                            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                            Inicio
                        </Link>
                        <Link
                            href={blogRoutes.index().url}
                            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                            Blog
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        {auth?.user ? (
                            <div className="hidden items-center gap-2 md:flex">
                                {auth.is_admin ? (
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={admin.dashboard().url}>
                                            <LayoutDashboard className="size-4" />
                                            Panel
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={dashboard().url}>
                                            <LayoutDashboard className="size-4" />
                                            Mi cuenta
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Button asChild size="sm" className="hidden md:inline-flex">
                                <Link href={login().url}>
                                    <LogIn className="size-4" />
                                    Entrar
                                </Link>
                            </Button>
                        )}

                        <DropdownMenu open={mobileOpen} onOpenChange={setMobileOpen}>
                            <DropdownMenuTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon" aria-label="Abrir menú">
                                    <Menu className="size-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem asChild>
                                    <Link href="/">Inicio</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={blogRoutes.index().url}>Blog</Link>
                                </DropdownMenuItem>
                                {auth?.user ? (
                                    <DropdownMenuItem asChild>
                                        <Link href={auth.is_admin ? admin.dashboard().url : dashboard().url}>
                                            {auth.is_admin ? 'Panel admin' : 'Mi cuenta'}
                                        </Link>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem asChild>
                                        <Link href={login().url}>Entrar</Link>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-border/60 bg-card/60">
                <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
                    <div className="flex items-center gap-2">
                        <BookOpenText className="size-4 text-primary" />
                        <span>{appName} · Hub de Conocimiento Organizacional</span>
                    </div>
                    <span>&copy; {new Date().getFullYear()}</span>
                </div>
            </footer>
        </div>
    );
}
