import { useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Megaphone, Users, Heart, Home, User, Newspaper, MapPin, Briefcase, Mail, Image } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import logoFundacion from '@/assets/logo-fundacion.png';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar } from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard',      url: '/admin',               icon: LayoutDashboard },
  { title: 'Proyectos',      url: '/admin/proyectos',     icon: FolderKanban },
  { title: 'Convocatorias',  url: '/admin/convocatorias', icon: Megaphone },
  { title: 'Aliados',        url: '/admin/aliados',       icon: Users },
  { title: 'Donaciones',     url: '/admin/donaciones',    icon: Heart },
];

const menuItemsContenido = [
  { title: 'Banner',         url: '/admin/banner',        icon: Image },
  { title: 'Noticias',       url: '/admin/noticias',      icon: Newspaper },
  { title: 'Párchate',       url: '/admin/parchate',      icon: MapPin },
  { title: 'Oportunidades',  url: '/admin/oportunidades', icon: Briefcase },
  { title: 'Suscripciones',  url: '/admin/suscripciones', icon: Mail },
];

const menuItemsPerfil = [
  { title: 'Mi Perfil',      url: '/admin/perfil',        icon: User },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isActive = (url) => url === '/admin'
    ? location.pathname === '/admin'
    : location.pathname.startsWith(url);

  const renderItems = (items) => items.map((item) => (
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
  ));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="!flex-row !items-center h-16 pl-3 pr-3 border-b border-sidebar-border">
        <a href="/" className="flex items-center">
          <img src={logoFundacion} alt="Fundación" className="h-12 w-auto shrink-0" />
        </a>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50">Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(menuItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50">Contenido</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(menuItemsContenido)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50">Cuenta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(menuItemsPerfil)}</SidebarMenu>
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
