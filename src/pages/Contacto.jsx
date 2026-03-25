// src/pages/Contacto.jsx
//
// ── CONFIGURACIÓN DE CORREO ──────────────────────────────────
// Para cambiar el correo de destino ve a emailjs.com:
// 1. Login → Email Services → conecta tu Gmail
// 2. Email Templates → crea plantilla con variables:
//    {{nombre}}, {{telefono}}, {{correo}}, {{mensaje}}
// 3. Copia los 3 IDs y reemplázalos abajo
// ─────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'TU_SERVICE_ID';   // ← reemplazar
const EMAILJS_TEMPLATE_ID = 'TU_TEMPLATE_ID';  // ← reemplazar
const EMAILJS_PUBLIC_KEY  = 'TU_PUBLIC_KEY';   // ← reemplazar
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Send, Loader2, CheckCircle2 } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import api from '@/lib/axios';

const Contacto = () => {
  const [form, setForm]       = useState({ nombre: '', telefono: '', correo: '', mensaje: '' });
  const [sent, setSent]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nombre.trim() || !form.correo.trim() || !form.mensaje.trim()) {
      setError('Nombre, correo y mensaje son obligatorios');
      return;
    }

    setSaving(true);
    try {
      // 1 — Guardar en BD
      await api.post('/contacto', {
        nombre:   form.nombre,
        telefono: form.telefono || null,
        correo:   form.correo,
        mensaje:  form.mensaje,
      });

      // 2 — Enviar correo via EmailJS (solo si están configurados los IDs)
      if (EMAILJS_SERVICE_ID !== 'TU_SERVICE_ID') {
        const emailjs = await import('@emailjs/browser');
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            nombre:   form.nombre,
            telefono: form.telefono || 'No proporcionado',
            correo:   form.correo,
            mensaje:  form.mensaje,
          },
          EMAILJS_PUBLIC_KEY
        );
      }

      setSent(true);
    } catch (err) {
      setError('Error enviando el mensaje. Intenta de nuevo.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <Breadcrumbs />
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">Contacto</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">¿Tienes preguntas? Escríbenos y te responderemos pronto.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mapa */}
          <div className="rounded-xl overflow-hidden border border-border h-80 lg:h-auto bg-muted">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46380831858!2d-76.08!3d5.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4682f93db0b4a1%3A0x3b7b3a2f8e22be4b!2sSuroeste%20Antioque%C3%B1o!5e0!3m2!1ses!2sco!4v1"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Ubicación Suroeste Antioqueño"
            />
          </div>

          <div>
            {sent ? (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-2">¡Mensaje enviado!</h2>
                <p className="font-body text-muted-foreground">Te contactaremos pronto a <strong>{form.correo}</strong>.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSent(false); setForm({ nombre: '', telefono: '', correo: '', mensaje: '' }); }}>
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Nombre *</label>
                  <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Teléfono</label>
                  <input type="tel" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Correo electrónico *</label>
                  <input type="email" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} required
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium text-foreground mb-1">Mensaje *</label>
                  <textarea value={form.mensaje} onChange={e => setForm({...form, mensaje: e.target.value})} required rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
                {error && <p className="text-sm text-destructive font-body">{error}</p>}
                <Button type="submit" variant="default" size="lg" className="w-full gap-2" disabled={saving}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : <><Send className="w-4 h-4" /> Enviar mensaje</>}
                </Button>
              </form>
            )}

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm font-body text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary shrink-0" /> Suroeste Antioqueño, Colombia
              </div>
              <div className="flex items-center gap-3 text-sm font-body text-muted-foreground">
                <Phone className="w-4 h-4 text-primary shrink-0" /> +57 (604) 123 4567
              </div>
              <div className="flex items-center gap-3 text-sm font-body text-muted-foreground">
                <Mail className="w-4 h-4 text-primary shrink-0" /> info@fundacionfomento.org
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contacto;
