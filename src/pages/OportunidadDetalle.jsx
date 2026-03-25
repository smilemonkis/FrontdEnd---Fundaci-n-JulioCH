// src/pages/OportunidadDetalle.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const TIPO_STYLES = {
  EMPLEO:       { label: 'Empleo',       color: 'bg-blue-500/10 text-blue-600' },
  FORMACION:    { label: 'Formación',    color: 'bg-purple-500/10 text-purple-600' },
  VOLUNTARIADO: { label: 'Voluntariado', color: 'bg-green-500/10 text-green-600' },
};

const ESTADO_STYLES = {
  ABIERTO:      { label: 'Abierta',       dot: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-500/10' },
  PROXIMAMENTE: { label: 'Próximamente',  dot: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-500/10' },
  CERRADO:      { label: 'Cerrada',       dot: 'bg-red-500',    text: 'text-red-600',    bg: 'bg-red-500/10' },
};

const formatFecha = (fecha) => {
  if (!fecha) return null;
  try { return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return fecha; }
};

const OportunidadDetalle = () => {
  const { id } = useParams();
  const [oportunidad, setOportunidad] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    api.get(`/oportunidades/${id}`)
      .then(res => setOportunidad(res.data))
      .catch(() => setOportunidad(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <main className="section-container section-padding flex justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </main>
  );

  if (!oportunidad) return (
    <main className="section-container section-padding text-center py-20">
      <p className="font-body text-muted-foreground mb-4">Oportunidad no encontrada.</p>
      <Link to="/oportunidades"><Button variant="outline">Volver a oportunidades</Button></Link>
    </main>
  );

  const tipoInfo   = TIPO_STYLES[oportunidad.tipo]    || { label: oportunidad.tipo, color: 'bg-muted text-muted-foreground' };
  const estadoInfo = ESTADO_STYLES[oportunidad.estado] || ESTADO_STYLES.ABIERTO;
  const mostrarBoton = oportunidad.mostrarBoton && oportunidad.enlace;

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <Link to="/oportunidades" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a oportunidades
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            {oportunidad.imagenUrl && (
              <div className="rounded-xl overflow-hidden mb-6 h-64 md:h-80">
                <img src={oportunidad.imagenUrl} alt={oportunidad.titulo} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-sm font-body font-semibold rounded-full ${tipoInfo.color}`}>
                {tipoInfo.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-body font-semibold ${estadoInfo.bg} ${estadoInfo.text}`}>
                <span className={`w-2 h-2 rounded-full ${estadoInfo.dot}`} />
                {estadoInfo.label}
              </span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">{oportunidad.titulo}</h1>
            <div className="font-body text-foreground/80 leading-relaxed whitespace-pre-line">
              {oportunidad.descripcion}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="bg-card rounded-xl border border-border p-6 h-fit sticky top-24 space-y-4">
            <h3 className="font-heading text-lg font-semibold">Información</h3>

            {oportunidad.fechaLimite && (
              <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Fecha límite: {formatFecha(oportunidad.fechaLimite)}</span>
              </div>
            )}

            {mostrarBoton && (
              <a href={oportunidad.enlace} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="default" size="lg" className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  {oportunidad.textoBoton || 'Aplicar'}
                </Button>
              </a>
            )}

            <Link to="/oportunidades" className="block">
              <Button variant="outline" className="w-full">← Ver más oportunidades</Button>
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default OportunidadDetalle;
