// src/pages/Parchate.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const Parchate = () => {
  const [items, setItems]         = useState([]);
  const [tipos, setTipos]         = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filtroTipo, setFiltroTipo]     = useState('');
  const [filtroUbicacion, setFiltroUbicacion] = useState('');
  const [page, setPage]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchFiltros = async () => {
      try {
        const [resTipos, resUbicaciones] = await Promise.all([
          api.get('/parchate/tipos'),
          api.get('/parchate/ubicaciones'),
        ]);
        setTipos(resTipos.data || []);
        setUbicaciones(resUbicaciones.data || []);
      } catch {}
    };
    fetchFiltros();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/parchate?activo=true&page=${page}&size=9`;
        if (filtroTipo)      url += `&tipo=${encodeURIComponent(filtroTipo)}`;
        if (filtroUbicacion) url += `&ubicacion=${encodeURIComponent(filtroUbicacion)}`;
        const res = await api.get(url);
        setItems(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, filtroTipo, filtroUbicacion]);

  const handleFiltroTipo = (t) => { setFiltroTipo(t); setPage(0); };
  const handleFiltroUbicacion = (u) => { setFiltroUbicacion(u); setPage(0); };

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">Párchate</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">Actividades, eventos y espacios para conectar con tu comunidad.</p>
        </div>

        {/* Filtros por tipo */}
        {tipos.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <button
              onClick={() => handleFiltroTipo('')}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                filtroTipo === '' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Todos
            </button>
            {tipos.map(t => (
              <button
                key={t}
                onClick={() => handleFiltroTipo(t)}
                className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                  filtroTipo === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Filtros por ubicación */}
        {ubicaciones.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => handleFiltroUbicacion('')}
              className={`px-3 py-1 rounded-full text-xs font-body font-medium border transition-colors ${
                filtroUbicacion === '' ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              Todas las zonas
            </button>
            {ubicaciones.map(u => (
              <button
                key={u}
                onClick={() => handleFiltroUbicacion(u)}
                className={`px-3 py-1 rounded-full text-xs font-body font-medium border transition-colors ${
                  filtroUbicacion === u ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-body">No hay actividades disponibles.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(p => (
                <div key={p.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group">
                  <div className="h-44 overflow-hidden bg-muted">
                    {p.imagenUrl
                      ? <img src={p.imagenUrl} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
                    }
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 text-xs font-body font-semibold rounded-full bg-primary/10 text-primary">{p.tipo}</span>
                      <span className="flex items-center gap-1 text-xs font-body text-muted-foreground">
                        <MapPin className="w-3 h-3" />{p.ubicacion}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1 line-clamp-2">{p.titulo}</h3>
                    <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">{p.descripcion}</p>
                    {p.fechaEvento && (
                      <div className="flex items-center gap-1 text-xs font-body text-muted-foreground mb-4">
                        <Calendar className="w-3 h-3" />
                        {new Date(p.fechaEvento).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    <Link to={`/parchate/${p.id}`}>
                      <Button variant="outline-primary" size="sm" className="w-full">Ver actividad</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</Button>
                <span className="flex items-center text-sm font-body text-muted-foreground px-3">{page + 1} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Siguiente</Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Parchate;
