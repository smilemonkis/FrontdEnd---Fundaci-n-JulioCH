// src/pages/admin/AdminMetricas.jsx
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Loader2, ArrowUp, ArrowDown, Users, FolderOpen, MapPin, Handshake } from 'lucide-react';
import { toast } from 'sonner';

const ICONOS = [
  { value: 'Users',      label: 'Personas',   Icon: Users },
  { value: 'FolderOpen', label: 'Proyectos',  Icon: FolderOpen },
  { value: 'MapPin',     label: 'Ubicación',  Icon: MapPin },
  { value: 'Handshake',  label: 'Aliados',    Icon: Handshake },
];

const iconMap = { Users, FolderOpen, MapPin, Handshake };

const emptyForm = { label: '', valor: '', icono: 'Users', orden: 0, activo: true };

const AdminMetricas = () => {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/metricas/admin');
      setItems(res.data || []);
    } catch { toast.error('Error cargando métricas'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, orden: items.length });
    setDialogOpen(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({ label: m.label, valor: m.valor, icono: m.icono, orden: m.orden, activo: m.activo });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.label || !form.valor) { toast.error('Label y valor son obligatorios'); return; }
    setSaving(true);
    try {
      if (editing) { await api.put(`/metricas/${editing.id}`, form); toast.success('Métrica actualizada'); }
      else         { await api.post('/metricas', form);               toast.success('Métrica creada'); }
      setDialogOpen(false); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error guardando'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await api.delete(`/metricas/${deleteId}`); toast.success('Métrica eliminada'); setDeleteId(null); fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error eliminando'); }
  };

  const toggleActivo = async (m) => {
    try {
      await api.put(`/metricas/${m.id}`, { ...m, activo: !m.activo });
      fetchData();
    } catch { toast.error('Error actualizando'); }
  };

  const moverOrden = async (m, dir) => {
    const nuevoOrden = m.orden + dir;
    if (nuevoOrden < 0) return;
    const otro = items.find(x => x.id !== m.id && x.orden === nuevoOrden);
    try {
      await api.put(`/metricas/${m.id}`, { ...m, orden: nuevoOrden });
      if (otro) await api.put(`/metricas/${otro.id}`, { ...otro, orden: m.orden });
      fetchData();
    } catch { toast.error('Error reordenando'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Métricas de Impacto</h1>
          <p className="font-body text-muted-foreground text-sm">Cifras que aparecen en el banner del inicio</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Nueva Métrica</Button>
      </div>

      {/* Preview del banner */}
      <div className="gradient-primary rounded-xl p-6">
        <p className="text-primary-foreground/60 text-xs font-body mb-4 uppercase tracking-wider">Preview del banner</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.filter(m => m.activo).map((m, i) => {
            const Icon = iconMap[m.icono] || Users;
            return (
              <div key={i} className="text-center">
                <Icon className="w-7 h-7 text-primary-foreground/80 mx-auto mb-1" />
                <div className="font-heading text-2xl font-bold text-primary-foreground">{m.valor}</div>
                <div className="font-body text-xs text-primary-foreground/70">{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
          <p className="font-body text-muted-foreground">No hay métricas. Agrega la primera.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((m, idx) => {
            const Icon = iconMap[m.icono] || Users;
            return (
              <div key={m.id} className={`bg-card rounded-xl border flex items-center gap-4 p-4 transition-all ${m.activo ? 'border-border' : 'border-border/50 opacity-60'}`}>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-xl text-foreground">{m.valor}</p>
                  <p className="font-body text-sm text-muted-foreground">{m.label}</p>
                </div>
                <Badge className={m.activo ? 'bg-primary/15 text-primary border-0' : 'bg-muted text-muted-foreground border-0'}>
                  {m.activo ? 'Visible' : 'Oculto'}
                </Badge>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => moverOrden(m, -1)} disabled={idx === 0}><ArrowUp className="w-3.5 h-3.5" /></Button>
                  <Button variant="outline" size="icon" className="w-7 h-7" onClick={() => moverOrden(m, 1)} disabled={idx === items.length - 1}><ArrowDown className="w-3.5 h-3.5" /></Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toggleActivo(m)}>{m.activo ? 'Ocultar' : 'Mostrar'}</Button>
                  <Button variant="outline" size="sm" className="h-7" onClick={() => openEdit(m)}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="sm" className="h-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(m.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle className="font-heading">{editing ? 'Editar Métrica' : 'Nueva Métrica'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Valor *</Label>
              <Input value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} placeholder="Ej: +5.000" />
              <p className="text-xs text-muted-foreground mt-1">El número grande que se muestra</p>
            </div>
            <div>
              <Label>Etiqueta *</Label>
              <Input value={form.label} onChange={e => setForm({...form, label: e.target.value})} placeholder="Ej: Beneficiarios" />
            </div>
            <div>
              <Label>Ícono</Label>
              <Select value={form.icono} onValueChange={v => setForm({...form, icono: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICONOS.map(({ value, label, Icon }) => (
                    <SelectItem key={value} value={value}>
                      <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <Label>Visible en el sitio</Label>
              <Switch checked={form.activo} onCheckedChange={v => setForm({...form, activo: v})} />
            </div>
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>¿Eliminar esta métrica?</AlertDialogTitle><AlertDialogDescription>Dejará de aparecer en el banner del inicio.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMetricas;
