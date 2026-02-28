import { useState } from 'react';
import { Link } from 'react-router-dom';
import { oportunidades } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Bookmark, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const Oportunidades = () => {
  const [filtro, setFiltro] = useState('todas');
  const { isAuthenticated } = useAuth();
  const filtered = filtro === 'todas' ? oportunidades : oportunidades.filter(o => o.estado === filtro);

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">Oportunidades de Empleo</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">Cartelera de empleo regional del Suroeste Antioqueño.</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {['todas', 'abierta', 'cerrada'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${filtro === f ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {f === 'todas' ? 'Todas' : f === 'abierta' ? 'Abiertas' : 'Cerradas'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(o => (
            <div key={o.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group relative">
              {isAuthenticated && (
                <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-secondary/10 transition-colors" title="Guardar">
                  <Bookmark className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              <div className="h-40 overflow-hidden">
                <img src={o.imagen} alt={o.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-5">
                <span className={`inline-block px-2 py-0.5 text-xs font-body font-semibold rounded-full mb-2 ${o.estado === 'abierta' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {o.estado === 'abierta' ? '🟢 Abierta' : '🔴 Cerrada'}
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{o.titulo}</h3>
                <p className="font-body text-sm text-secondary font-medium mb-1">{o.empresa}</p>
                <div className="flex items-center gap-3 text-xs font-body text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{o.ubicacion}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{o.tipo}</span>
                </div>
                <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">{o.descripcion}</p>
                <div className="flex items-center gap-1 text-xs font-body text-muted-foreground mb-4">
                  <Calendar className="w-3 h-3" />
                  Cierre: {new Date(o.fechaCierre).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                </div>
                <Link to={`/oportunidades/${o.id}`}>
                  <Button variant="outline-primary" size="sm" className="w-full">Ver detalles</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Oportunidades;
