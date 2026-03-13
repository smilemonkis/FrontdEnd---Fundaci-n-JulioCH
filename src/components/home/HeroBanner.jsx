// src/components/home/HeroBanner.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

const ctaClass = (color) => {
  if (color === 'naranja') return 'bg-orange-500 hover:bg-orange-600 text-white';
  if (color === 'blanco')  return 'bg-white hover:bg-gray-100 text-gray-900';
  return 'bg-primary hover:bg-primary/90 text-primary-foreground';
};

const HeroBanner = () => {
  const [slides, setSlides]   = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/banners')
      .then(res => { if (res.data?.length > 0) setSlides(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  useEffect(() => { setCurrent(0); }, [slides]);

  if (loading) {
    return (
      <section className="relative w-full h-[60vh] md:h-[75vh] bg-muted flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative w-full h-[60vh] md:h-[75vh] bg-muted flex items-center justify-center">
        <p className="text-muted-foreground font-body">Próximamente...</p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
      {slides.map((slide, i) => (
        <div key={slide.id ?? i} className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
          <img src={slide.imagenUrl} alt={slide.titulo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 z-10 flex items-end pb-16 md:pb-24">
        <div className="section-container w-full">
          <div className="max-w-2xl animate-slide-in">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-4">
              {slides[current]?.titulo}
            </h1>
            <p className="font-body text-lg md:text-xl text-background/80 mb-6">
              {slides[current]?.subtitulo}
            </p>
            <Link to={slides[current]?.ctaLink || '/'}>
              <button className={`px-6 py-3 rounded-md font-medium text-base transition-colors ${ctaClass(slides[current]?.ctaColor)}`}>
                {slides[current]?.ctaTexto}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 flex items-center justify-center transition-colors" aria-label="Anterior">
            <ChevronLeft className="w-5 h-5 text-background" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 flex items-center justify-center transition-colors" aria-label="Siguiente">
            <ChevronRight className="w-5 h-5 text-background" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-3 rounded-full transition-all ${i === current ? 'bg-primary w-8' : 'w-3 bg-background/50'}`}
                aria-label={`Ir a slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroBanner;
