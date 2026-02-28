import { useParams, Link } from 'react-router-dom';
import { noticias } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const NoticiaDetalle = () => {
  const { id } = useParams();
  const noticia = noticias.find(n => n.id === Number(id));

  if (!noticia) return (
    <main className="section-container section-padding text-center">
      <p className="text-muted-foreground">Noticia no encontrada.</p>
      <Link to="/noticias"><Button variant="outline-primary" className="mt-4">Volver</Button></Link>
    </main>
  );

  return (
    <main>
      <Breadcrumbs />
      <article className="section-container section-padding max-w-3xl mx-auto">
        <Link to="/noticias" className="inline-flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a noticias
        </Link>
        <img src={noticia.imagen} alt={noticia.titulo} className="w-full h-64 md:h-80 object-cover rounded-xl mb-6" />
        <div className="flex items-center gap-4 text-sm font-body text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(noticia.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="flex items-center gap-1"><User className="w-4 h-4" />{noticia.autor}</span>
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">{noticia.titulo}</h1>
        <p className="font-body text-foreground/80 leading-relaxed whitespace-pre-line">{noticia.contenido}</p>
      </article>
    </main>
  );
};

export default NoticiaDetalle;
