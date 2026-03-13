// src/pages/aliado/AliadoProyectoDetalle.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, TrendingUp, Calendar, FolderKanban, Heart, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AliadoProyectoDetalle = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        // Intenta primero por ID, si no existe el endpoint usa la lista y filtra
        const res  = await api.get('/proyectos/activos');
        const data = res.data;
        const list = Array.isArray(data) ? data : data.content || [];
        const found = list.find(p => String(p.id) === String(id));
        setProyecto(found || null);
      } catch {
        setProyecto(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!proyecto) return (
    <div className="text-center py-24 space-y-4">
      <FolderKanban className="w-12 h-12 text-muted-foreground/20 mx-auto" />
      <p className="font-body text-muted-foreground">Proyecto no encontrado.</p>
      <Button variant="outline" onClick={() => navigate('/aliado/proyectos')}>
        Volver a proyectos
      </Button>
    </div>
  );

  const formatFecha = (f) => {
    try { return format(new Date(f), "d 'de' MMMM 'de' yyyy", { locale: es }); }
    catch { return f; }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">

      {/* Volver */}
      <button onClick={() => navigate('/aliado/proyectos')}
        className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a proyectos
      </button>

      {/* Imagen */}
      <div className="rounded-2xl overflow-hidden bg-muted h-56 md:h-72">
        {proyecto.imagenUrl ? (
          <img src={proyecto.imagenUrl} alt={proyecto.nombre}
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <FolderKanban className="w-16 h-16 text-primary/20" />
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          {proyecto.codigo && (
            <span className="text-xs font-body text-muted-foreground bg-muted px-2 py-0.5 rounded mr-2">
              {proyecto.codigo}
            </span>
          )}
          <span className="inline-block px-2 py-0.5 text-xs font-body font-medium rounded-full bg-primary/10 text-primary">
            Activo
          </span>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-3">
            {proyecto.nombre}
          </h1>
        </div>
        <Button onClick={() => navigate('/aliado/donar')} className="gap-2 shrink-0 shadow-md shadow-primary/20">
          <Heart className="w-4 h-4" /> Donar a este proyecto
        </Button>
      </div>

      {/* Descripción */}
      {proyecto.descripcion && (
        <p className="font-body text-muted-foreground leading-relaxed">{proyecto.descripcion}</p>
      )}

      {/* Métricas */}
      {(proyecto.beneficiarios || proyecto.progreso !== undefined || proyecto.fechaInicio) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {proyecto.beneficiarios && (
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-heading text-xl font-bold text-foreground">
                  {Number(proyecto.beneficiarios).toLocaleString()}
                </p>
                <p className="text-xs font-body text-muted-foreground">Beneficiarios</p>
              </div>
            </div>
          )}

          {proyecto.progreso !== undefined && proyecto.progreso !== null && (
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-heading text-xl font-bold text-foreground">{proyecto.progreso}%</p>
                <p className="text-xs font-body text-muted-foreground">Avance</p>
              </div>
            </div>
          )}

          {proyecto.fechaInicio && (
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">
                  {formatFecha(proyecto.fechaInicio)}
                </p>
                <p className="text-xs font-body text-muted-foreground">Fecha de inicio</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Barra de progreso */}
      {proyecto.progreso !== undefined && proyecto.progreso !== null && (
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-body font-medium text-foreground">Progreso del proyecto</span>
            <span className="text-sm font-heading font-bold text-primary">{proyecto.progreso}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div className="gradient-primary h-3 rounded-full transition-all duration-700"
              style={{ width: `${proyecto.progreso}%` }} />
          </div>
          {proyecto.fechaFin && (
            <p className="text-xs font-body text-muted-foreground mt-2">
              Finaliza el {formatFecha(proyecto.fechaFin)}
            </p>
          )}
        </div>
      )}

      {/* CTA final */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-semibold text-foreground">¿Quieres apoyar este proyecto?</h3>
          <p className="font-body text-sm text-muted-foreground">Tu aporte transforma vidas en el Suroeste Antioqueño.</p>
        </div>
        <Button onClick={() => navigate('/aliado/donar')} size="lg" className="gap-2 shrink-0">
          <Heart className="w-4 h-4" /> Donar ahora
        </Button>
      </div>
    </div>
  );
};

export default AliadoProyectoDetalle;
