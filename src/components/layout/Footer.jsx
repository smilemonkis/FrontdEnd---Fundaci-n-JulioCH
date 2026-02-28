import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import logoFundacion from '@/assets/logo-fundacion.png';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <img src={logoFundacion} alt="Fundación Julio C.H." className="h-20 w-auto" />
            </div>
            <p className="text-sm opacity-70 font-body leading-relaxed">Transformamos el Suroeste Antioqueño a través de formación, empleo, cultura y comunidad.</p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Navegación</h4>
            <ul className="space-y-2 font-body text-sm opacity-80">
              <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link to="/convocatorias" className="hover:text-primary transition-colors">Convocatorias</Link></li>
              <li><Link to="/oportunidades" className="hover:text-primary transition-colors">Oportunidades</Link></li>
              <li><Link to="/parchate" className="hover:text-primary transition-colors">Párchate</Link></li>
              <li><Link to="/noticias" className="hover:text-primary transition-colors">Noticias</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">La Fundación</h4>
            <ul className="space-y-2 font-body text-sm opacity-80">
              <li><Link to="/quienes-somos" className="hover:text-primary transition-colors">Quiénes somos</Link></li>
              <li><Link to="/que-hacemos" className="hover:text-primary transition-colors">Qué hacemos</Link></li>
              <li><Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link to="/donar" className="hover:text-primary transition-colors flex items-center gap-1"><Heart className="w-3 h-3" /> Donar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3 font-body text-sm opacity-80">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> Suroeste Antioqueño, Colombia</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" /> +57 (604) 123 4567</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" /> info@fundacionfomento.org</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-50 font-body">© 2026 Fundación Fomento. Todos los derechos reservados.</p>
          <div className="flex gap-4 text-xs opacity-50 font-body">
            <a href="#" className="hover:opacity-100 transition-opacity">Política de privacidad</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Términos de uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
