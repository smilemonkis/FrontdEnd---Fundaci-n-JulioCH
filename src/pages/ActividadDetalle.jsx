// src/pages/ActividadDetalle.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const ActividadDetalle = () => {
  const { id } = useParams();
  const [actividad, setActividad] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/parchate/${id}`);
        setActividad(res.data);
      } catch {
        setActividad(null);
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

  if (!actividad) return (
    <main className="section-container section-padding text-center py-20">
      <p className="font-body text-muted-foreground mb-4">Actividad no encontrada.</p>
      <Link to="/parchate"><Button variant="outline">Volver a Párchate</Button></Link>
    </main>
  );

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding max-w-3xl mx-auto">

        <Link to="/parchate" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a Párchate
        </Link>

        {actividad.imagenUrl && (
          <div className="rounded-xl overflow-hidden mb-6 h-64 md:h-80">
            <img src={actividad.imagenUrl} alt={actividad.titulo} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 text-sm font-body font-semibold rounded-full bg-primary/10 text-primary">{actividad.tipo}</span>
          <span className="flex items-center gap-1 text-sm font-body text-muted-foreground">
            <MapPin className="w-4 h-4" />{actividad.ubicacion}
          </span>
          {actividad.fechaEvento && (
            <span className="flex items-center gap-1 text-sm font-body text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {new Date(actividad.fechaEvento).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">{actividad.titulo}</h1>
        <p className="font-body text-foreground leading-relaxed whitespace-pre-line mb-6">{actividad.descripcion}</p>

        {actividad.direccion && (
          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <p className="text-sm font-body font-semibold text-foreground mb-1">📍 Dirección</p>
            <p className="text-sm font-body text-muted-foreground">{actividad.direccion}</p>
            {actividad.urlMapa && (
              <a href={actividad.urlMapa} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2">
                Ver en el mapa <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Galería */}
        {actividad.galeria?.length > 0 && (
          <div className="mt-8">
            <h3 className="font-heading text-lg font-semibold mb-4">Galería</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {actividad.galeria.map((img) => (
                <div key={img.id} className="rounded-lg overflow-hidden h-32">
                  <img src={img.url} alt={img.descripcion || ''} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Link to="/parchate">
            <Button variant="outline">← Ver más actividades</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ActividadDetalle;
