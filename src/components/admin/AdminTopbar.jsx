import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AdminTopbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate('/', { replace: true }); };
  const nombre = user?.profile?.nombre || 'Usuario';
  const initials = nombre.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <header className="sticky top-0 z-40 h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden sm:block">
          <h2 className="font-heading text-sm font-semibold text-foreground">Panel Administrativo</h2>
          <p className="text-xs font-body text-muted-foreground">Fundación Julio C.H.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary font-body text-sm font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-right">
          <p className="text-sm font-body font-medium text-foreground leading-tight">{nombre}</p>
          <p className="text-xs font-body text-muted-foreground">Administrador</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar sesión" className="text-muted-foreground hover:text-destructive"><LogOut className="w-4 h-4" /></Button>
      </div>
    </header>
  );
};
export default AdminTopbar;
