import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import loginHero from '@/assets/login-hero.jpg';
import logoFundacion from '@/assets/logo-fundacion.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
const destino = 
  result.role === 'admin'          ? '/admin'     :
  result.role === 'donante_aliado' ? '/aliado'    : '/dashboard';
navigate(destino, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors';

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col justify-center px-6 sm:px-12 lg:px-14 py-12 bg-background relative z-10">
        <Link to="/" className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>
        <div className="max-w-sm mx-auto w-full">
          <Link to="/" className="inline-flex items-center gap-3 mb-10">
            <img src={logoFundacion} alt="Fundación Julio C. Hernández" className="h-10 w-auto" />
            <span className="font-heading text-sm font-bold text-foreground leading-tight">Fundación<br />Julio C. Hernández</span>
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">Aquí empezamos a transformar el Suroeste Antioqueño</h1>
          <p className="font-body text-muted-foreground mb-8">Inicia sesión para continuar</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-destructive/10 text-destructive text-sm font-body p-3 rounded-lg">{error}</div>}
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-1.5">Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@correo.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className={`${inputClass} pr-10`} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="default" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Button>
            <p className="text-center text-sm font-body text-muted-foreground">
              ¿No tienes cuenta?{' '}<Link to="/registro" className="text-primary hover:underline font-medium">Regístrate</Link>
            </p>
          </form>
        </div>
      </div>
      <div className="hidden lg:block flex-1 relative">
        <img src={loginHero} alt="Suroeste Antioqueño – montañas y pueblo" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <p className="font-heading text-2xl xl:text-3xl font-bold text-background leading-tight">Formación, empleo y cultura<br />para nuestra comunidad</p>
        </div>
      </div>
    </div>
  );
};

export default Login;