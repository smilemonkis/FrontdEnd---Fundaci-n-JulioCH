// src/pages/Donar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Shield, CreditCard, ArrowRight, Users, Loader2, CheckCircle2, UserPlus, Home } from 'lucide-react';
import api from '@/lib/axios';
import heroBanner from '@/assets/hero-banner-2.jpg';

const montosConImpacto = [
  { valor: '30000',  label: '$30.000',  impacto: 'Kit escolar para un niño en zona rural' },
  { valor: '50000',  label: '$50.000',  impacto: 'Una semana de refuerzo educativo para un joven' },
  { valor: '100000', label: '$100.000', impacto: 'Formación técnica para acceso al empleo' },
];

const Donar = () => {
  const navigate = useNavigate();
  const [proyectos,   setProyectos]   = useState([]);
  const [monto,       setMonto]       = useState('');
  const [montoCustom, setMontoCustom] = useState('');
  const [nombre,      setNombre]      = useState('');
  const [email,       setEmail]       = useState('');
  const [proyectoId,  setProyectoId]  = useState('');
  const [saving,      setSaving]      = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [donacion,    setDonacion]    = useState(null);
  const [error,       setError]       = useState('');

  useEffect(() => {
    api.get('/proyectos?page=0&size=50')
      .then(res => setProyectos((res.data.content || []).filter(p => p.activo)))
      .catch(() => {});
  }, []);

  const montoFinal = monto || montoCustom;

  const handleSelectMonto = (valor) => { setMonto(valor); setMontoCustom(''); };
  const handleCustomMonto = (val)   => { setMontoCustom(val); setMonto(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const montoNum = Number(montoFinal.toString().replace(/\D/g, ''));
    if (!montoNum || montoNum < 1000) { setError('El monto mínimo es $1.000'); return; }
    if (!nombre.trim())               { setError('Ingresa tu nombre'); return; }
    if (!email.trim())                { setError('Ingresa tu correo electrónico'); return; }

    setSaving(true);
    try {
      const res = await api.post('/donaciones/publica', {
        monto:         montoNum,
        destino:       proyectoId ? 'PROYECTO_ACTIVO' : 'LIBRE_INVERSION',
        proyectoId:    proyectoId ? Number(proyectoId) : null,
        donanteNombre: nombre.trim(),
        donanteEmail:  email.trim(),
      });
      setDonacion(res.data);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error registrando la donación. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleSerAliado = () => {
    const params = new URLSearchParams({
      rol:    'donante',
      email:  email,
      nombre: nombre,
    });
    navigate(`/registro?${params.toString()}`);
  };

  // ── Pantalla de éxito ──────────────────────────────────────
  if (submitted && donacion) {
    const montoFormateado = `$${Number(donacion.monto).toLocaleString('es-CO')}`;
    const destino = donacion.destino === 'LIBRE_INVERSION'
      ? 'Libre inversión'
      : donacion.proyectoNombre || 'Proyecto';

    return (
      <main>
        <div className="section-container section-padding max-w-lg mx-auto">
          {/* Check animado */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">¡Gracias, {nombre}!</h1>
            <p className="font-body text-muted-foreground">Tu generosidad transforma vidas en el Suroeste Antioqueño.</p>
          </div>

          {/* Resumen de la donación */}
          <div className="bg-card rounded-xl border border-border p-5 mb-6 space-y-3">
            <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wide">Tu donación</h2>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-muted-foreground">Monto</span>
              <span className="font-heading text-2xl font-bold text-primary">{montoFormateado}</span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="font-body text-sm text-muted-foreground">Destino</span>
              <span className="font-body text-sm font-medium text-foreground">{destino}</span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="font-body text-sm text-muted-foreground">Estado</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-accent/15 text-accent px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Pendiente de confirmación
              </span>
            </div>
            <p className="text-xs text-muted-foreground pt-1 font-body">
              Enviaremos confirmación a <strong>{email}</strong> una vez verificado el pago.
            </p>
          </div>

          {/* Propuesta ser Aliado */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border-2 border-primary/30 p-6 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-cta-foreground" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-foreground">¿Quieres ser Aliado?</h3>
                <p className="font-body text-xs text-muted-foreground">Involúcrate más con la fundación</p>
              </div>
            </div>
            <ul className="space-y-1.5 font-body text-sm text-muted-foreground mb-4">
              <li className="flex items-center gap-2"><Heart className="w-3.5 h-3.5 text-primary shrink-0" /> Historial completo de tus donaciones</li>
              <li className="flex items-center gap-2"><Heart className="w-3.5 h-3.5 text-primary shrink-0" /> Certificados tributarios automáticos</li>
              <li className="flex items-center gap-2"><Heart className="w-3.5 h-3.5 text-primary shrink-0" /> Seguimiento del impacto de tus aportes</li>
              <li className="flex items-center gap-2"><Heart className="w-3.5 h-3.5 text-primary shrink-0" /> Acceso a beneficios exclusivos</li>
            </ul>
            <Button onClick={handleSerAliado} variant="cta-static" className="w-full gap-2">
              <UserPlus className="w-4 h-4" /> Sí, quiero ser Aliado
            </Button>
          </div>

          {/* Volver al inicio */}
          <Button variant="ghost" onClick={() => navigate('/')} className="w-full gap-2 text-muted-foreground">
            <Home className="w-4 h-4" /> Volver al inicio
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[340px] md:h-[420px] flex items-center justify-center overflow-hidden">
        <img src={heroBanner} alt="Comunidades del Suroeste Antioqueño" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 to-foreground/40" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-4 drop-shadow-lg">Tu donación transforma el Suroeste</h1>
          <p className="font-body text-lg md:text-xl text-primary-foreground/90 drop-shadow">Cada aporte impulsa educación, empleo y bienestar en nuestras comunidades</p>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="hsl(var(--background))" />
        </svg>
      </section>

      <section className="section-container pt-10 pb-4 text-center">
        <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground">Necesitamos tu ayuda – Tu donación cambia vidas</h2>
      </section>

      <section className="section-container pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {montosConImpacto.map((m) => (
            <button key={m.valor} type="button" onClick={() => handleSelectMonto(m.valor)}
              className={`group rounded-xl border-2 p-6 text-center transition-all duration-200 cursor-pointer ${
                monto === m.valor ? 'border-primary bg-primary/10 shadow-md scale-[1.03]' : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
              }`}>
              <span className={`block font-heading text-3xl font-bold mb-2 ${monto === m.valor ? 'text-primary' : 'text-foreground'}`}>{m.label}</span>
              <span className="block font-body text-sm text-muted-foreground">{m.impacto}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section-container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-card rounded-xl border border-border p-6 md:p-8 space-y-6">
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Tu aportación</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {montosConImpacto.map((m) => (
                  <button key={m.valor} type="button" onClick={() => handleSelectMonto(m.valor)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-body font-semibold border-2 transition-colors ${
                      monto === m.valor ? 'border-primary bg-primary text-primary-foreground' : 'border-input text-muted-foreground hover:border-primary/50'
                    }`}>{m.label}</button>
                ))}
                <button type="button" onClick={() => { setMonto(''); document.getElementById('custom-monto')?.focus(); }}
                  className={`px-5 py-2.5 rounded-lg text-sm font-body font-semibold border-2 transition-colors ${
                    !monto && montoCustom ? 'border-primary bg-primary text-primary-foreground' : 'border-input text-muted-foreground hover:border-primary/50'
                  }`}>Otra cantidad</button>
              </div>
              <input id="custom-monto" type="number" min="1000" value={montoCustom}
                onChange={(e) => handleCustomMonto(e.target.value)}
                placeholder="Ingresa otra cantidad"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-1">Destino de tu donación</label>
              <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Libre inversión (donde más se necesite)</option>
                {proyectos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-1">Tus datos</h3>
              <p className="text-sm font-body text-muted-foreground mb-3">Los necesitamos para enviarte la confirmación de tu donación.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Nombre *</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Correo electrónico *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-destructive font-body">{error}</p>}

            <Button variant="cta-static" size="xl" type="submit" disabled={saving} className="w-full gap-2 text-base">
              {saving
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Registrando...</>
                : <><CreditCard className="w-5 h-5" /> Realizar donación</>
              }
            </Button>
          </form>

          <aside className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-primary" />
                <h3 className="font-heading font-semibold text-foreground">Donación segura</h3>
              </div>
              <p className="font-body text-sm text-muted-foreground">Tus datos están protegidos. Usamos plataformas de pago seguras y certificadas.</p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border-2 border-primary/30 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center">
                  <Users className="w-5 h-5 text-cta-foreground" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">¡Quieres ser Aliado?</h3>
              </div>
              <p className="font-body text-sm text-muted-foreground mb-4">Regístrate como donante aliado y accede a historial de donaciones, certificados tributarios y beneficios exclusivos.</p>
              <Link to="/registro?rol=donante">
                <Button variant="cta-static" size="default" className="w-full gap-2">Registrarme como Aliado <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-heading font-semibold text-foreground mb-3">Tu impacto importa</h3>
              <ul className="space-y-2 font-body text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><Heart className="w-4 h-4 text-primary mt-0.5 shrink-0" /><span>El 100% de tu donación se destina a proyectos sociales</span></li>
                <li className="flex items-start gap-2"><Heart className="w-4 h-4 text-primary mt-0.5 shrink-0" /><span>Recibirás confirmación por correo</span></li>
                <li className="flex items-start gap-2"><Heart className="w-4 h-4 text-primary mt-0.5 shrink-0" /><span>Transparencia total en el uso de los recursos</span></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Donar;
