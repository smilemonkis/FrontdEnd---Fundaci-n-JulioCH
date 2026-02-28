import { useParams, Link } from 'react-router-dom';
import { convocatorias } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, CheckCircle } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const ConvocatoriaDetalle = () => {
  const { id } = useParams();
  const conv = convocatorias.find(c => c.id === Number(id));

  if (!conv) return (
    <main className="section-container section-padding text-center">
      <p className="text-muted-foreground">Convocatoria no encontrada.</p>
      <Link to="/convocatorias"><Button variant="outline-primary" className="mt-4">Volver</Button></Link>
    </main>
  );

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <Link to="/convocatorias" className="inline-flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a convocatorias
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img src={conv.imagen} alt={conv.titulo} className="w-full h-64 md:h-80 object-cover rounded-xl mb-6" />
            <span className={`inline-block px-3 py-1 text-sm font-body font-semibold rounded-full mb-4 ${
              conv.estado === 'abierta' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              {conv.estado === 'abierta' ? '🟢 Abierta' : '🔴 Cerrada'}
            </span>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">{conv.titulo}</h1>
            <p className="font-body text-foreground/80 leading-relaxed">{conv.descripcionCompleta}</p>
          </div>
          <aside className="bg-card rounded-xl border border-border p-6 h-fit sticky top-24">
            <h3 className="font-heading text-lg font-semibold mb-4">Información</h3>
            <div className="space-y-3 font-body text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" /> Inicio: {new Date(conv.fechaInicio).toLocaleDateString('es-CO')}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" /> Cierre: {new Date(conv.fechaFin).toLocaleDateString('es-CO')}
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-heading text-sm font-semibold mb-2">Requisitos</h4>
              <ul className="space-y-2">
                {conv.requisitos.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-body text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {r}
                  </li>
                ))}
              </ul>
            </div>
            {conv.estado === 'abierta' && (
              <a href={conv.enlaceInscripcion} target="_blank" rel="noopener noreferrer" className="mt-6 block">
                <Button variant="cta-static" size="lg" className="w-full">Inscribirme</Button>
              </a>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ConvocatoriaDetalle;
