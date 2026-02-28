import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Shield, CreditCard, ArrowRight, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { proyectos } from '@/data/mockData';
import heroBanner from '@/assets/hero-banner-2.jpg';

const montosConImpacto = [
  { valor: '30000', label: '$30.000', impacto: 'Kit escolar para un niño en zona rural' },
  { valor: '50000', label: '$50.000', impacto: 'Una semana de refuerzo educativo para un joven' },
  { valor: '100000', label: '$100.000', impacto: 'Formación técnica para acceso al empleo' },
];

const Donar = () => {
  const { isAuthenticated } = useAuth();
  const [monto, setMonto] = useState('');
  const [montoCustom, setMontoCustom] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [proyectoId, setProyectoId] = useState('');
  const [anonimo, setAnonimo] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSelectMonto = (valor) => {
    setMonto(valor);
    setMontoCustom('');
  };

  const handleCustomMonto = (val) => {
    setMontoCustom(val);
    setMonto('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main>
        <div className="section-container section-padding text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-3">¡Gracias por tu donación!</h1>
          <p className="font-body text-muted-foreground mb-6">Tu generosidad transforma vidas en el Suroeste Antioqueño.</p>
          <Link to="/"><Button variant="default">Volver al inicio</Button></Link>
        </div>
      </main>
    );
  }

  return (
    <main>
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
              <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Tu aportación como donante</h3>
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
              <input id="custom-monto" type="text" value={montoCustom} onChange={(e) => handleCustomMonto(e.target.value)}
                placeholder="Ingresa otra cantidad" className="w-full px-3 py-2 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-1">Destino de tu donación</label>
              <select value={proyectoId} onChange={(e) => setProyectoId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Libre inversión (donde más se necesite)</option>
                {proyectos.filter((p) => p.estado === 'activo').map((p) => (
                  <option key={p.id} value={p.id}>{p.titulo}</option>
                ))}
              </select>
            </div>

            {!isAuthenticated && (
              <>
                <h3 className="font-heading text-lg font-semibold text-foreground">Tus datos personales</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={anonimo} onChange={(e) => setAnonimo(e.target.checked)}
                    className="w-4 h-4 rounded border-input text-primary focus:ring-primary" />
                  <span className="text-sm font-body text-foreground">Donar de forma anónima</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-medium text-foreground mb-1">Nombre</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" disabled={anonimo}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium text-foreground mb-1">Correo electrónico</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" disabled={anonimo}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50" />
                  </div>
                </div>
              </>
            )}

            <Button variant="cta-static" size="xl" type="submit" className="w-full gap-2 text-base">
              <CreditCard className="w-5 h-5" /> Realizar donación
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
              <p className="font-body text-sm text-muted-foreground mb-4">Regístrate como donante aliado y accede a historial de donaciones, certificados tributarios, seguimiento del impacto de tus aportes y beneficios exclusivos.</p>
              <Link to="/registro?rol=donante">
                <Button variant="cta-static" size="default" className="w-full gap-2">Registrarme como Aliado <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-heading font-semibold text-foreground mb-3">Tu impacto importa</h3>
              <ul className="space-y-2 font-body text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><Heart className="w-4 h-4 text-primary mt-0.5 shrink-0" /><span>El 100% de tu donación se destina a proyectos sociales</span></li>
                <li className="flex items-start gap-2"><Heart className="w-4 h-4 text-primary mt-0.5 shrink-0" /><span>Recibe certificado de donación para beneficios tributarios</span></li>
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
