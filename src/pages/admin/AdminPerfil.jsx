// src/pages/admin/AdminPerfil.jsx
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Home, Shield } from 'lucide-react';

// No necesita llamada al backend:
// todos los datos del admin vienen del AuthContext (LoginResponse)
const AdminPerfil = () => {
  const { user } = useAuth();

  if (!user) return (
    <div className="text-center py-12 text-muted-foreground font-body">Cargando perfil...</div>
  );

  const p = user.profile;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Mi Perfil</h1>
        <p className="font-body text-muted-foreground">Información de tu cuenta de administrador</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {p?.nombreDisplay || p?.nombre || user.email}
            </h2>
            <span className="px-2.5 py-0.5 text-xs rounded-full font-medium bg-primary/10 text-primary inline-flex items-center gap-1">
              <Shield className="w-3 h-3" /> Administrador
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-body text-muted-foreground mb-0.5">Nombre</p>
              <p className="font-body text-sm font-medium text-foreground">{p?.nombre || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-body text-muted-foreground mb-0.5">Correo electrónico</p>
              <p className="font-body text-sm font-medium text-foreground">{p?.email || user.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-body text-muted-foreground mb-0.5">Teléfono</p>
              <p className="font-body text-sm font-medium text-foreground">{p?.telefono || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-body text-muted-foreground mb-0.5">Municipio</p>
              <p className="font-body text-sm font-medium text-foreground">{p?.municipio || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:col-span-2">
            <Home className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-body text-muted-foreground mb-0.5">Dirección</p>
              <p className="font-body text-sm font-medium text-foreground">{p?.direccion || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-heading font-semibold text-foreground mb-4">Estado de la cuenta</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-body text-muted-foreground mb-0.5">Estado</p>
            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${user.activo !== false ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
              {user.activo !== false ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div>
            <p className="text-xs font-body text-muted-foreground mb-0.5">Rol</p>
            <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-primary/10 text-primary">
              {user.rol || 'ADMIN'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPerfil;