// src/pages/aliado/AliadoProyectos.jsx
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { FolderKanban, Calendar, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AliadoProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Usamos el endpoint de proyectos activos
        // ProyectoResponse: { id, codigo, nombre, descripcion, fechaInicio, fechaFin, activo, createdAt, updatedAt }
        const res = await api.get('/proyectos/activos');
        setProyectos(res.data || []);
      } catch (error) {
        console.error('Error cargando proyectos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Proyectos</h1>
        <p className="font-body text-muted-foreground">Proyectos activos de la fundación</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground font-body">Cargando...</div>
      ) : proyectos.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <FolderKanban className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-body text-muted-foreground">No hay proyectos activos en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map(p => (
            <div key={p.id} className="bg-card rounded-xl border border-border overflow-hidden group hover:shadow-lg transition-shadow">
              {/* Placeholder imagen — pendiente endpoint de imágenes */}
              <div className="aspect-video bg-muted flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-body text-muted-foreground bg-muted px-2 py-0.5 rounded">{p.codigo}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-primary/90 text-primary-foreground ml-auto">Activo</span>
                </div>
                <h3 className="font-heading font-semibold text-foreground line-clamp-2">{p.nombre}</h3>
                {p.descripcion && (
                  <p className="font-body text-sm text-muted-foreground line-clamp-3">{p.descripcion}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-body pt-1">
                  <Calendar className="w-3 h-3" />
                  {p.fechaInicio && (
                    <span>Desde {format(new Date(p.fechaInicio), "MMM yyyy", { locale: es })}</span>
                  )}
                  {p.fechaFin && (
                    <span> — {format(new Date(p.fechaFin), "MMM yyyy", { locale: es })}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AliadoProyectos;