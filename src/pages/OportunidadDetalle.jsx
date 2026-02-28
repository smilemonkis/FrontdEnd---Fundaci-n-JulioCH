import { useParams, Link } from 'react-router-dom';
import { oportunidades } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Briefcase, Calendar, CheckCircle } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const OportunidadDetalle = () => {
  const { id } = useParams();
  const op = oportunidades.find(o => o.id === Number(id));

  if (!op) return (
    <main className="section-container section-padding text-center">
      <p className="text-muted-foreground">Oportunidad no encontrada.</p>
      <Link to="/oportunidades"><Button variant="outline-primary" className="mt-4">Volver</Button></Link>
    </main>
  );

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <Link to="/oportunidades" className="inline-flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a oportunidades
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img src={op.imagen} alt={op.titulo} className="w-full h-64 object-cover rounded-xl mb-6" />
            <span className={`inline-block px-3 py-1 text-sm font-body font-semibold rounded-full mb-4 ${op.estado === 'abierta' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {op.estado === 'abierta' ? '🟢 Abierta' : '🔴 Cerrada'}
            </span>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">{op.titulo}</h1>
            <p className="font-body text-secondary font-medium mb-4">{op.empresa}</p>
            <p className="font-body text-foreground/80 leading-relaxed mb-6">{op.descripcionCompleta}</p>
            <div className="bg-muted/50 rounded-xl p-4">
              <h3 className="font-heading font-semibold mb-2">Proceso de referencia</h3>
              <p className="font-body text-sm text-muted-foreground">{op.procesoReferencia}</p>
            </div>
          </div>
          <aside className="bg-card rounded-xl border border-border p-6 h-fit sticky top-24">
            <h3 className="font-heading text-lg font-semibold mb-4">Detalles</h3>
            <div className="space-y-3 font-body text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{op.ubicacion}</div>
              <div className="flex items-center gap-2"><Briefcase className="w-4 h-4" />{op.tipo}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />Cierre: {new Date(op.fechaCierre).toLocaleDateString('es-CO')}</div>
            </div>
            <div className="mt-6">
              <h4 className="font-heading text-sm font-semibold mb-2">Requisitos</h4>
              <ul className="space-y-2">
                {op.requisitos.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-body text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />{r}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default OportunidadDetalle;
