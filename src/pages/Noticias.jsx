import { Link } from 'react-router-dom';
import { noticias } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const Noticias = () => {
  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">Noticias</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">Últimas novedades de la Fundación y la región.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map(n => (
            <article key={n.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group">
              <div className="h-44 overflow-hidden">
                <img src={n.imagen} alt={n.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(n.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2">{n.titulo}</h3>
                <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">{n.resumen}</p>
                <Link to={`/noticias/${n.id}`}>
                  <Button variant="outline-primary" size="sm">Leer noticia</Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Noticias;
