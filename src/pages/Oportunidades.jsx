// src/pages/Oportunidades.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const TIPOS = [
  { value: '',             label: 'Todas' },
  { value: 'EMPLEO',       label: 'Empleo' },
  { value: 'FORMACION',    label: 'Formación' },
  { value: 'VOLUNTARIADO', label: 'Voluntariado' },
];

const TIPO_STYLES = {
  EMPLEO:       'bg-blue-500/10 text-blue-600',
  FORMACION:    'bg-purple-500/10 text-purple-600',
  VOLUNTARIADO: 'bg-green-500/10 text-green-600',
};

const Oportunidades = () => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [page, setPage]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `/oportunidades?activo=true&page=${page}&size=9`;
        if (filtroTipo) url += `&tipo=${filtroTipo}`;
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
  }, [page, filtroTipo]);

  const handleFiltro = (t) => { setFiltroTipo(t); setPage(0); };

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">Oportunidades</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">Empleos, formación y voluntariado para crecer junto a tu comunidad.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TIPOS.map(t => (
            <button
              key={t.value}
              onClick={() => handleFiltro(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                filtroTipo === t.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
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
              {items.map(o => (
                <div key={o.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group flex flex-col">
                  <div className="h-44 overflow-hidden bg-muted">
                    {o.imagenUrl
                      ? <img src={o.imagenUrl} alt={o.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
                    }
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 text-xs font-body font-semibold rounded-full ${TIPO_STYLES[o.tipo] || 'bg-muted text-muted-foreground'}`}>
                        {TIPOS.find(t => t.value === o.tipo)?.label || o.tipo}
                      </span>
                      {o.fechaLimite && (
                        <span className="flex items-center gap-1 text-xs font-body text-muted-foreground">
                          <Calendar className="w-3 h-3" /> Cierre: {o.fechaLimite}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1 line-clamp-2">{o.titulo}</h3>
                    <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{o.descripcion}</p>
                    <div className="flex gap-2 mt-auto">
                      <Link to={`/oportunidades/${o.id}`} className="flex-1">
                        <Button variant="outline-primary" size="sm" className="w-full">Ver detalle</Button>
                      </Link>
                      {o.enlace && (
                        <a href={o.enlace} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />Aplicar</Button>
                        </a>
                      )}
                    </div>
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

export default Oportunidades;
