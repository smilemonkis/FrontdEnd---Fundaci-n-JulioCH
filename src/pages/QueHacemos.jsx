import { proyectos } from '@/data/mockData';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const QueHacemos = () => {
  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">Qué Hacemos</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">Conoce los proyectos que transforman el Suroeste Antioqueño.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {proyectos.map(p => (
            <div key={p.id} className="bg-card rounded-xl overflow-hidden border border-border card-hover group">
              <div className="h-52 overflow-hidden">
                <img src={p.imagen} alt={p.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 text-xs font-body font-semibold rounded-full ${p.estado === 'activo' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {p.estado === 'activo' ? '🟢 Activo' : '✅ Finalizado'}
                  </span>
                  <span className="text-xs font-body text-muted-foreground">{p.presupuesto}</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{p.titulo}</h3>
                <p className="font-body text-sm text-muted-foreground mb-4">{p.descripcion}</p>
                <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                  <div className="gradient-primary h-2.5 rounded-full transition-all" style={{ width: `${p.progreso}%` }} />
                </div>
                <div className="flex justify-between text-xs font-body text-muted-foreground">
                  <span>{p.progreso}% completado</span>
                  <span>{p.beneficiarios.toLocaleString()} beneficiarios</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default QueHacemos;
