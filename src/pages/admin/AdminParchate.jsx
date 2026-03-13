// src/pages/admin/AdminParchate.jsx
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
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

const emptyForm = {
  titulo: '', descripcion: '', imagenUrl: '', tipo: '',
  ubicacion: '', direccion: '', urlMapa: '', fechaEvento: '', activo: true,
};

const AdminParchate = () => {
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/parchate?page=0&size=100');
      setItems(res.data.content || []);
    } catch {
      toast.error('Error cargando actividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() =>
    items.filter(p => p.titulo.toLowerCase().includes(search.toLowerCase())),
    [items, search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit   = (p) => {
    setEditing(p);
    setForm({
      titulo:      p.titulo,
      descripcion: p.descripcion  || '',
      imagenUrl:   p.imagenUrl    || '',
      tipo:        p.tipo         || '',
      ubicacion:   p.ubicacion    || '',
      direccion:   p.direccion    || '',
      urlMapa:     p.urlMapa      || '',
      fechaEvento: p.fechaEvento  ? p.fechaEvento.substring(0, 16) : '',
      activo:      p.activo       ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.titulo || !form.descripcion || !form.tipo || !form.ubicacion) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    setSaving(true);
    const payload = {
      titulo:      form.titulo,
      descripcion: form.descripcion,
      imagenUrl:   form.imagenUrl   || null,
      tipo:        form.tipo,
      ubicacion:   form.ubicacion,
      direccion:   form.direccion   || null,
      urlMapa:     form.urlMapa     || null,
      fechaEvento: form.fechaEvento || null,
    };
    try {
      if (editing) {
        await api.put(`/parchate/${editing.id}`, { ...payload, activo: form.activo });
        toast.success('Actividad actualizada');
      } else {
        await api.post('/parchate', payload);
        toast.success('Actividad creada');
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error guardando actividad');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/parchate/${deleteId}`);
      toast.success('Actividad eliminada');
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error eliminando actividad');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Párchate</h1>
          <p className="font-body text-muted-foreground text-sm">Gestión de actividades y eventos</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Nueva Actividad</Button>
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
                <TableHead>Tipo</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Fecha evento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay actividades</TableCell></TableRow>
              ) : filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium max-w-[220px] truncate">{p.titulo}</TableCell>
                  <TableCell><Badge variant="outline">{p.tipo}</Badge></TableCell>
                  <TableCell>{p.ubicacion}</TableCell>
                  <TableCell>{p.fechaEvento ? p.fechaEvento.substring(0, 10) : '—'}</TableCell>
                  <TableCell>
                    {p.activo
                      ? <Badge className="bg-primary/15 text-primary border-0">Activa</Badge>
                      : <Badge className="bg-muted text-muted-foreground border-0">Inactiva</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">{editing ? 'Editar Actividad' : 'Nueva Actividad'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div><Label>Título *</Label><Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Ej: Taller de emprendimiento..." /></div>
            <div><Label>Descripción *</Label><Textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Tipo *</Label><Input value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} placeholder="Ej: Taller, Evento, Charla..." /></div>
              <div><Label>Ubicación *</Label><Input value={form.ubicacion} onChange={e => setForm({ ...form, ubicacion: e.target.value })} placeholder="Ej: Medellín, Bogotá..." /></div>
            </div>
            <div><Label>Dirección</Label><Input value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} placeholder="Dirección exacta del evento" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>URL del mapa</Label><Input value={form.urlMapa} onChange={e => setForm({ ...form, urlMapa: e.target.value })} placeholder="https://maps.google.com/..." /></div>
              <div><Label>Fecha y hora del evento</Label><Input type="datetime-local" value={form.fechaEvento} onChange={e => setForm({ ...form, fechaEvento: e.target.value })} /></div>
            </div>
            <CloudinaryUpload
              value={form.imagenUrl}
              onChange={url => setForm({ ...form, imagenUrl: url })}
              label="Imagen principal"
              folder="fundacion/parchate"
              disabled={saving}
            />
            {editing && (
              <div className="flex items-center gap-3">
                <Switch checked={form.activo} onCheckedChange={v => setForm({ ...form, activo: v })} />
                <Label>Actividad activa</Label>
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar actividad?</AlertDialogTitle>
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

export default AdminParchate;
