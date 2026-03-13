import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, ChevronDown, Heart, User, LogOut } from 'lucide-react';
import logoFundacion from '@/assets/logo-fundacion.png';

const navLinks = [
  { label: 'Inicio',         path: '/' },
  { label: 'Convocatorias',  path: '/convocatorias' },
  { label: 'Oportunidades',  path: '/oportunidades' },
  { label: 'Párchate',       path: '/parchate' },
];

const fundacionLinks = [
  { label: 'Quiénes somos', path: '/quienes-somos' },
  { label: 'Qué hacemos',   path: '/que-hacemos' },
  { label: 'Noticias',      path: '/noticias' },
  { label: 'Contacto',      path: '/contacto' },
];

const Navbar = () => {
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [fundacionOpen, setFundacionOpen] = useState(false);
  const [userMenuOpen,  setUserMenuOpen]  = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = () => {
    if (user?.role === 'admin')          return '/aliado';
    if (user?.role === 'donante_aliado') return '/aliado';
    return '/dashboard';
  };

  // Nombre a mostrar: usa el perfil guardado en AuthContext
  const nombreDisplay =
    user?.profile?.nombreDisplay ||
    user?.profile?.nombre        ||
    user?.profile?.razonSocial   ||
    user?.email?.split('@')[0]   ||
    'Mi cuenta';

  // Etiqueta de rol
  const rolLabel =
    user?.role === 'admin'          ? 'Administrador' :
    user?.role === 'donante_aliado' ? 'Aliado'        : 'Usuario';

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <nav className="section-container flex items-center justify-between h-16 md:h-20">

        {/* Logo — solo imagen, sin texto */}
        <Link to="/" className="flex items-center shrink-0">
          <img src={logoFundacion} alt="Fundación Julio C.H." className="h-16 md:h-20 w-auto" />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1 ml-6">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`px-3 py-2 rounded-md text-sm font-medium font-body transition-colors ${
                isActive(link.path)
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-muted'
              }`}>
              {link.label}
            </Link>
          ))}

          {/* Dropdown La Fundación */}
          <div className="relative">
            <button
              onClick={() => setFundacionOpen(!fundacionOpen)}
              onBlur={() => setTimeout(() => setFundacionOpen(false), 200)}
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium font-body transition-colors ${
                fundacionLinks.some(l => isActive(l.path))
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-muted'
              }`}>
              La Fundación
              <ChevronDown className={`w-4 h-4 transition-transform ${fundacionOpen ? 'rotate-180' : ''}`} />
            </button>
            {fundacionOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-card rounded-lg shadow-lg border border-border py-1 animate-fade-in">
                {fundacionLinks.map(link => (
                  <Link key={link.path} to={link.path}
                    className={`block px-4 py-2.5 text-sm font-body transition-colors ${
                      isActive(link.path)
                        ? 'text-primary bg-primary/5'
                        : 'text-foreground hover:bg-muted hover:text-primary'
                    }`}
                    onClick={() => setFundacionOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop acciones */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/donar">
            <Button variant="cta" size="default" className="gap-2">
              <Heart className="w-4 h-4" /> DONAR
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium font-body text-foreground hover:bg-muted transition-colors border border-border">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                {/* ✅ Nombre real del perfil */}
                <span className="max-w-[130px] truncate font-semibold">{nombreDisplay}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-card rounded-lg shadow-lg border border-border py-1 animate-fade-in">
                  <div className="px-4 py-2 border-b border-border mb-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      {rolLabel}
                    </p>
                    <p className="text-xs font-body text-foreground truncate mt-0.5">{nombreDisplay}</p>
                  </div>
                  <Link to={getDashboardPath()}
                    className="block px-4 py-2.5 text-sm font-body text-foreground hover:bg-muted hover:text-primary"
                    onClick={() => setUserMenuOpen(false)}>
                    Ir al Panel
                  </Link>
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-body text-destructive hover:bg-muted flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline-primary" size="default">Iniciar Sesión</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <Link to="/donar">
            <Button variant="cta" size="sm" className="gap-1">
              <Heart className="w-3 h-3" /> DONAR
            </Button>
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-foreground">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-fade-in">
          <div className="section-container py-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path}
                className={`block px-4 py-3 rounded-md text-sm font-medium font-body ${
                  isActive(link.path) ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
                }`}
                onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border pt-2 mt-2">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                La Fundación
              </p>
              {fundacionLinks.map(link => (
                <Link key={link.path} to={link.path}
                  className={`block px-4 py-3 rounded-md text-sm font-body ${
                    isActive(link.path) ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-border pt-3 mt-2">
              {isAuthenticated ? (
                <>
                  {/* Nombre en móvil */}
                  <div className="px-4 py-2 mb-1">
                    <p className="text-xs text-muted-foreground">{rolLabel}</p>
                    <p className="text-sm font-semibold text-foreground truncate">{nombreDisplay}</p>
                  </div>
                  <Link to={getDashboardPath()}
                    className="block px-4 py-3 rounded-md text-sm font-body text-foreground hover:bg-muted"
                    onClick={() => setMobileOpen(false)}>
                    Mi Panel
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-md text-sm font-body text-destructive hover:bg-muted">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline-primary" className="w-full">Iniciar Sesión</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
