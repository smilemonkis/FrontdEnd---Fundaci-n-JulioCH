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

const emptyForm = { codigo: '', nombre: '', descripcion: '', fechaInicio: '', fechaFin: '', activo: true, progreso: 0, beneficiarios: '', presupuesto: '' };

// Hoy en formato yyyy-MM-dd para el atributo min de los inputs
const hoy = () => new Date().toISOString().split('T')[0];

const AdminProyectos = () => {
  const [proyectos,    setProyectos]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [dialogOpen,   setDialogOpen]   = useState(false);
  const [deleteId,     setDeleteId]     = useState(null);
  const [editing,      setEditing]      = useState(null);
  const [form,         setForm]         = useState(emptyForm);
  const [formErrors,   setFormErrors]   = useState({});
  const [saving,       setSaving]       = useState(false);

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
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                          p.codigo.toLowerCase().includes(search.toLowerCase());
      const matchEstado = filtroEstado === 'todos' ||
                          (filtroEstado === 'activos' ? p.activo : !p.activo);
      return matchSearch && matchEstado;
    }), [proyectos, search, filtroEstado]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormErrors({}); setDialogOpen(true); };
  const openEdit   = (p) => {
    setEditing(p);
    setFormErrors({});
    setForm({
      codigo:       p.codigo,
      nombre:       p.nombre,
      descripcion:  p.descripcion || '',
      fechaInicio:  p.fechaInicio || '',
      fechaFin:     p.fechaFin    || '',
      activo:       p.activo,
      progreso:     p.progreso    ?? 0,
      beneficiarios:p.beneficiarios ?? '',
      presupuesto:  p.presupuesto  || '',
    });
    setDialogOpen(true);
  };

  // ── Validación de fechas ──────────────────────────────────
  const validarFechas = () => {
    const e = {};
    const today = hoy();

    if (!form.fechaInicio) {
      e.fechaInicio = 'La fecha de inicio es requerida';
    } else if (!editing && form.fechaInicio < today) {
      e.fechaInicio = 'La fecha de inicio no puede ser anterior a hoy';
    }

    if (form.fechaFin) {
      if (form.fechaFin < today) {
        e.fechaFin = 'La fecha de fin no puede ser anterior a hoy';
      } else if (form.fechaInicio && form.fechaFin <= form.fechaInicio) {
        e.fechaFin = 'La fecha de fin debe ser posterior a la de inicio';
      }
    }

    if (!form.codigo.trim()) e.codigo = 'El código es requerido';
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';

    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validarFechas()) return;
    setSaving(true);
    const payload = {
      codigo:        form.codigo,
      nombre:        form.nombre,
      descripcion:   form.descripcion || null,
      fechaInicio:   form.fechaInicio,
      fechaFin:      form.fechaFin || null,
      progreso:      Number(form.progreso) || 0,
      beneficiarios: form.beneficiarios !== '' ? Number(form.beneficiarios) : null,
      presupuesto:   form.presupuesto || null,
    };
    try {
      if (editing) {
        await api.put(`/proyectos/${editing.id}`, payload);
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

  const FieldError = ({ campo }) =>
    formErrors[campo]
      ? <p className="text-xs text-destructive mt-1">{formErrors[campo]}</p>
      : null;

  const inputErr = (campo) =>
    formErrors[campo] ? 'border-destructive focus:ring-destructive/30' : '';

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
          <Input placeholder="Buscar por nombre o código..." value={search}
            onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1">
          {['todos', 'activos', 'cerrados'].map(f => (
            <button key={f} onClick={() => setFiltroEstado(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${
                filtroEstado === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}>
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
                <TableHead>Presupuesto</TableHead>
                <TableHead>Progreso</TableHead>
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
                  <TableCell className="text-sm text-muted-foreground">{p.presupuesto || '—'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${p.progreso || 0}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{p.progreso || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {p.activo
                      ? <Badge className="bg-primary/15 text-primary border-0">En curso</Badge>
                      : <Badge className="bg-muted text-muted-foreground border-0">Cerrado</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}
                      className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
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
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Código *</Label>
                <Input value={form.codigo}
                  onChange={e => setForm({ ...form, codigo: e.target.value })}
                  placeholder="PROY-001"
                  className={inputErr('codigo')} />
                <FieldError campo="codigo" />
              </div>
              <div>
                <Label>Nombre *</Label>
                <Input value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className={inputErr('nombre')} />
                <FieldError campo="nombre" />
              </div>
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })} rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha inicio *</Label>
                <Input type="date"
                  value={form.fechaInicio}
                  min={!editing ? hoy() : undefined}
                  onChange={e => {
                    const val = e.target.value;
                    // Si la fecha fin ya existe y es <= al nuevo inicio, la limpia
                    const newFin = form.fechaFin && form.fechaFin <= val ? '' : form.fechaFin;
                    setForm({ ...form, fechaInicio: val, fechaFin: newFin });
                    setFormErrors(prev => ({ ...prev, fechaInicio: '', fechaFin: '' }));
                  }}
                  className={inputErr('fechaInicio')} />
                <FieldError campo="fechaInicio" />
              </div>
              <div>
                <Label>Fecha fin</Label>
                <Input type="date"
                  value={form.fechaFin}
                  min={form.fechaInicio || hoy()}
                  onChange={e => {
                    setForm({ ...form, fechaFin: e.target.value });
                    setFormErrors(prev => ({ ...prev, fechaFin: '' }));
                  }}
                  className={inputErr('fechaFin')} />
                <FieldError campo="fechaFin" />
                {form.fechaInicio && form.fechaFin && (
                  <p className={`text-xs mt-1 ${form.fechaFin > form.fechaInicio ? 'text-primary' : 'text-destructive'}`}>
                    {form.fechaFin > form.fechaInicio
                      ? '✓ Fechas válidas'
                      : '✗ La fecha fin debe ser posterior al inicio'}
                  </p>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex items-center gap-3">
                <Switch checked={form.activo} onCheckedChange={v => setForm({ ...form, activo: v })} />
                <Label>Proyecto activo</Label>
              </div>
            )}

            <Separator />

            {/* Progreso, beneficiarios, presupuesto */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Progreso (%)</Label>
                <div className="relative">
                  <Input
                    type="number" min={0} max={100}
                    value={form.progreso}
                    onChange={e => setForm({ ...form, progreso: Math.min(100, Math.max(0, Number(e.target.value))) })}
                    placeholder="0"
                  />
                </div>
                {/* Barra visual */}
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${form.progreso}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{form.progreso}% completado</p>
              </div>
              <div>
                <Label>Beneficiarios</Label>
                <Input
                  type="number" min={0}
                  value={form.beneficiarios}
                  onChange={e => setForm({ ...form, beneficiarios: e.target.value })}
                  placeholder="Ej: 1200"
                />
              </div>
            </div>

            <div>
              <Label>Presupuesto</Label>
              <Input
                value={form.presupuesto}
                onChange={e => setForm({ ...form, presupuesto: e.target.value })}
                placeholder="Ej: $50.000.000"
              />
              <p className="text-xs text-muted-foreground mt-1">Texto libre — escribe el monto como quieras mostrarlo</p>
            </div>

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
            <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProyectos;
