import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const SubscriptionBanner = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success('¡Te has suscrito exitosamente!');
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNnKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
      <div className="relative z-10 section-container text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/10 mb-6"><Mail className="w-7 h-7 text-primary-foreground" /></div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-3">Mantente informado</h2>
          <p className="font-body text-primary-foreground/80 mb-8 text-lg">Suscríbete y recibe en tu correo las noticias, convocatorias y eventos más relevantes del Suroeste Antioqueño.</p>
          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-primary-foreground animate-fade-in"><CheckCircle className="w-5 h-5" /><span className="font-body font-medium">¡Gracias por suscribirte!</span></div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input type="email" placeholder="Tu correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-primary-foreground/30" />
              <Button type="submit" variant="cta-static" size="lg" className="shrink-0">Suscribirme</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionBanner;
