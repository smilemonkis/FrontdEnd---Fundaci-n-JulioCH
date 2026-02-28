// src/pages/admin/AdminProyectos.jsx
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

const emptyForm = { codigo: '', nombre: '', descripcion: '', fechaInicio: '', fechaFin: '', activo: true };

const AdminProyectos = () => {
  const [proyectos, setProyectos]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/proyectos?page=0&size=100');
      setProyectos(res.data.content || []);
    } catch {
      toast.error('Error cargando proyectos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() =>
    proyectos.filter(p => {
      const matchSearch  = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                           p.codigo.toLowerCase().includes(search.toLowerCase());
      const matchEstado  = filtroEstado === 'todos' ||
                           (filtroEstado === 'activos' ? p.activo : !p.activo);
      return matchSearch && matchEstado;
    }), [proyectos, search, filtroEstado]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit   = (p) => {
    setEditing(p);
    setForm({
      codigo:      p.codigo,
      nombre:      p.nombre,
      descripcion: p.descripcion || '',
      // Spring Boot devuelve LocalDate como "yyyy-MM-dd" — compatible con input type="date"
      fechaInicio: p.fechaInicio  || '',
      fechaFin:    p.fechaFin     || '',
      activo:      p.activo,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.codigo || !form.nombre || !form.fechaInicio) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    setSaving(true);
    // Mapeo exacto al CreateProyectoRequest / UpdateProyectoRequest
    const payload = {
      codigo:      form.codigo,
      nombre:      form.nombre,
      descripcion: form.descripcion || null,
      fechaInicio: form.fechaInicio,
      fechaFin:    form.fechaFin    || null,
    };
    try {
      if (editing) {
        await api.put(`/proyectos/${editing.id}`, payload);
        // Activar/desactivar si cambió el estado
        if (form.activo !== editing.activo) {
          await api.put(`/proyectos/${editing.id}/${form.activo ? 'activar' : 'desactivar'}`);
        }
        toast.success('Proyecto actualizado');
      } else {
        await api.post('/proyectos', payload);
        toast.success('Proyecto creado');
      }
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error guardando proyecto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/proyectos/${deleteId}`);
      toast.success('Proyecto eliminado');
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error eliminando proyecto');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Proyectos</h1>
          <p className="font-body text-muted-foreground text-sm">Gestión completa de proyectos de la fundación</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Nuevo Proyecto</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre o código..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1">
          {['todos', 'activos', 'cerrados'].map(f => (
            <button key={f} onClick={() => setFiltroEstado(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${filtroEstado === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {f === 'todos' ? 'Todos' : f === 'activos' ? 'Activos' : 'Cerrados'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay proyectos</TableCell></TableRow>
              ) : filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-sm">{p.codigo}</TableCell>
                  <TableCell className="font-medium">{p.nombre}</TableCell>
                  <TableCell>{p.fechaInicio}</TableCell>
                  <TableCell>{p.fechaFin || '—'}</TableCell>
                  <TableCell>
                    {p.activo
                      ? <Badge className="bg-primary/15 text-primary border-0">En curso</Badge>
                      : <Badge className="bg-muted text-muted-foreground border-0">Cerrado</Badge>}
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

      {/* Dialog crear/editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">{editing ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Código *</Label><Input value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} placeholder="PROY-001" /></div>
              <div><Label>Nombre *</Label><Input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} /></div>
            </div>
            <div><Label>Descripción</Label><Textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Fecha inicio *</Label><Input type="date" value={form.fechaInicio} onChange={e => setForm({ ...form, fechaInicio: e.target.value })} /></div>
              <div><Label>Fecha fin</Label><Input type="date" value={form.fechaFin} onChange={e => setForm({ ...form, fechaFin: e.target.value })} /></div>
            </div>
            {editing && (
              <div className="flex items-center gap-3">
                <Switch checked={form.activo} onCheckedChange={v => setForm({ ...form, activo: v })} />
                <Label>Proyecto activo</Label>
              </div>
            )}
            <Separator />
            {/* Imágenes: pendiente de implementar endpoint en backend */}
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

      {/* Dialog eliminar */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
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

export default AdminProyectos;