import { useState } from 'react';
import { Link } from 'react-router-dom';
import { convocatorias } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Calendar, Bookmark } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const Convocatorias = () => {
  const [filtro, setFiltro] = useState('todas');
  const { isAuthenticated } = useAuth();

  const filtered = filtro === 'todas' ? convocatorias : convocatorias.filter(c => c.estado === filtro);

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">Convocatorias</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">Encuentra oportunidades de formación y desarrollo en el Suroeste Antioqueño.</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {['todas', 'abierta', 'cerrada'].map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                filtro === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f === 'todas' ? 'Todas' : f === 'abierta' ? 'Abiertas' : 'Cerradas'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => (
            <div key={c.id} className="bg-card rounded-xl overflow-hidden card-hover border border-border group relative">
              {isAuthenticated && (
                <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary/10 transition-colors" title="Guardar">
                  <Bookmark className="w-4 h-4 text-muted-foreground hover:text-primary" />
                </button>
              )}
              <div className="h-44 overflow-hidden">
                <img src={c.imagen} alt={c.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 text-xs font-body font-semibold rounded-full ${
                    c.estado === 'abierta' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {c.estado === 'abierta' ? '🟢 Abierta' : '🔴 Cerrada'}
                  </span>
                  <span className="text-xs font-body text-muted-foreground">{c.categoria}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{c.titulo}</h3>
                <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">{c.descripcion}</p>
                <div className="flex items-center gap-1 text-xs font-body text-muted-foreground mb-4">
                  <Calendar className="w-3 h-3" />
                  Cierre: {new Date(c.fechaFin).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <Link to={`/convocatorias/${c.id}`}>
                  <Button variant="outline-primary" size="sm" className="w-full">Quiero saber más</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Convocatorias;
