import { metricas } from '@/data/mockData';
import { Users, FolderOpen, MapPin, Handshake } from 'lucide-react';

const iconMap = { Users, FolderOpen, MapPin, Handshake };

const MetricsSection = () => {
  return (
    <section className="gradient-primary py-16">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metricas.map((m, i) => {
            const Icon = iconMap[m.icono] || Users;
            return (
              <div key={i} className="text-center">
                <Icon className="w-8 h-8 text-primary-foreground/80 mx-auto mb-2" />
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-1">{m.valor}</div>
                <div className="font-body text-sm text-primary-foreground/70">{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;
