import { useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Heart, FolderKanban, Home, PlusCircle } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import logoFundacion from '@/assets/logo-fundacion.png';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar } from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Donar', url: '/aliado/donar', icon: PlusCircle },
  { title: 'Proyectos', url: '/aliado/proyectos', icon: FolderKanban },
  { title: 'Mis Donaciones', url: '/aliado/donaciones', icon: Heart },
  { title: 'Mi Perfil', url: '/aliado/perfil', icon: User },
];

const AliadoSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const isActive = (url) => url === '/aliado' ? location.pathname === '/aliado' : location.pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="!flex-row !items-center !gap-0 h-16 pl-2 pr-3 border-b border-sidebar-border">
        <a href="/" className="flex items-center gap-2">
          <img src={logoFundacion} alt="Fundación" className="h-12 w-auto shrink-0" />
          {!collapsed && <span className="font-body text-sm font-bold text-sidebar-foreground leading-tight tracking-tight">Fundación<br />Julio C.H.</span>}
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50">Mi Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end={item.url === '/aliado'} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="h-4 w-4" /><span>{item.title}</span>
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
          <a href="/" className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground"><Home className="h-4 w-4" /><span>Volver al sitio</span></a>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};
export default AliadoSidebar;
