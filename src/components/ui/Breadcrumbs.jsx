import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames = {
  '': 'Inicio',
  'convocatorias': 'Convocatorias',
  'oportunidades': 'Oportunidades',
  'parchate': 'Párchate',
  'quienes-somos': 'Quiénes somos',
  'que-hacemos': 'Qué hacemos',
  'noticias': 'Noticias',
  'contacto': 'Contacto',
  'donar': 'Donar',
  'login': 'Iniciar Sesión',
  'registro': 'Registro',
  'dashboard': 'Dashboard',
};

const Breadcrumbs = () => {
  const location = useLocation();
  
  // Obtenemos los segmentos de la URL (ej: /dashboard/perfil -> ['dashboard', 'perfil'])
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Si estamos en el home ('/'), no mostramos breadcrumbs
  if (pathSegments.length === 0) return null;

  return (
    <nav aria-label="Migas de pan" className="section-container py-3">
      <ol className="flex items-center gap-1 text-sm font-body text-muted-foreground flex-wrap">
        {/* Siempre mostramos el enlace al Inicio */}
        <li>
          <Link 
            to="/" 
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
        </li>

        {pathSegments.map((segment, i) => {
          const path = '/' + pathSegments.slice(0, i + 1).join('/');
          const isLast = i === pathSegments.length - 1;
          const name = routeNames[segment] || decodeURIComponent(segment);

          return (
            <li key={path} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3" />
              {isLast ? (
                <span className="text-foreground font-medium">{name}</span>
              ) : (
                <Link to={path} className="hover:text-primary transition-colors">
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;