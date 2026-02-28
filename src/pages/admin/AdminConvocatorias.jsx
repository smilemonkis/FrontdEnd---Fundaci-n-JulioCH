// src/pages/admin/AdminConvocatorias.jsx
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Pencil, Trash2, Search, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = { titulo: '', descripcion: '', fechaInicio: '', fechaFin: '', activa: true };

const AdminConvocatorias = () => {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/convocatorias?page=0&size=100');
      setItems(res.data.content || []);
    } catch {
      toast.error('Error cargando convocatorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() =>
    items.filter(c => c.titulo.toLowerCase().includes(search.toLowerCase())),
    [items, search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit   = (c) => {
    setEditing(c);
    setForm({
      titulo:      c.titulo,
      descripcion: c.descripcion || '',
      fechaInicio: c.fechaInicio || '',
      fechaFin:    c.fechaFin    || '',
      activa:      c.activa,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.titulo || !form.fechaInicio || !form.fechaFin) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    setSaving(true);
    // Mapeo exacto al CreateConvocatoriaRequest / UpdateConvocatoriaRequest
    const payload = {
      titulo:      form.titulo,
      descripcion: form.descripcion || null,
      fechaInicio: form.fechaInicio,
      fechaFin:    form.fechaFin,
    };
    try {
      if (editing) {
        await api.put(`/convocatorias/${editing.id}`, payload);
        if (form.activa !== editing.activa) {
          await api.put(`/convocatorias/${editing.id}/${form.activa ? 'activar' : 'desactivar'}`);
        }
        toast.success('Convocatoria actualizada');
      } else {
        await api.post('/convocatorias', payload);
        toast.success('Convocatoria creada');
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error guardando convocatoria');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/convocatorias/${deleteId}`);
      toast.success('Convocatoria eliminada');
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error eliminando convocatoria');
    }
  };

  const isVigente = (c) => {
    if (!c.activa) return false;
    const today = new Date().toISOString().split('T')[0];
    if (c.fechaFin && c.fechaFin < today) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Convocatorias</h1>
          <p className="font-body text-muted-foreground text-sm">Gestión de convocatorias y oportunidades</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Nueva Convocatoria</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar por título..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay convocatorias</TableCell></TableRow>
              ) : filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium max-w-[300px] truncate">{c.titulo}</TableCell>
                  <TableCell>{c.fechaInicio}</TableCell>
                  <TableCell>{c.fechaFin || '—'}</TableCell>
                  <TableCell>
                    {isVigente(c)
                      ? <Badge className="bg-primary/15 text-primary border-0">Vigente</Badge>
                      : c.activa
                        ? <Badge className="bg-accent/15 text-accent border-0">Vencida</Badge>
                        : <Badge className="bg-muted text-muted-foreground border-0">Inactiva</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">{editing ? 'Editar Convocatoria' : 'Nueva Convocatoria'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div><Label>Título *</Label><Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ej: Buscamos voluntarios..." /></div>
            <div><Label>Descripción *</Label><Textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Fecha inicio *</Label><Input type="date" value={form.fechaInicio} onChange={e => setForm({ ...form, fechaInicio: e.target.value })} /></div>
              <div><Label>Fecha fin *</Label><Input type="date" value={form.fechaFin} onChange={e => setForm({ ...form, fechaFin: e.target.value })} /></div>
            </div>
            {editing && (
              <div className="flex items-center gap-3">
                <Switch checked={form.activa} onCheckedChange={v => setForm({ ...form, activa: v })} />
                <Label>Convocatoria activa</Label>
              </div>
            )}
            <Separator />
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground font-body">Gestión de imágenes disponible próximamente.</p>
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
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar convocatoria?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
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

export default AdminConvocatorias;