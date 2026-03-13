// src/pages/Noticias.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Calendar, User, Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const Noticias = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (p = 0) => {
    setLoading(true);
    try {
      const res = await api.get(`/noticias?publicado=true&page=${p}&size=9`);
      setItems(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(page); }, [page]);

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">Noticias</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">Mantente informado sobre las actividades y logros de la Fundación.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-body">No hay noticias publicadas aún.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(n => (
                <div key={n.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group">
                  <div className="h-44 overflow-hidden bg-muted">
                    {n.imagenUrl
                      ? <img src={n.imagenUrl} alt={n.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
                    }
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs font-body text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{n.fechaPublicacion}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{n.autor}</span>
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-1 line-clamp-2">{n.titulo}</h3>
                    <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-3">{n.resumen}</p>
                    <Link to={`/noticias/${n.id}`}>
                      <Button variant="outline-primary" size="sm" className="w-full">Leer más</Button>
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

export default Noticias;
