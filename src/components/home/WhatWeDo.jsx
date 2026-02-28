import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, Heart, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

const blocks = [
  { icon: GraduationCap, titulo: "Formación", descripcion: "Convocatorias y programas educativos para el desarrollo de tu talento.", link: "/convocatorias", color: "bg-primary/10 text-primary" },
  { icon: Briefcase, titulo: "Empleo", descripcion: "Oportunidades laborales y emprendimiento en la región.", link: "/oportunidades", color: "bg-secondary/10 text-secondary" },
  { icon: Heart, titulo: "Sé Parte", descripcion: "Dona y contribuye al desarrollo social del Suroeste.", link: "/donar", color: "bg-cta/10 text-cta" },
  { icon: Music, titulo: "Párchate", descripcion: "Actividades recreativas, culturales y turísticas.", link: "/parchate", color: "bg-accent/10 text-accent" },
];

const WhatWeDo = () => {
  return (
    <section className="section-padding gradient-earth">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">¿Qué hacemos?</h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">Trabajamos por el desarrollo integral del Suroeste Antioqueño desde cuatro ejes fundamentales.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blocks.map((b, i) => (
            <div key={i} className="bg-card rounded-xl p-6 card-hover border border-border text-center group flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl ${b.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}><b.icon className="w-8 h-8" /></div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{b.titulo}</h3>
              <p className="font-body text-sm text-muted-foreground mb-4 flex-1">{b.descripcion}</p>
              <Link to={b.link} className="mt-auto"><Button variant="outline-primary" size="sm">Explorar</Button></Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
