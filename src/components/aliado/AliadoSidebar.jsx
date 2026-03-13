// src/components/aliado/AliadoSidebar.jsx
import { useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Heart, FolderKanban, Home, PlusCircle } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import logoFundacion from '@/assets/logo-fundacion.png';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard',      url: '/aliado',            icon: LayoutDashboard, end: true },
  { title: 'Proyectos',      url: '/aliado/proyectos',  icon: FolderKanban },
  { title: 'Mis Donaciones', url: '/aliado/donaciones', icon: Heart },
  { title: 'Mi Perfil',      url: '/aliado/perfil',     icon: User },
];

const AliadoSidebar = () => {
  const location  = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const isActive  = (url, end) =>
    end ? location.pathname === url : location.pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Logo solo imagen */}
      <SidebarHeader className="!flex-row !items-center h-16 pl-3 pr-3 border-b border-sidebar-border">
        <a href="/" className="flex items-center">
          <img src={logoFundacion} alt="Fundación" className="h-12 w-auto shrink-0" />
        </a>
      </SidebarHeader>

      <SidebarContent>
        {/* Botón Donar resaltado */}
        <div className="px-3 pt-4 pb-2">
          <NavLink
            to="/aliado/donar"
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-body font-semibold text-sm hover:bg-primary/90 transition-colors justify-center"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Donar ahora</span>}
          </NavLink>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50">
            Mi Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.end)} tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.end}
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
            {!collapsed && <span>Volver al sitio</span>}
          </a>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AliadoSidebar;
