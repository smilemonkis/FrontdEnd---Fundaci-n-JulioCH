// src/pages/aliado/AliadoLegal.jsx
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Loader2, FileText, Download, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TIPOS = {
  PDF:   { label: 'PDF',          color: 'bg-red-500/15 text-red-600 border-0' },
  Word:  { label: 'Word',         color: 'bg-blue-500/15 text-blue-600 border-0' },
  Drive: { label: 'Google Drive', color: 'bg-yellow-500/15 text-yellow-700 border-0' },
  Link:  { label: 'Enlace',       color: 'bg-muted text-muted-foreground border-0' },
};

const AliadoLegal = () => {
  const [docs, setDocs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/legal')
      .then(res => setDocs(res.data || []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Documentos Legales</h1>
        <p className="font-body text-muted-foreground text-sm">Documentos oficiales de la Fundación Julio C.H.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : docs.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-body text-muted-foreground">No hay documentos disponibles por ahora.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {docs.map(d => {
            const tipo = TIPOS[d.tipo] || TIPOS.Link;
            return (
              <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer"
                className="bg-card rounded-xl border border-border flex items-center gap-4 p-4 hover:border-primary/50 hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">{d.nombre}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {d.createdAt ? `Agregado el ${new Date(d.createdAt).toLocaleDateString('es-CO')}` : ''}
                  </p>
                </div>
                <Badge className={tipo.color}>{tipo.label}</Badge>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AliadoLegal;
