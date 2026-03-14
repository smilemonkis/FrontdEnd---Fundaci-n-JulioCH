// src/pages/Oportunidades.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Briefcase, Loader2, ExternalLink } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const TIPOS = [
  { value: '',             label: 'Todas' },
  { value: 'EMPLEO',       label: 'Empleo' },
  { value: 'FORMACION',    label: 'Formación' },
  { value: 'VOLUNTARIADO', label: 'Voluntariado' },
];

const TIPO_STYLES = {
  EMPLEO:       { label: 'Empleo',       color: 'bg-blue-500/10 text-blue-600' },
  FORMACION:    { label: 'Formación',    color: 'bg-purple-500/10 text-purple-600' },
  VOLUNTARIADO: { label: 'Voluntariado', color: 'bg-green-500/10 text-green-600' },
};

const ESTADO_STYLES = {
  ABIERTO:      { label: 'Abierta',       dot: 'bg-green-500',  text: 'text-green-700' },
  PROXIMAMENTE: { label: 'Próximamente',  dot: 'bg-yellow-500', text: 'text-yellow-700' },
  CERRADO:      { label: 'Cerrada',       dot: 'bg-red-500',    text: 'text-red-600' },
};

const formatFecha = (fecha) => {
  if (!fecha) return null;
  try {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  } catch { return fecha; }
};

const Oportunidades = () => {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/oportunidades?activo=true&page=${page}&size=9`;
        if (filtroTipo) url += `&tipo=${filtroTipo}`;
        const res = await api.get(url);
        let data = res.data.content || [];
        // Filtro de estado en frontend
        if (filtroEstado) data = data.filter(o => o.estado === filtroEstado);
        setItems(data);
        setTotalPages(res.data.totalPages || 1);
      } catch { setItems([]); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [page, filtroTipo, filtroEstado]);

  const handleFiltroTipo   = (t) => { setFiltroTipo(t);   setPage(0); };
  const handleFiltroEstado = (e) => { setFiltroEstado(e); setPage(0); };

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">Oportunidades de Empleo</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">Cartelera de empleo regional del Suroeste Antioqueño.</p>
        </div>

        {/* Filtro estado */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {[
            { value: '',        label: 'Todas' },
            { value: 'ABIERTO', label: 'Abiertas' },
            { value: 'CERRADO', label: 'Cerradas' },
            { value: 'PROXIMAMENTE', label: 'Próximamente' },
          ].map(e => (
            <button key={e.value} onClick={() => handleFiltroEstado(e.value)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                filtroEstado === e.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}>
              {e.label}
            </button>
          ))}
        </div>

        {/* Filtro tipo */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TIPOS.map(t => (
            <button key={t.value} onClick={() => handleFiltroTipo(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium border transition-colors ${
                filtroTipo === t.value ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:border-primary/50'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-body">No hay oportunidades disponibles.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(o => {
                const estado = ESTADO_STYLES[o.estado] || ESTADO_STYLES.ABIERTO;
                const tipo   = TIPO_STYLES[o.tipo]   || { label: o.tipo, color: 'bg-muted text-muted-foreground' };

                return (
                  <div key={o.id} className="bg-card rounded-xl overflow-hidden border border-border group flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    {/* Imagen */}
                    <div className="h-48 overflow-hidden bg-muted shrink-0">
                      {o.imagenUrl
                        ? <img src={o.imagenUrl} alt={o.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
                      }
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      {/* Badge estado + tipo */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${estado.text} bg-transparent`}>
                          <span className={`w-2 h-2 rounded-full ${estado.dot}`} />
                          {estado.label}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-body font-semibold ${tipo.color}`}>
                          {tipo.label}
                        </span>
                      </div>

                      {/* Título */}
                      <h3 className="font-heading text-lg font-bold text-foreground mb-1 line-clamp-2">{o.titulo}</h3>

                      {/* Descripción */}
                      <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{o.descripcion}</p>

                      {/* Fecha cierre */}
                      {o.fechaLimite && (
                        <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground mb-4">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          Cierre: {formatFecha(o.fechaLimite)}
                        </div>
                      )}

                      {/* Botones */}
                      <div className="flex gap-2 mt-auto">
                        <Link to={`/oportunidades/${o.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/5">
                            Ver detalles
                          </Button>
                        </Link>
                        {o.enlace && (
                          <a href={o.enlace} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="gap-1.5">
                              <ExternalLink className="w-3.5 h-3.5" /> Aplicar
                            </Button>
                          </a>
                        )}
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

export default Oportunidades;
