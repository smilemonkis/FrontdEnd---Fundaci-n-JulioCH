// src/pages/admin/AdminAliadosDestacados.jsx
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Loader2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

const emptyForm = { nombre: '', logoUrl: '', sitioWeb: '', orden: 0, activo: true };

const AdminAliadosDestacados = () => {
  const [aliados, setAliados]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/aliados-destacados/admin');
      setAliados(res.data || []);
    } catch { toast.error('Error cargando aliados'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, orden: aliados.length });
    setDialogOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({
      nombre:   a.nombre,
      logoUrl:  a.logoUrl,
      sitioWeb: a.sitioWeb || '',
      orden:    a.orden,
      activo:   a.activo,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.nombre || !form.logoUrl) {
      toast.error('Nombre y logo son obligatorios');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/aliados-destacados/${editing.id}`, form);
        toast.success('Aliado actualizado');
      } else {
        await api.post('/aliados-destacados', form);
        toast.success('Aliado agregado');
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error guardando');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/aliados-destacados/${deleteId}`);
      toast.success('Aliado eliminado');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error eliminando');
    }
  };

  const toggleActivo = async (a) => {
    try {
      await api.put(`/aliados-destacados/${a.id}`, { activo: !a.activo });
      toast.success(a.activo ? 'Aliado ocultado' : 'Aliado activado');
      fetchData();
    } catch { toast.error('Error actualizando'); }
  };

  const moverOrden = async (a, dir) => {
    const nuevoOrden = a.orden + dir;
    if (nuevoOrden < 0) return;
    const otro = aliados.find(x => x.id !== a.id && x.orden === nuevoOrden);
    try {
      await api.put(`/aliados-destacados/${a.id}`, { orden: nuevoOrden });
      if (otro) await api.put(`/aliados-destacados/${otro.id}`, { orden: a.orden });
      fetchData();
    } catch { toast.error('Error reordenando'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Aliados Destacados</h1>
          <p className="font-body text-muted-foreground text-sm">Logos que aparecen en el carrusel del inicio</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Agregar Aliado</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : aliados.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
          <p className="font-body text-muted-foreground">No hay aliados. Agrega el primero.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {aliados.map((a, idx) => (
            <div key={a.id} className={`bg-card rounded-xl border overflow-hidden flex items-center gap-4 p-4 transition-all ${a.activo ? 'border-border' : 'border-border/50 opacity-60'}`}>

              {/* Logo — tamaño fijo 80x80 */}
              <div className="w-20 h-20 rounded-lg border border-border bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                <img src={a.logoUrl} alt={a.nombre}
                  className="w-full h-full object-contain p-2" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-foreground">{a.nombre}</p>
                {a.sitioWeb && (
                  <a href={a.sitioWeb} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline mt-0.5">
                    <ExternalLink className="w-3 h-3" /> {a.sitioWeb}
                  </a>
                )}
                <Badge className={`mt-1 ${a.activo ? 'bg-primary/15 text-primary border-0' : 'bg-muted text-muted-foreground border-0'}`}>
                  {a.activo ? 'Visible' : 'Oculto'}
                </Badge>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => moverOrden(a, -1)} disabled={idx === 0}><ArrowUp className="w-3.5 h-3.5" /></Button>
                <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => moverOrden(a, 1)} disabled={idx === aliados.length - 1}><ArrowDown className="w-3.5 h-3.5" /></Button>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => toggleActivo(a)}>
                  {a.activo ? 'Ocultar' : 'Mostrar'}
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => openEdit(a)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteId(a.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? 'Editar Aliado' : 'Nuevo Aliado'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">

            {/* Logo — tamaño fijo, crop cuadrado */}
            <div>
              <Label>Logo *</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Sube una imagen cuadrada (recomendado 200×200px). Se mostrará en 80×80px.
              </p>
              <CloudinaryUpload
                value={form.logoUrl}
                onChange={url => setForm({...form, logoUrl: url})}
                label=""
                folder="fundacion/aliados"
                disabled={saving}
              />
            </div>

            <div>
              <Label>Nombre *</Label>
              <Input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej: SENA Regional" />
            </div>

            <div>
              <Label>Sitio web <span className="text-muted-foreground text-xs">(opcional)</span></Label>
              <Input value={form.sitioWeb} onChange={e => setForm({...form, sitioWeb: e.target.value})} placeholder="https://..." />
              <p className="text-xs text-muted-foreground mt-1">Al hacer clic en el logo irá a esta URL</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Orden</Label>
                <Input type="number" min={0} value={form.orden} onChange={e => setForm({...form, orden: Number(e.target.value)})} />
                <p className="text-xs text-muted-foreground mt-1">Menor = aparece primero</p>
              </div>
              <div className="flex flex-col justify-end pb-1">
                <div className="flex items-center gap-3">
                  <Switch checked={form.activo} onCheckedChange={v => setForm({...form, activo: v})} />
                  <Label>Visible</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? 'Guardar' : 'Agregar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este aliado?</AlertDialogTitle>
            <AlertDialogDescription>Dejará de aparecer en el carrusel del inicio.</AlertDialogDescription>
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

export default AdminAliadosDestacados;
