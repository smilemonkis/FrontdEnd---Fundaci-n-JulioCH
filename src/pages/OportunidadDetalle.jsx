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

const OportunidadDetalle = () => {
  const { id } = useParams();
  const [oportunidad, setOportunidad] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/oportunidades/${id}`);
        setOportunidad(res.data);
      } catch {
        setOportunidad(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  const tipoInfo = TIPO_STYLES[oportunidad.tipo] || { label: oportunidad.tipo, color: 'bg-muted text-muted-foreground' };

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding max-w-3xl mx-auto">

        <Link to="/oportunidades" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a oportunidades
        </Link>

        {oportunidad.imagenUrl && (
          <div className="rounded-xl overflow-hidden mb-6 h-64 md:h-80">
            <img src={oportunidad.imagenUrl} alt={oportunidad.titulo} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1 text-sm font-body font-semibold rounded-full ${tipoInfo.color}`}>
            {tipoInfo.label}
          </span>
          {oportunidad.fechaLimite && (
            <span className="flex items-center gap-1 text-sm font-body text-muted-foreground">
              <Calendar className="w-4 h-4" /> Fecha límite: {oportunidad.fechaLimite}
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">{oportunidad.titulo}</h1>

        <div className="font-body text-foreground leading-relaxed whitespace-pre-line mb-8">
          {oportunidad.descripcion}
        </div>

        {oportunidad.enlace && (
          <a href={oportunidad.enlace} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2">
              <ExternalLink className="w-4 h-4" /> Aplicar ahora
            </Button>
          </a>
        )}

        <div className="mt-8">
          <Link to="/oportunidades">
            <Button variant="outline">← Ver más oportunidades</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OportunidadDetalle;
