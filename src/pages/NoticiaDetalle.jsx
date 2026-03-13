// src/pages/NoticiaDetalle.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const NoticiaDetalle = () => {
  const { id } = useParams();
  const [noticia, setNoticia]         = useState(null);
  const [relacionadas, setRelacionadas] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resNoticia, resRel] = await Promise.all([
          api.get(`/noticias/${id}`),
          api.get(`/noticias/${id}/relacionadas?size=3`),
        ]);
        setNoticia(resNoticia.data);
        setRelacionadas(resRel.data.content || []);
      } catch {
        setNoticia(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <main className="section-container section-padding flex justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </main>
  );

  if (!noticia) return (
    <main className="section-container section-padding text-center py-20">
      <p className="font-body text-muted-foreground mb-4">Noticia no encontrada.</p>
      <Link to="/noticias"><Button variant="outline">Volver a noticias</Button></Link>
    </main>
  );

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding max-w-3xl mx-auto">

        <Link to="/noticias" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a noticias
        </Link>

        {noticia.imagenUrl && (
          <div className="rounded-xl overflow-hidden mb-6 h-64 md:h-80">
            <img src={noticia.imagenUrl} alt={noticia.titulo} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-4 text-xs font-body text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{noticia.fechaPublicacion}</span>
          <span className="flex items-center gap-1"><User className="w-3 h-3" />{noticia.autor}</span>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">{noticia.titulo}</h1>
        <p className="font-body text-lg text-muted-foreground mb-6 border-l-4 border-primary pl-4">{noticia.resumen}</p>

        <div className="font-body text-foreground leading-relaxed whitespace-pre-line">
          {noticia.contenido}
        </div>

        {/* Galería */}
        {noticia.galeria?.length > 0 && (
          <div className="mt-8">
            <h3 className="font-heading text-lg font-semibold mb-4">Galería</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {noticia.galeria.map((img) => (
                <div key={img.id} className="rounded-lg overflow-hidden h-32">
                  <img src={img.url} alt={img.descripcion || ''} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relacionadas */}
        {relacionadas.length > 0 && (
          <div className="mt-12 border-t border-border pt-8">
            <h3 className="font-heading text-xl font-semibold mb-6">Otras noticias</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relacionadas.map(r => (
                <Link key={r.id} to={`/noticias/${r.id}`} className="bg-card rounded-xl border border-border overflow-hidden card-hover group">
                  <div className="h-28 overflow-hidden bg-muted">
                    {r.imagenUrl
                      ? <img src={r.imagenUrl} alt={r.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sin imagen</div>
                    }
                  </div>
                  <div className="p-3">
                    <p className="font-heading text-sm font-semibold line-clamp-2">{r.titulo}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{r.fechaPublicacion}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default NoticiaDetalle;
