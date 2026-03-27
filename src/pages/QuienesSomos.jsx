import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Target, Globe, Mountain, Handshake, Lightbulb, Users } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import MetricsSection from '@/components/home/MetricsSection';
import nosotrosMision from '@/assets/nosotros-mision.jpg';
import nosotrosVision from '@/assets/nosotros-vision.jpg';

const pilares = [
  { icon: Mountain,  title: 'Formación Con Sentido Para El Territorio',  desc: 'Actuamos desde y para el Suroeste Antioqueño. Reconocemos su diversidad, su riqueza cultural y su potencial humano. Trabajamos con las comunidades, entendiendo sus realidades, para construir soluciones que respondan a sus verdaderas necesidades.' },
  { icon: Handshake, title: 'Alianzas Colaborativas y Estratégicas',       desc: 'Nuestra estrategia se sostiene en alianzas con instituciones públicas, privadas y académicas que comparten nuestro propósito de fomentar la educación. Estas sinergias permiten ampliar el impacto y garantizar sostenibilidad.' },
  { icon: Globe,     title: 'Educación Con Enfoque Diferencial',            desc: 'Trabajamos con un enfoque que reconoce la diversidad cultural, étnica, territorial y de género, adaptando nuestras acciones para garantizar que cada persona pueda aprender, participar y desarrollarse desde su identidad.' },
  { icon: Lightbulb, title: 'Innovación y Transformación Educativa',        desc: 'Promovemos metodologías flexibles, el uso de tecnologías, la formación en contextos híbridos y la articulación entre educación y productividad para innovar en la manera de enseñar, aprender y conectar el conocimiento con la vida.' },
];

// ── EDITAR EQUIPO AQUÍ ────────────────────────────────────────────────────────
// Para agregar: añade un objeto { nombre: '...', foto: 'URL_de_cloudinary' }
// Para quitar:  borra el objeto
// Para cambiar foto: reemplaza la URL. Si no tiene foto aún, pon foto: ''
// ─────────────────────────────────────────────────────────────────────────────
const consejo = [
  { nombre: 'Mercedes Hernández De Bedout',    foto: '' },
  { nombre: 'Rodrigo Puyo Vasco',              foto: '' },
  { nombre: 'David Duque Brumbaugh',           foto: '' },
  { nombre: 'Alfredo Tamayo Jaramillo',        foto: '' },
  { nombre: 'Luis Miguel De Bedout Hernández', foto: '' },
];

const equipo = [
  { nombre: 'Ana María Ramirez Carmona',      foto: '' },
  { nombre: 'Marlly Alejandra Montaño Gaviria', foto: '' },
];
// ─────────────────────────────────────────────────────────────────────────────

const Avatar = ({ nombre, foto, color = 'primary' }) => (
  <div className="text-center">
    <div className={`w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden border-2 border-${color}/20 shadow-sm`}>
      {foto
        ? <img src={foto} alt={nombre} className="w-full h-full object-cover" loading="lazy" />
        : <div className={`w-full h-full bg-${color}/10 flex items-center justify-center`}>
            <Users className={`w-9 h-9 text-${color}/50`} />
          </div>
      }
    </div>
    <p className="font-body text-sm font-medium text-foreground leading-tight max-w-[110px] mx-auto">{nombre}</p>
  </div>
);

