// src/pages/aliado/AliadoProyectos.jsx
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { FolderKanban, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AliadoProyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/proyectos/activos');
        const data = res.data;
        // Soporta Page<T> y array directo
        setProyectos(Array.isArray(data) ? data : data.content || []);
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
        <p className="font-body text-muted-foreground">Proyectos activos de la fundaciÃ³n</p>
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
            <article key={p.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group">

              {/* Imagen */}
              <div className="h-48 overflow-hidden bg-muted">
                {p.imagenUrl ? (
                  <img
                    src={p.imagenUrl}
                    alt={p.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <FolderKanban className="w-12 h-12 text-primary/20" />
                  </div>
                )}
              </div>

              <div className="p-5">
                {/* CÃ³digo + badge */}
                <div className="flex items-center gap-2 mb-2">
                  {p.codigo && (
                    <span className="text-xs font-body text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {p.codigo}
                    </span>
                  )}
                  <span className="inline-block px-2 py-0.5 text-xs font-body font-medium rounded-full bg-primary/10 text-primary ml-auto">
                    Activo
                  </span>
                </div>

                {/* TÃ­tulo */}
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {p.nombre}
                </h3>

                {/* DescripciÃ³n */}
                {p.descripcion && (
                  <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-3">
                    {p.descripcion}
                  </p>
                )}

                {/* MÃ©tricas */}
                {(p.beneficiarios || p.progreso !== undefined) && (
                  <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-muted/60">
                    {p.beneficiarios && (
                      <div className="flex items-center gap-1.5 text-sm font-body">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-foreground">
                          {Number(p.beneficiarios).toLocaleString()}
                        </span>
                        <span className="text-muted-foreground text-xs">beneficiarios</span>
                      </div>
                    )}
                    {p.progreso !== undefined && p.progreso !== null && (
                      <div className="flex items-center gap-1.5 text-sm font-body">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        <span className="font-semibold text-foreground">{p.progreso}%</span>
                        <span className="text-muted-foreground text-xs">avance</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Barra de progreso */}
                {p.progreso !== undefined && p.progreso !== null && (
                  <div className="w-full bg-muted rounded-full h-2 mb-4">
                    <div
                      className="gradient-primary h-2 rounded-full transition-all"
                      style={{ width: `${p.progreso}%` }}
                    />
                  </div>
                )}

                <Button variant="outline-primary" size="sm">Ver proyecto</Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AliadoProyectos;