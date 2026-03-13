import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import loginHero from '@/assets/login-hero.jpg';
import logoFundacion from '@/assets/logo-fundacion.png';

const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false); // ← estado de éxito
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // ✅ Mostrar pantalla de bienvenida brevemente antes de redirigir
      setSuccess(true);
      const destino =
        result.role === 'admin'          ? '/admin'  :
        result.role === 'donante_aliado' ? '/aliado' : '/dashboard';
      setTimeout(() => navigate(destino, { replace: true }), 1200);
    } else {
      setError(result.message);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors';

  // ── Pantalla de éxito ────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">¡Bienvenido!</h2>
          <p className="font-body text-muted-foreground text-sm">Redirigiendo a tu panel...</p>
          <Loader2 className="w-5 h-5 animate-spin text-primary mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      {/* Panel izquierdo */}
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col px-6 sm:px-12 lg:px-14 py-6 bg-background relative z-10 overflow-y-auto">

        <Link to="/"
          className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <div className="max-w-sm mx-auto w-full flex flex-col justify-center flex-1">
          <Link to="/" className="inline-flex items-center mb-10">
            <img src={logoFundacion} alt="Fundación Julio C. Hernández" className="h-14 w-auto" />
          </Link>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
            Aquí empezamos a transformar el Suroeste Antioqueño
          </h1>
          <p className="font-body text-muted-foreground mb-8">Inicia sesión para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-body p-3 rounded-lg flex items-start gap-2">
                <span className="mt-0.5 shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-1.5">
                Correo electrónico
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="tu@correo.com"
                className={inputClass}
                disabled={loading} />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  required placeholder="••••••••"
                  className={`${inputClass} pr-10`}
                  disabled={loading} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="default" size="lg" className="w-full gap-2" disabled={loading}>
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</>
                : 'Iniciar Sesión'}
            </Button>

            <p className="text-center text-sm font-body text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-primary hover:underline font-medium">Regístrate</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Panel derecho — imagen */}
      <div className="hidden lg:block flex-1 relative">
        <img src={loginHero} alt="Suroeste Antioqueño"
          className="absolute inset-0 w-full h-full object-cover" />
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

export default Login;
