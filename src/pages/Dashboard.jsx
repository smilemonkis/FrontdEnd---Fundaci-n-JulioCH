import { useAuth } from '@/context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Users, FileText, Heart, Briefcase, BookmarkCheck, User, Building2, Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const Dashboard = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) {
    return (
      <main className="section-container section-padding flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'donante_aliado') return <Navigate to="/aliado" replace />;

  const profile = user.profile;
  const role = user.role;

  const getRoleBadge = () => {
    switch (role) {
      case 'empleado': return { label: 'Empleado', color: 'bg-secondary/10 text-secondary' };
      case 'ciudadano': return { label: 'Ciudadano', color: 'bg-primary/10 text-primary' };
      default: return { label: 'Usuario', color: 'bg-muted text-muted-foreground' };
    }
  };

  const badge = getRoleBadge();

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="font-body text-muted-foreground">
              Bienvenido, {profile?.nombre || 'Usuario'}{' '}
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ml-1 ${badge.color}`}>{badge.label}</span>
            </p>
          </div>
          <Button variant="ghost" onClick={logout} className="gap-2"><LogOut className="w-4 h-4" /> Salir</Button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">{profile?.nombre}</h2>
              <p className="font-body text-sm text-muted-foreground">{profile?.email}</p>
              {profile?.telefono && <p className="font-body text-xs text-muted-foreground">📞 {profile.telefono}</p>}
              {profile?.municipio && <p className="font-body text-xs text-muted-foreground">📍 {profile.municipio}</p>}
            </div>
          </div>
        </div>

        {role === 'empleado' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: FileText, title: 'Convocatorias' },
              { icon: Briefcase, title: 'Oportunidades' },
              { icon: BookmarkCheck, title: 'Actividades' },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center"><item.icon className="w-5 h-5 text-secondary" /></div>
                  <h3 className="font-heading font-semibold text-foreground">{item.title}</h3>
                </div>
                <p className="text-xs font-body text-muted-foreground">Crear, editar y eliminar contenido</p>
              </div>
            ))}
          </div>
        )}

        {role === 'ciudadano' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-3"><Briefcase className="w-5 h-5 text-secondary" /><h3 className="font-heading font-semibold">Empleos guardados</h3></div>
              <p className="font-body text-sm text-muted-foreground">Aún no has guardado oportunidades de empleo.</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-3"><BookmarkCheck className="w-5 h-5 text-accent" /><h3 className="font-heading font-semibold">Eventos guardados</h3></div>
              <p className="font-body text-sm text-muted-foreground">Aún no has guardado actividades o convocatorias.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;