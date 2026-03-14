import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CreditCard, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';

const montosConImpacto = [
  { valor: 30000,  label: '$30.000',  impacto: 'Kit escolar para un niño' },
  { valor: 50000,  label: '$50.000',  impacto: 'Refuerzo educativo semanal' },
  { valor: 100000, label: '$100.000', impacto: 'Formación técnica' },
];

const AliadoDonar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [proyectos,       setProyectos]       = useState([]);
  const [monto,           setMonto]           = useState(null);
  const [montoCustom,     setMontoCustom]     = useState('');
  const [asociarProyecto, setAsociarProyecto] = useState(null);
  const [proyectoId,      setProyectoId]      = useState('');
  const [submitting,      setSubmitting]      = useState(false);
  const [success,         setSuccess]         = useState(false);

  useEffect(() => {
    api.get('/proyectos/activos')
      .then(res => {
        const data = res.data;
        setProyectos(Array.isArray(data) ? data : data.content || []);
      })
      .catch(err => console.error('Error cargando proyectos:', err));
  }, []);

  const montoFinal = monto || (montoCustom ? parseInt(montoCustom) : 0);

  const handleSubmit = async () => {
    if (!montoFinal || montoFinal <= 0) {
      toast({ title: 'Selecciona un monto válido', variant: 'destructive' });
      return;
    }
    if (asociarProyecto === null) {
      toast({ title: 'Indica si deseas asociar a un proyecto', variant: 'destructive' });
      return;
    }
    if (asociarProyecto && !proyectoId) {
      toast({ title: 'Selecciona un proyecto', variant: 'destructive' });
      return;
    }

    setSubmitting(true);

    // Payload plano que coincide con CreateDonacionRequest
    const payload = {
      usuarioId:  user.id,
      monto:      montoFinal,
      destino:    asociarProyecto ? 'PROYECTO_ACTIVO' : 'LIBRE_INVERSION',
      proyectoId: asociarProyecto ? parseInt(proyectoId) : null,
    };

    try {
      await api.post('/donaciones/aliado', payload);
      setSuccess(true);
      toast({ title: '¡Gracias por tu aporte!', description: 'Donación registrada con éxito.' });
    } catch (error) {
      toast({
        title: 'Error al registrar donación',
        description: error.response?.data?.message || 'Error de validación',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setMonto(null);
    setMontoCustom('');
    setAsociarProyecto(null);
    setProyectoId('');
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in zoom-in duration-300 max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground">¡Donación registrada!</h2>
          <p className="font-body text-muted-foreground mt-1">
            Tu intención de donar <strong className="text-foreground">${montoFinal.toLocaleString('es-CO')}</strong> ha quedado registrada.
          </p>
        </div>

        {/* Pasos a seguir */}
        <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-5 text-left space-y-3">
          <p className="font-body text-sm font-bold text-amber-800">¿Qué sigue ahora?</p>
          <div className="space-y-2">
            {[
              { n: '1', text: 'Realiza la transferencia bancaria a la cuenta de la fundación.', sub: 'Bancolombia · Cta Ahorros · 123-456789-00' },
              { n: '2', text: 'Nuestro equipo verificará el pago en máximo 24 horas hábiles.' },
              { n: '3', text: 'Una vez confirmado, tu comprobante estará disponible en "Mis Donaciones".' },
            ].map(step => (
              <div key={step.n} className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {step.n}
                </span>
                <div>
                  <p className="font-body text-xs text-amber-800">{step.text}</p>
                  {step.sub && <p className="font-mono text-xs font-semibold text-amber-900 mt-0.5">{step.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <Button variant="outline" className="flex-1" onClick={() => window.location.href = '/aliado/donaciones'}>
            Ver mis donaciones
          </Button>
          <Button className="flex-1" onClick={resetForm}>
            Hacer otra donación
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl animate-in fade-in duration-500">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Hacer una donación</h1>
        <p className="font-body text-muted-foreground">Tu aporte transforma vidas en el Suroeste</p>
      </div>

      {/* Banner informativo del proceso */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <span className="text-amber-500 text-xl shrink-0">ℹ️</span>
        <div className="space-y-1">
          <p className="font-body text-sm font-semibold text-amber-800">¿Cómo funciona el proceso?</p>
          <ol className="font-body text-xs text-amber-700 space-y-1 list-decimal list-inside">
            <li>Registra tu donación en este formulario.</li>
            <li>Realiza la transferencia a la cuenta de la fundación:
              <span className="block ml-4 mt-0.5 font-mono font-semibold">Bancolombia · Cta Ahorros · 123-456789-00</span>
            </li>
            <li>Nuestro equipo verificará el pago y confirmará tu donación en máximo <strong>24 horas hábiles</strong>.</li>
            <li>Recibirás el comprobante en tu panel una vez sea aprobada.</li>
          </ol>
        </div>
      </div>

      {/* Paso 1 — Monto */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4 shadow-sm">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>
          Selecciona el monto
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {montosConImpacto.map((m) => (
            <button key={m.valor} type="button"
              onClick={() => { setMonto(m.valor); setMontoCustom(''); }}
              className={`rounded-xl border-2 p-4 text-center transition-all ${
                monto === m.valor
                  ? 'border-primary bg-primary/10 shadow-md scale-[1.02]'
                  : 'border-border bg-background hover:border-primary/50'
              }`}>
              <span className={`block font-heading text-xl font-bold ${monto === m.valor ? 'text-primary' : 'text-foreground'}`}>
                {m.label}
              </span>
              <span className="block font-body text-[10px] uppercase tracking-tighter text-muted-foreground mt-1">
                {m.impacto}
              </span>
            </button>
          ))}
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5 ml-1">
            O ingresa otra cantidad
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input type="number" min="1000" value={montoCustom}
              onChange={(e) => { setMontoCustom(e.target.value); setMonto(null); }}
              placeholder="Ej: 75000"
              className="w-full pl-7 pr-3 py-3 rounded-lg border border-input bg-background font-body text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
          </div>
        </div>
      </div>

      {/* Paso 2 — Destino */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4 shadow-sm">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>
          Destino de la donación
        </h3>
        <div className="flex gap-3">
          <button type="button" onClick={() => setAsociarProyecto(true)}
            className={`flex-1 rounded-xl border-2 p-4 text-center transition-all ${
              asociarProyecto === true ? 'border-primary bg-primary/10 shadow-sm' : 'border-border hover:border-primary/50'
            }`}>
            <span className="font-heading font-semibold text-sm text-foreground">Proyecto Específico</span>
          </button>
          <button type="button" onClick={() => { setAsociarProyecto(false); setProyectoId(''); }}
            className={`flex-1 rounded-xl border-2 p-4 text-center transition-all ${
              asociarProyecto === false ? 'border-primary bg-primary/10 shadow-sm' : 'border-border hover:border-primary/50'
            }`}>
            <span className="font-heading font-semibold text-sm text-foreground">Libre Inversión</span>
          </button>
        </div>

        {asociarProyecto && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <label className="block text-xs font-bold uppercase text-muted-foreground mb-1.5 ml-1">
              Selecciona el proyecto
            </label>
            <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)}
              className="w-full px-3 py-3 rounded-lg border border-input bg-background font-body text-sm outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">-- Proyectos activos --</option>
              {proyectos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Botón confirmar */}
      <Button onClick={handleSubmit} disabled={submitting || !montoFinal} size="lg"
        className="w-full gap-2 text-base h-14 shadow-lg shadow-primary/20">
        {submitting
          ? <Loader2 className="w-5 h-5 animate-spin" />
          : <CreditCard className="w-5 h-5" />}
        {submitting
          ? 'Procesando aporte...'
          : `Confirmar Donación de $${(montoFinal || 0).toLocaleString('es-CO')}`}
      </Button>
    </div>
  );
};

export default AliadoDonar;
