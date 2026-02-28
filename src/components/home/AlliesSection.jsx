import { aliados } from '@/data/mockData';

const AlliesSection = () => {
  const doubled = [...aliados, ...aliados];
  return (
    <section className="section-padding overflow-hidden">
      <div className="section-container mb-10">
        <div className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Nuestros Aliados</h2>
          <p className="font-body text-muted-foreground">Organizaciones que creen en el desarrollo del Suroeste.</p>
        </div>
      </div>
      <div className="relative w-full">
        <div className="flex gap-12 md:gap-16 animate-marquee w-max">
          {doubled.map((a, i) => (
            <a key={`${a.id}-${i}`} href={a.url} className="flex flex-col items-center gap-2 shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300" target="_blank" rel="noopener noreferrer">
              <span className="text-5xl md:text-6xl">{a.logo}</span>
              <span className="font-body text-xs text-muted-foreground text-center whitespace-nowrap">{a.nombre}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlliesSection;
