import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, Printer, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '@/lib/axios';

const estadoBadge = {
  PENDIENTE:  'bg-amber-100 text-amber-700 border-amber-200',
  COMPLETADA: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  RECHAZADA:  'bg-red-100 text-red-700 border-red-200',
  CANCELADA:  'bg-gray-100 text-gray-500 border-gray-200',
};

const handlePrint = (don, nombreUsuario) => {
  const ventana = window.open('', '_blank');
  if (!ventana) return;

  ventana.document.write(`
    <html>
    <head>
      <title>Comprobante de Donación #${don.id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; padding: 48px; max-width: 620px; margin: 0 auto; color: #1a1a1a; }

        .logo-area { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; }
        .logo-circle { width: 52px; height: 52px; background: #1B5E20; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .logo-circle span { color: white; font-size: 22px; }
        .org-name h1 { font-size: 17px; font-weight: 700; color: #1B5E20; }
        .org-name p { font-size: 11px; color: #888; margin-top: 2px; }

        .titulo { text-align: center; margin-bottom: 28px; }
        .titulo h2 { font-size: 20px; font-weight: 700; color: #1B5E20; }
        .titulo p { font-size: 11px; color: #999; margin-top: 4px; }

        .monto-box { 
          text-align: center; padding: 20px; 
          border: 2px dashed #1B5E20; border-radius: 12px; 
          margin: 24px 0; background: #f0faf0;
        }
        .monto-box .label { font-size: 11px; text-transform: uppercase; color: #666; letter-spacing: 1px; }
        .monto-box .valor { font-size: 36px; font-weight: 800; color: #1B5E20; margin-top: 4px; }

        .seccion { margin-top: 24px; }
        .seccion h3 { font-size: 12px; font-weight: 700; text-transform: uppercase; 
                      letter-spacing: 1px; color: #555; border-bottom: 1px solid #ddd; 
                      padding-bottom: 6px; margin-bottom: 12px; }
        .fila { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
        .fila .etiqueta { font-size: 12px; color: #666; }
        .fila .dato { font-size: 12px; font-weight: 600; text-align: right; }

        .estado-badge {
          display: inline-block; padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          background: ${don.estado === 'COMPLETADA' ? '#d1fae5' : don.estado === 'PENDIENTE' ? '#fef3c7' : '#fee2e2'};
          color: ${don.estado === 'COMPLETADA' ? '#065f46' : don.estado === 'PENDIENTE' ? '#92400e' : '#991b1b'};
        }

        .footer { margin-top: 40px; text-align: center; color: #aaa; font-size: 10px; 
                  border-top: 1px solid #eee; padding-top: 16px; line-height: 1.8; }

        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>

      <div class="logo-area">
        <div class="logo-circle"><span>🌱</span></div>
        <div class="org-name">
          <h1>Fundación Julio C. Hernández</h1>
          <p>Suroeste Antioqueño · Educación · Transformación Social</p>
        </div>
      </div>

      <div class="titulo">
        <h2>Comprobante de Donación</h2>
        <p>Documento generado el ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div class="monto-box">
        <div class="label">Valor donado</div>
        <div class="valor">$${Number(don.monto).toLocaleString('es-CO')} COP</div>
      </div>

      <div class="seccion">
        <h3>Datos del aporte</h3>
        <div class="fila">
          <span class="etiqueta">Donante</span>
          <span class="dato">${nombreUsuario || 'Aliado'}</span>
        </div>
        <div class="fila">
          <span class="etiqueta">Destino</span>
          <span class="dato">${don.destino === 'LIBRE_INVERSION' ? 'Libre Inversión' : don.proyectoNombre || 'Proyecto Específico'}</span>
        </div>
        <div class="fila">
          <span class="etiqueta">Fecha</span>
          <span class="dato">${don.fecha ? new Date(don.fecha).toLocaleDateString('es-CO') : '—'}</span>
        </div>
        <div class="fila">
          <span class="etiqueta">Estado</span>
          <span class="dato"><span class="estado-badge">${don.estado}</span></span>
        </div>
        <div class="fila">
          <span class="etiqueta">N° Comprobante</span>
          <span class="dato">#${String(don.id).padStart(6, '0')}</span>
        </div>
      </div>

      <div class="footer">
        <p>Este documento es un comprobante de registro interno.</p>
        <p>La confirmación oficial será emitida por tesorería una vez verificado el pago.</p>
        <p style="margin-top:8px">Fundación Julio C. Hernández · juliochfundacion@gmail.com · +57 300 811 8210</p>
      </div>

    </body>
    </html>
  `);
  ventana.document.close();
  setTimeout(() => ventana.print(), 300);
};

const AliadoDonaciones = () => {
  const { user } = useAuth();
  const [donaciones,      setDonaciones]      = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [paginaActual,    setPaginaActual]    = useState(0);
  const [esUltimaPagina,  setEsUltimaPagina]  = useState(true);
  const [totalElementos,  setTotalElementos]  = useState(0);

  const nombreUsuario = user?.profile?.nombreDisplay || user?.profile?.nombre || user?.email || 'Aliado';

  useEffect(() => {
    const fetchDonaciones = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await api.get(`/donaciones/usuario/${user.id}?page=${paginaActual}&size=10`);
        const { content, last, totalElements } = res.data;
        setDonaciones(content || []);
        setEsUltimaPagina(last);
        setTotalElementos(totalElements);
      } catch (error) {
        console.error('Error en historial:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonaciones();
  }, [user, paginaActual]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Mis Donaciones</h1>
        <p className="font-body text-sm text-muted-foreground italic">
          Mostrando {donaciones.length} de {totalElementos} aportes registrados
        </p>
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
              <div key={don.id}
                className="bg-card rounded-xl border border-border p-4 flex items-center justify-between shadow-sm hover:border-primary/30 transition-all">
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cta/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-cta" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-bold text-lg text-foreground">
                        ${Number(don.monto).toLocaleString('es-CO')}
                      </p>
                      <span className={`px-2 py-0.5 text-[9px] border rounded-full font-bold uppercase ${estadoBadge[don.estado] || estadoBadge.CANCELADA}`}>
                        {don.estado}
                      </span>
                    </div>
                    <p className="font-body text-[11px] text-muted-foreground uppercase">
                      {don.destino === 'LIBRE_INVERSION' ? 'Libre Inversión' : don.proyectoNombre || 'Proyecto Específico'}
                      <span className="mx-2">·</span>
                      {don.fecha ? format(new Date(don.fecha), 'dd/MM/yyyy', { locale: es }) : '---'}
                    </p>
                  </div>
                </div>

                {/* Botón imprimir */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePrint(don, nombreUsuario)}
                  title="Imprimir comprobante"
                  className="shrink-0 text-muted-foreground hover:text-primary">
                  <Printer className="w-4 h-4" />
                </Button>

              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-body">Página {paginaActual + 1}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={paginaActual === 0}
                onClick={() => setPaginaActual(prev => prev - 1)}
                className="gap-1 h-8 text-xs font-bold">
                <ChevronLeft className="w-4 h-4" /> Anterior
              </Button>
              <Button variant="outline" size="sm" disabled={esUltimaPagina}
                onClick={() => setPaginaActual(prev => prev + 1)}
                className="gap-1 h-8 text-xs font-bold">
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