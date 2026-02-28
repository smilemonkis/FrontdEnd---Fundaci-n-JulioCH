import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, Printer, Filter, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '@/lib/axios';

const estadoBadge = {
  PENDIENTE: 'bg-amber-100 text-amber-700 border-amber-200',
  COMPLETADA: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  RECHAZADA: 'bg-red-100 text-red-700 border-red-200',
};

const AliadoDonaciones = () => {
  const { user } = useAuth();
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- NUEVOS ESTADOS PARA PAGINACIÓN ---
  const [paginaActual, setPaginaActual] = useState(0);
  const [esUltimaPagina, setEsUltimaPagina] = useState(true);
  const [totalElementos, setTotalElementos] = useState(0);

  useEffect(() => {
    const fetchDonaciones = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        // Llamamos a tu endpoint enviando la página actual
        const response = await api.get(`/donaciones/usuario/${user.id}?page=${paginaActual}&size=10`);
        
        // Extraemos los datos del "paquete" Page de Spring Boot
        const { content, last, totalElements } = response.data;
        
        setDonaciones(content || []);
        setEsUltimaPagina(last); // Java nos dice si es la última
        setTotalElementos(totalElements);
      } catch (error) {
        console.error("Error en historial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonaciones();
  }, [user, paginaActual]); // Se dispara cuando cambia el usuario o la página

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Mis Donaciones</h1>
          <p className="font-body text-sm text-muted-foreground italic">
            Mostrando {donaciones.length} de {totalElementos} aportes registrados
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <p className="text-xs text-muted-foreground font-body">Consultando registros...</p>
        </div>
      ) : donaciones.length === 0 ? (
        <div className="bg-card rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <Heart className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-body text-muted-foreground">Aún no tienes registros de donaciones.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {donaciones.map((don) => (
              <div key={don.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between shadow-sm hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cta/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-cta" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-bold text-lg text-foreground">
                        ${Number(don.monto).toLocaleString('es-CO')}
                      </p>
                      <span className={`px-2 py-0.5 text-[9px] border rounded-full font-bold uppercase ${estadoBadge[don.estado]}`}>
                        {don.estado}
                      </span>
                    </div>
                    <p className="font-body text-[11px] text-muted-foreground uppercase">
                      {don.destino === 'LIBRE_INVERSION' ? 'Libre Inversión' : 'Proyecto Específico'} 
                      <span className="mx-2">•</span> 
                      {don.fecha ? format(new Date(don.fecha), "dd/MM/yyyy", { locale: es }) : '---'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- CONTROLES DE PAGINACIÓN --- */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-body">
              Página {paginaActual + 1}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={paginaActual === 0} 
                onClick={() => setPaginaActual(prev => prev - 1)}
                className="gap-1 h-8 text-xs font-bold"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={esUltimaPagina} 
                onClick={() => setPaginaActual(prev => prev + 1)}
                className="gap-1 h-8 text-xs font-bold"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AliadoDonaciones;