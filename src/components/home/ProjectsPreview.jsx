import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { proyectos } from '@/data/mockData';
import { ArrowRight, Users, TrendingUp } from 'lucide-react';

const ProjectsPreview = () => {
  const featured = proyectos.slice(0, 3);
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Proyectos</h2>
            <p className="font-body text-muted-foreground">Conoce los proyectos que están transformando el Suroeste.</p>
          </div>
          <Link to="/que-hacemos" className="hidden md:block"><Button variant="ghost" className="gap-1">Ver todos <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map(p => (
            <article key={p.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group">
              <div className="h-48 overflow-hidden"><img src={p.imagen} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /></div>
              <div className="p-5">
                <span className="inline-block px-2 py-0.5 text-xs font-body font-medium rounded-full bg-primary/10 text-primary mb-2">{p.estado === 'activo' ? 'Activo' : 'Finalizado'}</span>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{p.titulo}</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">{p.descripcion}</p>
                <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-muted/60">
                  <div className="flex items-center gap-1.5 text-sm font-body"><Users className="w-4 h-4 text-primary" /><span className="font-semibold text-foreground">{p.beneficiarios.toLocaleString()}</span><span className="text-muted-foreground text-xs">beneficiarios</span></div>
                  <div className="flex items-center gap-1.5 text-sm font-body"><TrendingUp className="w-4 h-4 text-secondary" /><span className="font-semibold text-foreground">{p.progreso}%</span><span className="text-muted-foreground text-xs">avance</span></div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-3"><div className="gradient-primary h-2 rounded-full transition-all" style={{ width: `${p.progreso}%` }} /></div>
                <Link to="/que-hacemos"><Button variant="outline-primary" size="sm">Ver proyecto</Button></Link>
              </div>
            </article>
          ))}
        </div>
        <div className="md:hidden text-center mt-6"><Link to="/que-hacemos"><Button variant="outline-primary">Ver todos los proyectos</Button></Link></div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