const QuienesSomos = () => {
  return (
    <main>
      <Breadcrumbs />

      {/* Intro */}
      <section className="section-container section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary mb-6">¿Quiénes somos?</h1>
          <p className="font-body text-lg text-muted-foreground leading-relaxed mb-4">
            Somos una entidad privada sin ánimo de lucro que, inspirada en el legado de{' '}
            <strong className="text-foreground">don Julio C. Hernández Fernández</strong> y en el trabajo continuo de su hermano{' '}
            <strong className="text-foreground">Sergio Hernández</strong>, promueve el acceso a la educación como camino hacia el desarrollo humano, la equidad y la movilidad social.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed mb-4">
            Nacimos del compromiso de una familia y de un territorio con la educación. Desde entonces, hemos enfocado nuestros esfuerzos en brindar{' '}
            <strong className="text-foreground">oportunidades reales de formación</strong>, especialmente a jóvenes y adultos del{' '}
            <strong className="text-foreground">Suroeste Antioqueño</strong>, que buscan construir un mejor futuro a través del conocimiento.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed">
            Creemos en el poder de la unión entre aliados, instituciones y comunidad, porque solo trabajando juntos podemos abrir más puertas a quienes sueñan con estudiar y progresar. Por eso, cada uno de nuestros programas y proyectos está diseñado para{' '}
            <strong className="text-foreground">acompañar, fortalecer y transformar</strong>.
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="bg-primary/5">
        <div className="section-container py-16 md:py-24 space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Target className="w-6 h-6 text-primary" /></div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary">Misión</h2>
              </div>
              <p className="font-body text-muted-foreground leading-relaxed mb-3">Nuestra misión es realizar obras, a partir de la educación, para mejorar las condiciones de vida de las personas.</p>
              <p className="font-body text-muted-foreground leading-relaxed">Dando oportunidades e incentivando a niños, jóvenes y adultos para que se forjen un mejor futuro desde la academia.</p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src={nosotrosMision} alt="Misión" className="w-full h-72 md:h-80 object-cover" loading="lazy" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-lg">
              <img src={nosotrosVision} alt="Visión" className="w-full h-72 md:h-80 object-cover" loading="lazy" />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center"><Globe className="w-6 h-6 text-secondary" /></div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-secondary">Visión</h2>
              </div>
              <p className="font-body text-muted-foreground leading-relaxed">
                Nos proyectamos como una institución coadyuvante en el proceso educativo de{' '}
                <strong className="text-foreground">Medellín y de Colombia</strong>, que trascenderá en el tiempo mediante la realización de obras de educación para fortalecer y mejorar la calidad de vida de las comunidades más necesitadas del país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="section-container section-padding">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground mb-3">Nuestra Estrategia</h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Parte de una convicción: <strong className="text-foreground">la educación es el camino más sólido hacia la transformación social</strong>. Basamos nuestro actuar en cuatro pilares:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {pilares.map((p, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><p.icon className="w-5 h-5 text-primary" /></div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{p.title}</h3>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <MetricsSection />

      {/* Equipo */}
      <section className="section-container section-padding">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-foreground mb-3">Nuestro Equipo</h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">Alcanzar nuestros objetivos requiere de un equipo comprometido. ¡Un gusto, somos el equipo Julio C. H. Fundación!</p>
        </div>

        {/* Consejo */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="font-heading text-xl font-bold text-foreground mb-8 text-center">Consejo de Dirección</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
            {consejo.map(p => <Avatar key={p.nombre} nombre={p.nombre} foto={p.foto} color="primary" />)}
          </div>
        </div>

        {/* Equipo administrativo */}
        <div className="max-w-4xl mx-auto">
          <h3 className="font-heading text-xl font-bold text-foreground mb-8 text-center">Equipo Administrativo</h3>
          <div className="flex justify-center gap-10 flex-wrap">
            {equipo.map(p => <Avatar key={p.nombre} nombre={p.nombre} foto={p.foto} color="secondary" />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary">
        <div className="section-container py-16 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-4">¿Quieres ser parte del cambio?</h2>
          <p className="font-body text-primary-foreground/80 mb-8 max-w-lg mx-auto">Únete como aliado o dona para transformar el Suroeste Antioqueño.</p>
          <div className="flex justify-center gap-3">
            <Link to="/donar"><Button variant="cta-static" size="lg" className="gap-2"><Heart className="w-4 h-4" /> Donar</Button></Link>
            <Link to="/contacto"><Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">Contáctanos</Button></Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default QuienesSomos;
