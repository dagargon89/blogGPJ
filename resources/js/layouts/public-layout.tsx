import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types/auth';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { appearance, updateAppearance } = useAppearance();
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAuthenticated = !!auth?.user;

    const toggleTheme = () => {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                        <BookOpen className="h-5 w-5" />
                        <span className="hidden sm:inline">Hub de Conocimiento</span>
                    </Link>

                    {/* Nav links */}
                    <nav className="flex items-center gap-1 sm:gap-2">
                        <Link
                            href="/"
                            className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/blog"
                            className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            Blog
                        </Link>

                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleTheme}
                            className="ml-1 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            aria-label="Cambiar tema"
                        >
                            {appearance === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>

                        {isAuthenticated ? (
                            /* Admin panel button — only for logged-in users */
                            <Button asChild size="sm" className="ml-1">
                                <Link href="/admin/posts">
                                    <LayoutDashboard className="mr-1.5 h-4 w-4" />
                                    Panel Admin
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild size="sm" variant="outline" className="ml-1">
                                <Link href="/login">Entrar</Link>
                            </Button>
                        )}
                    </nav>
                </div>
            </header>

            {/* Main content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t border-border bg-muted/30 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Hub de Conocimiento Organizacional. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
}
