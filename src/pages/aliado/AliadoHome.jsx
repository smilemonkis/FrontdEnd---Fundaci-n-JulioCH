// src/pages/aliado/AliadoHome.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, FolderKanban, DollarSign, Clock, Users, TrendingUp, ArrowRight, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';

const AliadoHome = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [stats,          setStats]          = useState(null);
  const [proyectos,      setProyectos]      = useState([]);
  const [loadingStats,   setLoadingStats]   = useState(true);
  const [loadingProyec,  setLoadingProyec]  = useState(true);

  // Cargar stats de donaciones del aliado
  useEffect(() => {
    if (!user?.id) return;
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res  = await api.get(`/donaciones/usuario/${user.id}?page=0&size=200`);
        const list = res.data.content || [];
        const monto       = list.reduce((s, d) => s + Number(d.monto), 0);
        const completadas = list.filter(d => d.estado === 'COMPLETADA').length;
        const pendientes  = list.filter(d => d.estado === 'PENDIENTE').length;
        const proyIds     = new Set(list.filter(d => d.proyectoId).map(d => d.proyectoId));
        setStats({ total: list.length, monto, completadas, pendientes, proyectosApoyados: proyIds.size });
      } catch { /* silencioso */ }
      finally { setLoadingStats(false); }
    };
    fetchStats();
  }, [user]);

  // Cargar proyectos activos (máx 3 para el dashboard)
  useEffect(() => {
    const fetchProyectos = async () => {
      setLoadingProyec(true);
      try {
        const res  = await api.get('/proyectos/activos');
        const data = res.data;
        const list = Array.isArray(data) ? data : data.content || [];
        setProyectos(list.slice(0, 3));
      } catch { /* silencioso */ }
      finally { setLoadingProyec(false); }
    };
    fetchProyectos();
  }, []);

  const nombre = user?.profile?.nombreDisplay || user?.profile?.nombre || user?.email?.split('@')[0] || 'Aliado';

  const kpis = stats ? [
    { label: 'Total donado',        value: `$${stats.monto.toLocaleString('es-CO')}`, icon: DollarSign, color: 'text-primary',   bg: 'bg-primary/10' },
    { label: 'Donaciones',          value: stats.total,                                icon: Heart,       color: 'text-rose-500',  bg: 'bg-rose-50' },
    { label: 'Proyectos apoyados',  value: stats.proyectosApoyados,                   icon: FolderKanban,color: 'text-emerald-600',bg: 'bg-emerald-50' },
    { label: 'Pendientes',          value: stats.pendientes,                           icon: Clock,       color: 'text-amber-600', bg: 'bg-amber-50' },
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Bienvenido, {nombre} 👋
          </h1>
          <p className="font-body text-muted-foreground text-sm">
            Resumen de tu actividad como aliado de la Fundación Julio C. Hernández
          </p>
        </div>
        {/* Botón donar resaltado en el header */}
        <Button
          onClick={() => navigate('/aliado/donar')}
          size="lg"
          className="gap-2 shadow-lg shadow-primary/20 shrink-0"
        >
          <PlusCircle className="w-5 h-5" /> Donar ahora
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingStats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 animate-pulse h-24" />
          ))
        ) : kpis.map((c) => (
          <div key={c.label} className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
                <c.icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <p className="text-xs font-body font-medium text-muted-foreground">{c.label}</p>
            </div>
            <p className="font-heading text-2xl font-bold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Proyectos activos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">Proyectos activos</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/aliado/proyectos')} className="gap-1 text-sm">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {loadingProyec ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border animate-pulse h-52" />
            ))}
          </div>
        ) : proyectos.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <FolderKanban className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
            <p className="font-body text-muted-foreground text-sm">No hay proyectos activos en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {proyectos.map(p => (
              <article key={p.id} className="bg-card rounded-xl border border-border overflow-hidden group hover:shadow-md transition-shadow">
                {/* Imagen */}
                <div className="h-36 overflow-hidden bg-muted">
                  {p.imagenUrl ? (
                    <img src={p.imagenUrl} alt={p.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <FolderKanban className="w-10 h-10 text-primary/20" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <span className="inline-block px-2 py-0.5 text-xs font-body font-medium rounded-full bg-primary/10 text-primary mb-2">
                    Activo
                  </span>
                  <h3 className="font-heading font-semibold text-foreground text-sm mb-1 line-clamp-1">{p.nombre}</h3>
                  {p.descripcion && (
                    <p className="font-body text-xs text-muted-foreground line-clamp-2 mb-3">{p.descripcion}</p>
                  )}

                  {/* Métricas */}
                  {(p.beneficiarios || p.progreso !== undefined) && (
                    <div className="flex items-center gap-3 text-xs font-body text-muted-foreground mb-2">
                      {p.beneficiarios && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {Number(p.beneficiarios).toLocaleString()}
                        </span>
                      )}
                      {p.progreso !== undefined && p.progreso !== null && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> {p.progreso}%
                        </span>
                      )}
                    </div>
                  )}

                  {/* Barra de progreso */}
                  {p.progreso !== undefined && p.progreso !== null && (
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="gradient-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${p.progreso}%` }} />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Acciones rápidas */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => navigate('/aliado/donar')}
            className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6 hover:border-primary hover:bg-primary/10 hover:shadow-md transition-all text-left group">
            <PlusCircle className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-heading text-base font-semibold text-foreground mb-1">Hacer una donación</h3>
            <p className="font-body text-sm text-muted-foreground">Apoya un proyecto o dona libremente</p>
          </button>

          <button onClick={() => navigate('/aliado/donaciones')}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all text-left group">
            <Heart className="w-8 h-8 text-rose-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-heading text-base font-semibold text-foreground mb-1">Ver mis donaciones</h3>
            <p className="font-body text-sm text-muted-foreground">Consulta el historial e imprime comprobantes</p>
          </button>
        </div>
      </div>

    </div>
  );
};

export default AliadoHome;
