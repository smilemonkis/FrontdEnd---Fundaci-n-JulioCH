// src/pages/aliado/AliadoPerfil.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { User, Building2, CreditCard, MapPin, Phone, Mail } from 'lucide-react';

const AliadoPerfil = () => {
  const { user } = useAuth();
  const [detalle, setDetalle]     = useState(null);
  const [tipoAliado, setTipoAliado] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchDetalle = async () => {
      setLoading(true);
      try {
        // Intentamos primero aliado natural, luego jurídico
        // Usamos el endpoint de búsqueda por documento si es natural,
        // o simplemente traemos todos y filtramos por usuarioId
        const rol = user.rol?.toUpperCase();

        if (rol === 'ALIADO_NATURAL') {
          // Buscamos en la lista y filtramos por usuarioId
          const res = await api.get('/aliados-naturales?page=0&size=100');
          const found = (res.data.content || []).find(a => a.usuarioId === user.id);
          setDetalle(found || null);
          setTipoAliado('natural');
        } else if (rol === 'ALIADO_JURIDICO') {
          const res = await api.get('/aliados-juridicos?page=0&size=100');
          const found = (res.data.content || []).find(a => a.usuarioId === user.id);
          setDetalle(found || null);
          setTipoAliado('juridico');
        }
      } catch (error) {
        console.error('Error cargando perfil aliado:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [user]);

  if (loading) return (
    <div className="text-center py-12 text-muted-foreground font-body">Cargando perfil...</div>
  );

  const p = user?.profile;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Mi Perfil</h1>
        <p className="font-body text-muted-foreground">Información de tu cuenta</p>
      </div>

      {/* Datos generales */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {p?.nombreDisplay || p?.nombre || user.email}
            </h2>
            <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-cta/10 text-cta">
              {tipoAliado === 'juridico' ? 'Aliado Jurídico' : 'Aliado Natural'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="font-body text-sm text-foreground">{p?.email || user.email}</span>
          </div>
          {detalle?.telefono && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="font-body text-sm text-foreground">{detalle.telefono}</span>
            </div>
          )}
          {detalle?.direccion && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-body text-sm text-foreground">{detalle.direccion}</span>
            </div>
          )}
        </div>
      </div>

      {/* Datos específicos: Aliado Natural */}
      {tipoAliado === 'natural' && detalle && (
        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-secondary" />
            <h3 className="font-heading font-semibold text-foreground">Datos de identificación</h3>
          </div>
          {/* AliadoNaturalResponse: { id, usuarioId, documento, tipoDocumento, nombre, email, telefono } */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-body text-muted-foreground">Tipo documento</p>
              <p className="font-body text-sm font-medium text-foreground">{detalle.tipoDocumento || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-body text-muted-foreground">Número documento</p>
              <p className="font-body text-sm font-medium text-foreground">{detalle.documento || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-body text-muted-foreground">Nombre registrado</p>
              <p className="font-body text-sm font-medium text-foreground">{detalle.nombre || '—'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Datos específicos: Aliado Jurídico */}
      {tipoAliado === 'juridico' && detalle && (
        <div className="bg-card rounded-xl border border-border p-6 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-secondary" />
            <h3 className="font-heading font-semibold text-foreground">Datos empresariales</h3>
          </div>
          {/* AliadoJuridicoResponse: { id, usuarioId, nit, razonSocial, representante, email, telefono, direccion } */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-body text-muted-foreground">NIT</p>
              <p className="font-body text-sm font-medium text-foreground">{detalle.nit || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-body text-muted-foreground">Razón social</p>
              <p className="font-body text-sm font-medium text-foreground">{detalle.razonSocial || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-body text-muted-foreground">Representante</p>
              <p className="font-body text-sm font-medium text-foreground">{detalle.representante || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-body text-muted-foreground">Email</p>
              <p className="font-body text-sm font-medium text-foreground">{detalle.email || '—'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AliadoPerfil;