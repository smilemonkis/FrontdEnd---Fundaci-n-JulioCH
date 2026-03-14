// src/pages/admin/AdminConvocatorias.jsx
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

const ESTADOS = [
  { value: 'PROXIMAMENTE', label: 'Próximamente', color: 'bg-accent/15 text-accent border-0' },
  { value: 'ABIERTO',      label: 'Abierto',      color: 'bg-primary/15 text-primary border-0' },
  { value: 'CERRADO',      label: 'Cerrado',      color: 'bg-muted text-muted-foreground border-0' },
];

const emptyForm = { titulo: '', descripcion: '', imagenUrl: '', fechaInicio: '', fechaFin: '', estado: 'ABIERTO', activa: true };

const AdminConvocatorias = () => {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);
  const [fechaError, setFechaError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/convocatorias?page=0&size=100');
      setItems(res.data.content || []);
    } catch { toast.error('Error cargando convocatorias'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() =>
    items.filter(c => c.titulo.toLowerCase().includes(search.toLowerCase())),
    [items, search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFechaError(''); setDialogOpen(true); };
  const openEdit   = (c) => {
    setEditing(c);
    setFechaError('');
    setForm({
      titulo:      c.titulo,
      descripcion: c.descripcion || '',
      imagenUrl:   c.imagenUrl   || '',
      fechaInicio: c.fechaInicio || '',
      fechaFin:    c.fechaFin    || '',
      estado:      c.estado      || 'ABIERTO',
      activa:      c.activa,
    });
    setDialogOpen(true);
  };

  const validarFechas = () => {
    if (form.fechaInicio && form.fechaFin && form.fechaFin <= form.fechaInicio) {
      setFechaError('La fecha de fin debe ser posterior a la de inicio');
      return false;
    }
    setFechaError('');
    return true;
  };

  const handleSave = async () => {
    if (!form.titulo || !form.descripcion) { toast.error('Título y descripción son obligatorios'); return; }
    if (!validarFechas()) return;
    setSaving(true);
    const payload = {
      titulo:      form.titulo,
      descripcion: form.descripcion,
      imagenUrl:   form.imagenUrl   || null,
      fechaInicio: form.fechaInicio || null,
      fechaFin:    form.fechaFin    || null,
      estado:      form.estado,
      activa:      form.activa,
    };
    try {
      if (editing) {
        await api.put(`/convocatorias/${editing.id}`, payload);
        toast.success('Convocatoria actualizada');
      } else {
        await api.post('/convocatorias', payload);
        toast.success('Convocatoria creada');
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error guardando convocatoria');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/convocatorias/${deleteId}`);
      toast.success('Convocatoria eliminada');
      setDeleteId(null);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error eliminando'); }
  };

  const estadoInfo = (estado) => ESTADOS.find(e => e.value === estado) || ESTADOS[1];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Convocatorias</h1>
          <p className="font-body text-muted-foreground text-sm">Gestión de convocatorias</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Nueva Convocatoria</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
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
                  <TableCell>{c.fechaInicio || '—'}</TableCell>
                  <TableCell>{c.fechaFin || '—'}</TableCell>
                  <TableCell><Badge className={estadoInfo(c.estado).color}>{estadoInfo(c.estado).label}</Badge></TableCell>
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
            <div><Label>Título *</Label><Input value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} /></div>
            <div><Label>Descripción *</Label><Textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} rows={3} /></div>

            {/* Estado manual */}
            <div>
              <Label>Estado</Label>
              <Select value={form.estado} onValueChange={v => setForm({...form, estado: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ESTADOS.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Fechas opcionales */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha inicio <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                <Input type="date" value={form.fechaInicio}
                  onChange={e => { setForm({...form, fechaInicio: e.target.value}); setFechaError(''); }} />
              </div>
              <div>
                <Label>Fecha fin <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                <Input type="date" value={form.fechaFin}
                  min={form.fechaInicio || undefined}
                  onChange={e => { setForm({...form, fechaFin: e.target.value}); setFechaError(''); }} />
              </div>
            </div>
            {fechaError && <p className="text-xs text-destructive">{fechaError}</p>}

            <CloudinaryUpload value={form.imagenUrl} onChange={url => setForm({...form, imagenUrl: url})} label="Imagen" folder="fundacion/convocatorias" disabled={saving} />

            {editing && (
              <div className="flex items-center gap-3">
                <Switch checked={form.activa} onCheckedChange={v => setForm({...form, activa: v})} />
                <Label>Convocatoria activa</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{editing ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>¿Eliminar convocatoria?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader>
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
