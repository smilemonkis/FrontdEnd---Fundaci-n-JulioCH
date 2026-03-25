// src/pages/ConvocatoriaDetalle.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const ESTADO_STYLES = {
  ABIERTO:      { label: 'Abierta',      dot: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-500/10' },
  PROXIMAMENTE: { label: 'Próximamente', dot: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-500/10' },
  CERRADO:      { label: 'Cerrada',      dot: 'bg-red-500',    text: 'text-red-600',    bg: 'bg-red-500/10' },
};

const formatFecha = (fecha) => {
  if (!fecha) return null;
  try { return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return fecha; }
};

const ConvocatoriaDetalle = () => {
  const { id } = useParams();
  const [conv, setConv]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    api.get(`/convocatorias/${id}`)
      .then(res => setConv(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (error || !conv) return (
    <main className="section-container section-padding text-center">
      <p className="text-muted-foreground font-body">Convocatoria no encontrada.</p>
      <Link to="/convocatorias"><Button variant="outline" className="mt-4">Volver</Button></Link>
    </main>
  );

  const estado = ESTADO_STYLES[conv.estado] || ESTADO_STYLES.ABIERTO;
  const mostrarBoton = conv.mostrarBoton && conv.enlace;

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <Link to="/convocatorias" className="inline-flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a convocatorias
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            {conv.imagenUrl && (
              <img src={conv.imagenUrl} alt={conv.titulo}
                className="w-full h-64 md:h-80 object-cover rounded-xl mb-6" />
            )}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-body font-semibold mb-4 ${estado.bg} ${estado.text}`}>
              <span className={`w-2 h-2 rounded-full ${estado.dot}`} />
              {estado.label}
            </span>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">{conv.titulo}</h1>
            <p className="font-body text-foreground/80 leading-relaxed whitespace-pre-wrap">{conv.descripcion}</p>
          </div>

          {/* Sidebar */}
          <aside className="bg-card rounded-xl border border-border p-6 h-fit sticky top-24 space-y-4">
            <h3 className="font-heading text-lg font-semibold">Información</h3>

            {(conv.fechaInicio || conv.fechaFin) && (
              <div className="space-y-2 font-body text-sm">
                {conv.fechaInicio && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>Inicio: {formatFecha(conv.fechaInicio)}</span>
                  </div>
                )}
                {conv.fechaFin && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>Cierre: {formatFecha(conv.fechaFin)}</span>
                  </div>
                )}
              </div>
            )}

            {mostrarBoton && (
              <a href={conv.enlace} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="default" size="lg" className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  {conv.textoBoton || 'Inscribirme'}
                </Button>
              </a>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ConvocatoriaDetalle;
