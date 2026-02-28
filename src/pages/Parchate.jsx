import { Link } from 'react-router-dom';
import { actividades } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Bookmark } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const categoriaLabels = { recreativa: '🎨 Recreativa', cultural: '🎭 Cultural', turistica: '🏔️ Turística' };

const Parchate = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">¡Párchate!</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">Actividades recreativas, culturales y turísticas del Suroeste Antioqueño.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actividades.map(a => (
            <div key={a.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group relative">
              {isAuthenticated && (
                <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-accent/10 transition-colors" title="Guardar">
                  <Bookmark className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              <div className="h-48 overflow-hidden">
                <img src={a.imagen} alt={a.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-5">
                <span className="inline-block px-2 py-0.5 text-xs font-body font-medium rounded-full bg-accent/10 text-accent mb-2">
                  {categoriaLabels[a.categoria]}
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{a.titulo}</h3>
                <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">{a.descripcion}</p>
                <div className="flex items-center gap-3 text-xs font-body text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(a.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.ubicacion}</span>
                </div>
                <Link to={`/parchate/${a.id}`}>
                  <Button variant="outline-primary" size="sm" className="w-full">Ver más</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Parchate;
