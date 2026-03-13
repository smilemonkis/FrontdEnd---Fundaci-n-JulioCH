// src/pages/Registro.jsx
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Heart, Users, Building2, User, ArrowLeft, Eye, EyeOff, Info, ChevronDown } from 'lucide-react';
import loginHero from '@/assets/login-hero.jpg';
import logoFundacion from '@/assets/logo-fundacion.png';

const TIPO_DOC_OPTIONS = [
  { value: 'CC',        label: 'Cédula de Ciudadanía' },
  { value: 'TI',        label: 'Tarjeta de Identidad' },
  { value: 'CE',        label: 'Cédula de Extranjería' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
];

const INDICATIVOS = [
  { code: '+57',  flag: '🇨🇴', label: 'CO' },
  { code: '+1',   flag: '🇺🇸', label: 'US' },
  { code: '+58',  flag: '🇻🇪', label: 'VE' },
  { code: '+593', flag: '🇪🇨', label: 'EC' },
  { code: '+51',  flag: '🇵🇪', label: 'PE' },
  { code: '+52',  flag: '🇲🇽', label: 'MX' },
  { code: '+34',  flag: '🇪🇸', label: 'ES' },
];

// ── Validadores ──────────────────────────────────────────────
const soloLetras  = v => /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/.test(v.trim());
const soloNumeros = v => /^\d+$/.test(v.trim());
const emailValido = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const nitValido   = v => /^\d{6,12}(-\d)?$/.test(v.trim());

const Registro = () => {
  const [searchParams]   = useSearchParams();
  const preselectedRol   = searchParams.get('rol');

  const [step, setStep] = useState(
    preselectedRol === 'ciudadano' ? 'ciudadano-soon' :
    preselectedRol === 'donante'   ? 'choose-aliado-type' : 'choose-role'
  );
  const [tipoAliado, setTipoAliado] = useState('natural');

  // Campos comunes
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw,          setShowPw]          = useState(false);
  const [showConfirmPw,   setShowConfirmPw]   = useState(false);
  const [indicativo,      setIndicativo]      = useState('+57');
  const [telefonoNum,     setTelefonoNum]     = useState('');
  const [direccion,       setDireccion]       = useState('');

  // Persona natural
  const [nombre,          setNombre]          = useState('');
  const [apellido,        setApellido]        = useState('');
  const [tipoDocumento,   setTipoDocumento]   = useState('CC');
  const [documento,       setDocumento]       = useState('');

  // Persona jurídica
  const [nit,             setNit]             = useState('');
  const [razonSocial,     setRazonSocial]     = useState('');
  const [representante,   setRepresentante]   = useState('');

  const [errores,  setErrores]  = useState({});
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  // ── Navegación ───────────────────────────────────────────────
  const goBack = () => {
    setErrores({}); setError('');
    if (step === 'form')               setStep('choose-aliado-type');
    if (step === 'choose-aliado-type') setStep('choose-role');
    if (step === 'ciudadano-soon')     setStep('choose-role');
  };

  // ── Validación ───────────────────────────────────────────────
  const validar = () => {
    const e = {};

    if (tipoAliado === 'natural') {
      if (!nombre.trim())              e.nombre = 'El nombre es requerido';
      else if (!soloLetras(nombre))    e.nombre = 'Solo se permiten letras';
      if (!apellido.trim())            e.apellido = 'El apellido es requerido';
      else if (!soloLetras(apellido))  e.apellido = 'Solo se permiten letras';
      if (!documento.trim())                e.documento = 'El documento es requerido';
      else if (!soloNumeros(documento))     e.documento = 'Solo se permiten números';
    }

    if (tipoAliado === 'juridico') {
      if (!razonSocial.trim())              e.razonSocial = 'La razón social es requerida';
      if (!representante.trim())            e.representante = 'El representante es requerido';
      else if (!soloLetras(representante))  e.representante = 'Solo se permiten letras';
      if (!nit.trim())                      e.nit = 'El NIT es requerido';
      else if (!nitValido(nit))             e.nit = 'Formato inválido. Ej: 900123456-1';
    }

    if (!email.trim())            e.email = 'El correo es requerido';
    else if (!emailValido(email)) e.email = 'Correo electrónico inválido';

    if (!telefonoNum.trim())               e.telefono = 'El teléfono es requerido';
    else if (!soloNumeros(telefonoNum))    e.telefono = 'Solo números sin espacios';
    else if (telefonoNum.length < 7)       e.telefono = 'Mínimo 7 dígitos';

    if (!direccion.trim())                 e.direccion = 'La dirección es requerida';

    if (!password)                         e.password = 'La contraseña es requerida';
    else if (password.length < 8)          e.password = 'Mínimo 8 caracteres';
    else if (!/[A-Z]/.test(password))      e.password = 'Debe tener al menos una mayúscula';
    else if (!/\d/.test(password))         e.password = 'Debe tener al menos un número';

    if (!confirmPassword)                  e.confirmPassword = 'Confirma tu contraseña';
    else if (password !== confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  // ── Envío ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validar()) return;
    setLoading(true);

    const telefono = `${indicativo}${telefonoNum}`;

    const payload =
      tipoAliado === 'juridico'
        ? { email, password, telefono, direccion, nit, razonSocial, representante }
        : { email, password, telefono, direccion,
            nombre:        `${nombre} ${apellido}`.trim(),
            documento,
            tipoDocumento };

    const result = await register(payload, tipoAliado === 'juridico' ? 'JURIDICO' : 'NATURAL');
    setLoading(false);
    if (result.success) navigate('/login?registrado=true');
    else setError(result.message);
  };

  // ── Estilos ──────────────────────────────────────────────────
  const inputBase = 'w-full px-4 py-3 rounded-lg border font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors bg-background';
  const ic = (campo) => errores[campo]
    ? `${inputBase} border-destructive bg-destructive/5 focus:ring-destructive/30`
    : `${inputBase} border-input`;

  const FieldError = ({ campo }) =>
    errores[campo] ? <p className="text-xs text-destructive mt-1">{errores[campo]}</p> : null;

  // ── Selector de indicativo ───────────────────────────────────
  const TelefonoInput = () => (
    <div>
      <label className="block text-sm font-body font-medium mb-1">Teléfono *</label>
      <div className={`flex rounded-lg border overflow-hidden ${errores.telefono ? 'border-destructive' : 'border-input'}`}>
        <select
          value={indicativo}
          onChange={e => setIndicativo(e.target.value)}
          className="bg-muted px-2 py-3 text-sm font-body border-r border-input focus:outline-none shrink-0"
        >
          {INDICATIVOS.map(i => (
            <option key={i.code} value={i.code}>{i.flag} {i.code}</option>
          ))}
        </select>
        <input
          type="tel"
          value={telefonoNum}
          onChange={e => setTelefonoNum(e.target.value.replace(/\D/g, ''))}
          placeholder="300 811 8210"
          inputMode="numeric"
          maxLength={10}
          className="flex-1 px-3 py-3 text-sm font-body bg-background focus:outline-none"
        />
      </div>
      <FieldError campo="telefono" />
    </div>
  );

  return (
    <div className="min-h-screen flex">

      {/* Panel izquierdo */}
      <div className="w-full lg:w-[520px] xl:w-[560px] flex flex-col px-6 sm:px-12 lg:px-14 py-6 bg-background relative z-10 overflow-y-auto">

        {/* ← Volver — siempre arriba */}
        <div className="mb-4">
          {step === 'choose-role' ? (
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </Link>
          ) : (
            <button onClick={goBack} className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver atrás
            </button>
          )}
        </div>

        <div className="max-w-md mx-auto w-full">

          {/* Logo más grande — solo imagen */}
          <Link to="/" className="inline-flex items-center mb-8">
            <img src={logoFundacion} alt="Fundación" className="h-20 w-auto" />
          </Link>

          {/* ── PASO 1: elegir rol ── */}
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

          {/* ── PASO 2: natural o jurídico ── */}
          {step === 'choose-aliado-type' && (
            <div className="space-y-4">
              <p className="font-body text-sm text-muted-foreground mb-2">¿Qué tipo de aliado eres?</p>
              <button onClick={() => { setTipoAliado('natural'); setStep('form'); }}
                className="w-full bg-card rounded-xl border border-border p-5 text-left card-hover group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cta/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6 text-cta" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Soy una Persona</h3>
                    <p className="font-body text-sm text-muted-foreground">Persona Natural</p>
                  </div>
                </div>
              </button>
              <button onClick={() => { setTipoAliado('juridico'); setStep('form'); }}
                className="w-full bg-card rounded-xl border border-border p-5 text-left card-hover group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Soy una Empresa</h3>
                    <p className="font-body text-sm text-muted-foreground">Persona Jurídica</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* ── PASO 3: formulario ── */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-body font-medium rounded-full bg-cta/10 text-cta">
                  {tipoAliado === 'natural' ? '👤 Persona Natural' : '🏢 Persona Jurídica'}
                </span>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm font-body p-3 rounded-lg">{error}</div>
              )}

              {/* ─ Persona Natural ─ */}
              {tipoAliado === 'natural' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1">Nombre *</label>
                      <input type="text" value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        placeholder="Ej: María"
                        className={ic('nombre')} />
                      <FieldError campo="nombre" />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1">Apellido *</label>
                      <input type="text" value={apellido}
                        onChange={e => setApellido(e.target.value)}
                        placeholder="Ej: García"
                        className={ic('apellido')} />
                      <FieldError campo="apellido" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1">Tipo de Documento *</label>
                    <select value={tipoDocumento} onChange={e => setTipoDocumento(e.target.value)}
                      className={ic('tipoDocumento')}>
                      {TIPO_DOC_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1">Número de Documento *</label>
                    <input type="text" value={documento}
                      onChange={e => setDocumento(e.target.value.replace(/\D/g, ''))}
                      placeholder="Solo números"
                      inputMode="numeric"
                      maxLength={12}
                      className={ic('documento')} />
                    <FieldError campo="documento" />
                  </div>
                </>
              )}

              {/* ─ Persona Jurídica ─ */}
              {tipoAliado === 'juridico' && (
                <>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1">Razón Social *</label>
                    <input type="text" value={razonSocial}
                      onChange={e => setRazonSocial(e.target.value)}
                      placeholder="Nombre de la empresa"
                      className={ic('razonSocial')} />
                    <FieldError campo="razonSocial" />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1">NIT *</label>
                    <input type="text" value={nit}
                      onChange={e => setNit(e.target.value)}
                      placeholder="Ej: 900123456-1"
                      className={ic('nit')} />
                    <FieldError campo="nit" />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1">Representante Legal *</label>
                    <input type="text" value={representante}
                      onChange={e => setRepresentante(e.target.value)}
                      placeholder="Nombre completo"
                      className={ic('representante')} />
                    <FieldError campo="representante" />
                  </div>
                </>
              )}

              {/* ─ Campos comunes ─ */}
              <div>
                <label className="block text-sm font-body font-medium mb-1">Correo electrónico *</label>
                <input type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className={ic('email')} autoComplete="off" />
                <FieldError campo="email" />
              </div>

              <TelefonoInput />

              <div>
                <label className="block text-sm font-body font-medium mb-1">Dirección *</label>
                <input type="text" value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  placeholder="Ej: Calle 5 # 12-34, Jardín, Antioquia"
                  className={ic('direccion')} />
                <FieldError campo="direccion" />
              </div>

              {/* ─ Contraseña ─ */}
              <div>
                <label className="block text-sm font-body font-medium mb-1">Contraseña *</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                    className={`${ic('password')} pr-10`}
                    autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <FieldError campo="password" />
              </div>

              <div>
                <label className="block text-sm font-body font-medium mb-1">Confirmar Contraseña *</label>
                <div className="relative">
                  <input type={showConfirmPw ? 'text' : 'password'} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className={`${ic('confirmPassword')} pr-10`}
                    autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <FieldError campo="confirmPassword" />
                {confirmPassword && (
                  <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-primary' : 'text-destructive'}`}>
                    {password === confirmPassword ? '✓ Las contraseñas coinciden' : '✗ No coinciden'}
                  </p>
                )}
              </div>

              <Button type="submit" variant="default" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarme'}
              </Button>

              <p className="text-center text-sm font-body text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">Inicia sesión</Link>
              </p>
            </form>
          )}

          {/* ── Ciudadano próximamente ── */}
          {step === 'ciudadano-soon' && (
            <div className="bg-card rounded-xl border border-border p-8 text-center space-y-4">
              <Info className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-heading text-xl font-bold">¡Próximamente!</h3>
              <p className="text-sm text-muted-foreground">El registro como ciudadano estará disponible pronto.</p>
            </div>
          )}
        </div>
      </div>

      {/* Panel derecho — imagen */}
      <div className="hidden lg:block flex-1 relative">
        <img src={loginHero} alt="Suroeste" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <p className="font-heading text-2xl xl:text-3xl font-bold text-background leading-tight">
            Formación, empleo y cultura<br />para nuestra comunidad
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
