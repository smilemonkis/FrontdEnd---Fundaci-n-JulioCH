import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { noticias } from '@/data/mockData';
import { ArrowRight, Calendar } from 'lucide-react';

const NewsPreview = () => {
  return (
    <section className="section-padding bg-primary/5">
      <div className="section-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Noticias de la Región</h2>
            <p className="font-body text-muted-foreground">Mantente informado del impacto social en el Suroeste.</p>
          </div>
          <Link to="/noticias" className="hidden md:block"><Button variant="ghost" className="gap-1">Ver todas <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {noticias.map(n => (
            <article key={n.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group">
              <div className="h-44 overflow-hidden"><img src={n.imagen} alt={n.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /></div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-2"><Calendar className="w-3 h-3" />{new Date(n.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2">{n.titulo}</h3>
                <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">{n.resumen}</p>
                <Link to={`/noticias/${n.id}`}><Button variant="outline-primary" size="sm">Leer noticia</Button></Link>
              </div>
            </article>
          ))}
        </div>
        <div className="md:hidden text-center mt-6"><Link to="/noticias"><Button variant="outline-primary">Todas las noticias</Button></Link></div>
      </div>
    </section>
  );
};

export default NewsPreview;
