// src/pages/admin/AdminBanner.jsx
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Loader2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

const emptyForm = {
  titulo: '', subtitulo: '', imagenUrl: '',
  ctaTexto: '', ctaLink: '', orden: 0, activo: true,
};

const AdminBanner = () => {
  const [banners, setBanners]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/banners/admin');
      setBanners(res.data || []);
    } catch {
      toast.error('Error cargando banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, orden: banners.length });
    setDialogOpen(true);
  };

  const openEdit = (b) => {
    setEditing(b);
    setForm({
      titulo:    b.titulo,
      subtitulo: b.subtitulo,
      imagenUrl: b.imagenUrl,
      ctaTexto:  b.ctaTexto,
      ctaLink:   b.ctaLink,
      orden:     b.orden,
      activo:    b.activo,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.titulo || !form.subtitulo || !form.imagenUrl || !form.ctaTexto || !form.ctaLink) {
      toast.error('Completa todos los campos obligatorios');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/banners/${editing.id}`, form);
        toast.success('Banner actualizado');
      } else {
        await api.post('/banners', form);
        toast.success('Banner creado');
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error guardando banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/banners/${deleteId}`);
      toast.success('Banner eliminado');
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error eliminando banner');
    }
  };

  const toggleActivo = async (b) => {
    try {
      await api.put(`/banners/${b.id}`, { activo: !b.activo });
      toast.success(b.activo ? 'Banner ocultado' : 'Banner activado');
      fetchData();
    } catch {
      toast.error('Error actualizando banner');
    }
  };

  const moverOrden = async (b, direccion) => {
    const nuevoOrden = b.orden + direccion;
    if (nuevoOrden < 0) return;
    // Intercambiar con el banner que ocupa ese orden
    const otro = banners.find(x => x.id !== b.id && x.orden === nuevoOrden);
    try {
      await api.put(`/banners/${b.id}`, { orden: nuevoOrden });
      if (otro) await api.put(`/banners/${otro.id}`, { orden: b.orden });
      fetchData();
    } catch {
      toast.error('Error reordenando banner');
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Banner Principal</h1>
          <p className="font-body text-muted-foreground text-sm">Gestión de slides del hero en la página de inicio</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Nuevo Slide</Button>
      </div>

      {/* Estado vacío / cargando */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : banners.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
          <p className="font-body text-muted-foreground">No hay slides. Crea el primero.</p>
        </div>
      ) : (
        /* Cards de slides */
        <div className="grid gap-4">
          {banners.map((b, idx) => (
            <div key={b.id} className={`bg-card rounded-xl border overflow-hidden flex flex-col sm:flex-row transition-all ${b.activo ? 'border-border' : 'border-border/50 opacity-60'}`}>

              {/* Miniatura */}
              <div className="w-full sm:w-48 h-36 sm:h-auto shrink-0 bg-muted relative">
                <img src={b.imagenUrl} alt={b.titulo} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                  <span className="text-white text-xs font-mono">#{b.orden + 1}</span>
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{b.titulo}</h3>
                      <p className="font-body text-sm text-muted-foreground mt-0.5">{b.subtitulo}</p>
                    </div>
                    <Badge className={b.activo ? 'bg-primary/15 text-primary border-0' : 'bg-muted text-muted-foreground border-0'}>
                      {b.activo ? 'Visible' : 'Oculto'}
                    </Badge>
                  </div>

                  {/* CTA info */}
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-body bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      Botón: <span className="font-medium text-foreground">"{b.ctaTexto}"</span>
                    </span>
                    <span className="text-xs font-body bg-muted px-2 py-0.5 rounded-full text-muted-foreground truncate max-w-[200px]">
                      → {b.ctaLink}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Reordenar */}
                  <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => moverOrden(b, -1)} disabled={idx === 0} title="Subir">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => moverOrden(b, 1)} disabled={idx === banners.length - 1} title="Bajar">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </Button>

                  {/* Visibilidad */}
                  <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => toggleActivo(b)}>
                    {b.activo ? <><EyeOff className="w-3.5 h-3.5" /> Ocultar</> : <><Eye className="w-3.5 h-3.5" /> Mostrar</>}
                  </Button>

                  {/* Editar / Eliminar */}
                  <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => openEdit(b)}>
                    <Pencil className="w-3.5 h-3.5" /> Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteId(b.id)}>
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog crear/editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? 'Editar Slide' : 'Nuevo Slide'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">

            <CloudinaryUpload
              value={form.imagenUrl}
              onChange={url => setForm({ ...form, imagenUrl: url })}
              label="Imagen del slide *"
              folder="fundacion/banners"
              disabled={saving}
            />

            <div>
              <Label>Título *</Label>
              <Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ej: Transformamos el Suroeste" />
            </div>

            <div>
              <Label>Subtítulo *</Label>
              <Input value={form.subtitulo} onChange={e => setForm({ ...form, subtitulo: e.target.value })} placeholder="Ej: Formación, empleo y cultura..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Texto del botón *</Label>
                <Input value={form.ctaTexto} onChange={e => setForm({ ...form, ctaTexto: e.target.value })} placeholder="Ej: Conoce más" />
              </div>
              <div>
                <Label>Enlace del botón *</Label>
                <Input value={form.ctaLink} onChange={e => setForm({ ...form, ctaLink: e.target.value })} placeholder="Ej: /quienes-somos" />
                <p className="text-xs text-muted-foreground mt-1">Ruta interna o URL externa</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Orden</Label>
                <Input type="number" min={0} value={form.orden} onChange={e => setForm({ ...form, orden: Number(e.target.value) })} />
                <p className="text-xs text-muted-foreground mt-1">Menor número = aparece primero</p>
              </div>
              <div className="flex flex-col justify-end pb-1">
                <div className="flex items-center gap-3">
                  <Switch checked={form.activo} onCheckedChange={v => setForm({ ...form, activo: v })} />
                  <Label>Visible en el sitio</Label>
                </div>
              </div>
            </div>

            {/* Preview del CTA */}
            {form.ctaTexto && (
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1 font-body">Vista previa del botón:</p>
                <span className="inline-block bg-primary text-primary-foreground text-sm px-4 py-1.5 rounded-md font-body font-medium">
                  {form.ctaTexto}
                </span>
                {form.ctaLink && (
                  <span className="text-xs text-muted-foreground ml-3">→ {form.ctaLink}</span>
                )}
              </div>
            )}

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmar eliminar */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este slide?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. El slide dejará de aparecer en el sitio.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBanner;
