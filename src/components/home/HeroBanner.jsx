import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroBanner1 from '@/assets/hero-banner-1.jpg';
import heroBanner2 from '@/assets/hero-banner-2.jpg';
import heroBanner3 from '@/assets/hero-banner-3.jpg';

const slides = [
  { imagen: heroBanner1, titulo: "Transformamos el Suroeste", subtitulo: "Formación, empleo y cultura para nuestra comunidad", ctaTexto: "Conoce más", ctaLink: "/quienes-somos" },
  { imagen: heroBanner2, titulo: "Educación que Transforma", subtitulo: "Abrimos convocatorias para el desarrollo de tu talento", ctaTexto: "Ver convocatorias", ctaLink: "/convocatorias" },
  { imagen: heroBanner3, titulo: "Comunidad y Cultura", subtitulo: "Celebramos la riqueza del Suroeste Antioqueño", ctaTexto: "Párchate", ctaLink: "/parchate" },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
      {slides.map((slide, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
          <img src={slide.imagen} alt={slide.titulo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        </div>
      ))}
      <div className="absolute inset-0 z-10 flex items-end pb-16 md:pb-24">
        <div className="section-container w-full">
          <div className="max-w-2xl animate-slide-in">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-4">{slides[current].titulo}</h1>
            <p className="font-body text-lg md:text-xl text-background/80 mb-6">{slides[current].subtitulo}</p>
            <Link to={slides[current].ctaLink}><Button variant="default" size="lg">{slides[current].ctaTexto}</Button></Link>
          </div>
        </div>
      </div>
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 flex items-center justify-center transition-colors" aria-label="Anterior"><ChevronLeft className="w-5 h-5 text-background" /></button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 flex items-center justify-center transition-colors" aria-label="Siguiente"><ChevronRight className="w-5 h-5 text-background" /></button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-primary w-8' : 'bg-background/50'}`} aria-label={`Ir a slide ${i + 1}`} />))}
      </div>
    </section>
  );
};

export default HeroBanner;
