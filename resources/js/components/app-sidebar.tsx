import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FileText,
    FolderKanban,
    LayoutGrid,
    Newspaper,
    Tags,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import admin from '@/routes/admin';
import * as blogRoutes from '@/routes/blog';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const auth = page.props.auth as { is_admin?: boolean } | undefined;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Blog',
            href: blogRoutes.index(),
            icon: BookOpen,
        },
    ];

    const adminNavItems: NavItem[] = auth?.is_admin
        ? [
              {
                  title: 'Panel admin',
                  href: admin.dashboard(),
                  icon: LayoutGrid,
              },
              {
                  title: 'Publicaciones',
                  href: admin.posts.index(),
                  icon: Newspaper,
              },
              {
                  title: 'Categorías',
                  href: admin.categories.index(),
                  icon: FolderKanban,
              },
              {
                  title: 'Etiquetas',
                  href: admin.tags.index(),
                  icon: Tags,
              },
          ]
        : [];

    const footerNavItems: NavItem[] = [
        {
            title: 'Documentación',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: FileText,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="Plataforma" />
                {adminNavItems.length > 0 && (
                    <NavMain items={adminNavItems} label="Administración" />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
