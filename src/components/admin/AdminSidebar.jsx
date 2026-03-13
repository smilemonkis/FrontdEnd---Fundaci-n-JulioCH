import { useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Megaphone, Users, Heart, Home, User } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import logoFundacion from '@/assets/logo-fundacion.png';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar } from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard',     url: '/admin',              icon: LayoutDashboard },
  { title: 'Proyectos',     url: '/admin/proyectos',    icon: FolderKanban },
  { title: 'Convocatorias', url: '/admin/convocatorias',icon: Megaphone },
  { title: 'Aliados',       url: '/admin/aliados',      icon: Users },
  { title: 'Donaciones',    url: '/admin/donaciones',   icon: Heart },
  { title: 'Mi Perfil',     url: '/admin/perfil',       icon: User },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isActive = (url) => url === '/admin'
    ? location.pathname === '/admin'
    : location.pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Logo solo imagen, sin texto */}
      <SidebarHeader className="!flex-row !items-center h-16 pl-3 pr-3 border-b border-sidebar-border">
        <a href="/" className="flex items-center">
          <img src={logoFundacion} alt="Fundación" className="h-12 w-auto shrink-0" />
        </a>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50">
            Módulos
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <SidebarMenuButton asChild tooltip="Volver al sitio">
          <a href="/" className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <Home className="h-4 w-4" />
            <span>Volver al sitio</span>
          </a>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
