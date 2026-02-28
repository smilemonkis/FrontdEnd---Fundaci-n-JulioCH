// src/pages/Registro.jsx
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Heart, Users, Building2, User, ArrowLeft, Info } from 'lucide-react';
import loginHero from '@/assets/login-hero.jpg';
import logoFundacion from '@/assets/logo-fundacion.png';

const TIPO_DOC_OPTIONS = [
  { value: 'CC',        label: 'Cédula de Ciudadanía' },
  { value: 'TI',        label: 'Tarjeta de Identidad' },
  { value: 'CE',        label: 'Cédula de Extranjería' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
];

const Registro = () => {
  const [searchParams] = useSearchParams();
  const preselectedRol = searchParams.get('rol');

  const [step, setStep] = useState(
    preselectedRol === 'ciudadano' ? 'ciudadano-soon' :
    preselectedRol === 'donante'   ? 'choose-aliado-type' : 'choose-role'
  );
  const [tipoAliado, setTipoAliado] = useState('natural');

  // Campos comunes
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  // Aliado Natural
  const [nombre,          setNombre]          = useState('');
  const [apellido,        setApellido]        = useState(''); // solo para UX, se concatena al enviar
  const [tipoDocumento,   setTipoDocumento]   = useState('CC');
  const [numeroDocumento, setNumeroDocumento] = useState('');

  // Aliado Jurídico
  const [nit,                setNit]                = useState('');
  const [razonSocial,        setRazonSocial]        = useState('');
  const [representanteLegal, setRepresentanteLegal] = useState('');

  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChooseAliadoType = (t) => { setTipoAliado(t); setStep('form'); };

  const goBack = () => {
    if (step === 'form') setStep('choose-aliado-type');
    if (step === 'choose-aliado-type' || step === 'ciudadano-soon') setStep('choose-role');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ✅ apellido no existe en CreateAliadoNaturalRequest
    // lo concatenamos al nombre antes de enviar
    const payload =
      tipoAliado === 'juridico'
        ? { email, password, telefono, direccion, nit, razonSocial, representanteLegal }
        : { email, password, telefono, direccion,
            nombre,   // AuthContext concatena nombre + apellido
            apellido, // AuthContext lo recibe y concatena
            documento:      numeroDocumento,
            tipo_documento: tipoDocumento };

    const result = await register(payload, tipoAliado === 'juridico' ? 'JURIDICO' : 'NATURAL');
    setLoading(false);

    if (result.success) {
      navigate('/login?registrado=true');
    } else {
      setError(result.message);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors';

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-[520px] xl:w-[560px] flex flex-col justify-center px-6 sm:px-12 lg:px-14 py-10 bg-background relative z-10 overflow-y-auto max-h-screen">
        <div className="max-w-md mx-auto w-full">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <img src={logoFundacion} alt="Fundación" className="h-10 w-auto" />
            <span className="font-heading text-sm font-bold text-foreground leading-tight">
              Fundación<br />Julio C. Hernández
            </span>
          </Link>

          {/* PASO 1: elegir rol */}
          {step === 'choose-role' && (
            <>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-1">
                ¿Cómo quieres participar?
              </h1>
              <p className="font-body text-muted-foreground mb-6 text-sm">Elige tu rol para comenzar</p>
              <div className="space-y-4">
                <button onClick={() => setStep('choose-aliado-type')}
                  className="w-full bg-card rounded-xl border border-border p-5 text-left card-hover group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cta/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Heart className="w-6 h-6 text-cta" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">Como Aliado</h3>
                      <p className="font-body text-sm text-muted-foreground">Dona y apoya proyectos</p>
                    </div>
                  </div>
                </button>
                <button onClick={() => setStep('ciudadano-soon')}
                  className="w-full bg-card rounded-xl border border-border p-5 text-left card-hover group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">Como Ciudadano</h3>
                      <p className="font-body text-sm text-muted-foreground">Accede a convocatorias</p>
                    </div>
                  </div>
                </button>
              </div>
            </>
          )}

          {/* PASO 2: natural o jurídico */}
          {step === 'choose-aliado-type' && (
            <div className="space-y-4">
              <button onClick={goBack} className="flex items-center gap-1 text-sm font-body text-muted-foreground hover:text-primary mb-1">
                <ArrowLeft className="w-4 h-4" /> Volver
              </button>
              <p className="font-body text-sm text-muted-foreground mb-2">¿Qué tipo de aliado eres?</p>
              <button onClick={() => handleChooseAliadoType('natural')}
                className="w-full bg-card rounded-xl border border-border p-5 text-left card-hover group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cta/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6 text-cta" />
                  </div>
                  <div><h3 className="font-heading font-semibold text-foreground">Soy una Persona</h3></div>
                </div>
              </button>
              <button onClick={() => handleChooseAliadoType('juridico')}
                className="w-full bg-card rounded-xl border border-border p-5 text-left card-hover group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-secondary" />
                  </div>
                  <div><h3 className="font-heading font-semibold text-foreground">Soy una Empresa</h3></div>
                </div>
              </button>
            </div>
          )}

          {/* PASO 3: formulario */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 text-xs font-body font-medium rounded-full bg-cta/10 text-cta">
                  {tipoAliado === 'natural' ? '❤️ Aliado – Persona Natural' : '🏢 Aliado – Persona Jurídica'}
                </span>
                <button type="button" onClick={goBack}
                  className="text-xs font-body text-muted-foreground hover:text-primary flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Cambiar
                </button>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm font-body p-3 rounded-lg">{error}</div>
              )}

              {/* Campos Persona Natural */}
              {tipoAliado === 'natural' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1">Nombre</label>
                      <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                        required className={inputClass} />
                    </div>
                    <div>
                      {/* Apellido solo para UX — se concatena al nombre antes de enviar */}
                      <label className="block text-sm font-body font-medium mb-1">Apellido</label>
                      <input type="text" value={apellido} onChange={e => setApellido(e.target.value)}
                        className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1">Tipo Documento</label>
                    <select value={tipoDocumento} onChange={e => setTipoDocumento(e.target.value)}
                      className={inputClass}>
                      {TIPO_DOC_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1">Número Documento</label>
                    <input type="text" value={numeroDocumento} onChange={e => setNumeroDocumento(e.target.value)}
                      required className={inputClass} />
                  </div>
                </>
              )}

              {/* Campos Persona Jurídica */}
              {tipoAliado === 'juridico' && (
                <>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1">Razón Social</label>
                    <input type="text" value={razonSocial} onChange={e => setRazonSocial(e.target.value)}
                      required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1">NIT</label>
                    <input type="text" value={nit} onChange={e => setNit(e.target.value)}
                      required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1">Representante Legal</label>
                    <input type="text" value={representanteLegal} onChange={e => setRepresentanteLegal(e.target.value)}
                      required className={inputClass} />
                  </div>
                </>
              )}

              {/* Campos comunes */}
              <div>
                <label className="block text-sm font-body font-medium mb-1">Correo electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  required className={inputClass} autoComplete="off" />
              </div>
              <div>
                <label className="block text-sm font-body font-medium mb-1">Teléfono</label>
                <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
                  required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-body font-medium mb-1">Dirección</label>
                <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)}
                  required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-body font-medium mb-1">Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  required minLength={8} className={inputClass} autoComplete="new-password" />
              </div>

              <Button type="submit" variant="default" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarme'}
              </Button>
            </form>
          )}

          {/* Ciudadano: próximamente */}
          {step === 'ciudadano-soon' && (
            <div className="bg-card rounded-xl border border-border p-8 text-center space-y-4">
              <Info className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-heading text-xl font-bold">¡Próximamente!</h3>
              <p className="text-sm text-muted-foreground">El registro como ciudadano estará disponible pronto.</p>
              <Link to="/"><Button variant="default">Volver al inicio</Button></Link>
            </div>
          )}
        </div>
      </div>

      {/* Imagen lateral */}
      <div className="hidden lg:block flex-1 relative">
        <img src={loginHero} alt="Suroeste" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Registro;
