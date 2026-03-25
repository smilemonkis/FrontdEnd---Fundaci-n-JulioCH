// src/components/home/AlliesSection.jsx
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

const AlliesSection = () => {
  const [aliados, setAliados] = useState([]);

  useEffect(() => {
    api.get('/aliados-destacados')
      .then(res => { if (res.data?.length > 0) setAliados(res.data); })
      .catch(() => {});
  }, []);

  if (aliados.length === 0) return null;

  const doubled = [...aliados, ...aliados];

  return (
    <section className="bg-white py-14 overflow-hidden">
      <div className="section-container mb-10">
        <div className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Nuestros Aliados</h2>
          <p className="font-body text-muted-foreground">Organizaciones que creen en el desarrollo del Suroeste.</p>
        </div>
      </div>

      <div className="relative w-full">
        <div className="flex gap-16 md:gap-24 animate-marquee w-max items-center">
          {doubled.map((a, i) => {
            const img = (
              <img
                src={a.logoUrl}
                alt={a.nombre}
                className="h-14 md:h-16 w-auto max-w-[140px] object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
              />
            );

            return a.sitioWeb ? (
              <a
                key={`${a.id}-${i}`}
                href={a.sitioWeb}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center"
                title={a.nombre}
              >
                {img}
              </a>
            ) : (
              <div key={`${a.id}-${i}`} className="shrink-0 flex items-center" title={a.nombre}>
                {img}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AlliesSection;
