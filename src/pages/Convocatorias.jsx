// src/pages/Convocatorias.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const ESTADO_STYLES = {
  ABIERTO:      { label: 'Abierta',      dot: 'bg-green-500',  text: 'text-green-700' },
  PROXIMAMENTE: { label: 'Próximamente', dot: 'bg-yellow-500', text: 'text-yellow-700' },
  CERRADO:      { label: 'Cerrada',      dot: 'bg-red-500',    text: 'text-red-600' },
};

const formatFecha = (fecha) => {
  if (!fecha) return null;
  try {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  } catch { return fecha; }
};

const Convocatorias = () => {
  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [page, setPage]                 = useState(0);
  const [totalPages, setTotalPages]     = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/convocatorias?activa=true&page=${page}&size=9`);
        let data = res.data.content || [];
        if (filtroEstado) data = data.filter(c => c.estado === filtroEstado);
        setItems(data);
        setTotalPages(res.data.totalPages || 1);
      } catch { setItems([]); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [page, filtroEstado]);

  const handleFiltro = (e) => { setFiltroEstado(e); setPage(0); };

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">Convocatorias</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">Encuentra oportunidades de formación y desarrollo en el Suroeste Antioqueño.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { value: '',             label: 'Todas' },
            { value: 'ABIERTO',      label: 'Abiertas' },
            { value: 'CERRADO',      label: 'Cerradas' },
            { value: 'PROXIMAMENTE', label: 'Próximamente' },
          ].map(e => (
            <button key={e.value} onClick={() => handleFiltro(e.value)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                filtroEstado === e.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}>
              {e.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-body">No hay convocatorias disponibles.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(c => {
                const estado = ESTADO_STYLES[c.estado] || ESTADO_STYLES.ABIERTO;
                return (
                  <div key={c.id} className="bg-card rounded-xl overflow-hidden border border-border group flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden bg-muted shrink-0">
                      {c.imagenUrl
                        ? <img src={c.imagenUrl} alt={c.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
                      }
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      {/* Badge estado */}
                      <div className="mb-3 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${estado.text} bg-transparent`}>
                          <span className={`w-2 h-2 rounded-full ${estado.dot}`} />
                          {estado.label}
                        </span>
                      </div>

                      {/* Título — siempre 2 líneas */}
                      <h3 className="font-heading text-lg font-bold text-foreground mb-1 line-clamp-2 shrink-0" style={{minHeight:'3.5rem'}}>{c.titulo}</h3>

                      {/* Descripción — siempre 2 líneas */}
                      <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2 shrink-0" style={{minHeight:'2.5rem'}}>{c.descripcion}</p>

                      {/* Fecha — espacio fijo */}
                      <div className="h-5 mb-4 shrink-0">
                        {(c.fechaInicio || c.fechaFin) && (
                          <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            {c.fechaFin ? `Cierre: ${formatFecha(c.fechaFin)}` : `Inicio: ${formatFecha(c.fechaInicio)}`}
                          </div>
                        )}
                      </div>

                      {/* Botón siempre al fondo */}
                      <div className="mt-auto shrink-0">
                        <Link to={`/convocatorias/${c.id}`}>
                          <Button variant="outline-primary" size="sm" className="w-full">Quiero saber más</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
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

export default Convocatorias;
