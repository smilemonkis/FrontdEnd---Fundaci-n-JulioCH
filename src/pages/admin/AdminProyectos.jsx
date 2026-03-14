// src/pages/admin/AdminProyectos.jsx
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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

const emptyForm = { codigo: '', nombre: '', descripcion: '', imagenUrl: '', fechaInicio: '', fechaFin: '', estado: 'ABIERTO', progreso: 0, beneficiarios: '', presupuesto: '' };

const AdminProyectos = () => {
  const [proyectos, setProyectos]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [dialogOpen, setDialogOpen]   = useState(false);
  const [deleteId, setDeleteId]       = useState(null);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState(emptyForm);
  const [formErrors, setFormErrors]   = useState({});
  const [saving, setSaving]           = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/proyectos?page=0&size=100');
      setProyectos(res.data.content || []);
    } catch { toast.error('Error cargando proyectos'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() =>
    proyectos.filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase());
      const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado;
      return matchSearch && matchEstado;
    }), [proyectos, search, filtroEstado]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormErrors({}); setDialogOpen(true); };
  const openEdit   = (p) => {
    setEditing(p);
    setFormErrors({});
    setForm({
      codigo:        p.codigo,
      nombre:        p.nombre,
      descripcion:   p.descripcion   || '',
      imagenUrl:     p.imagenUrl     || '',
      fechaInicio:   p.fechaInicio   || '',
      fechaFin:      p.fechaFin      || '',
      estado:        p.estado        || 'ABIERTO',
      progreso:      p.progreso      ?? 0,
      beneficiarios: p.beneficiarios ?? '',
      presupuesto:   p.presupuesto   || '',
    });
    setDialogOpen(true);
  };

  const validar = () => {
    const e = {};
    if (!form.codigo.trim()) e.codigo = 'El código es requerido';
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido';
    if (form.fechaInicio && form.fechaFin && form.fechaFin <= form.fechaInicio)
      e.fechaFin = 'La fecha fin debe ser posterior al inicio';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validar()) return;
    setSaving(true);
    const payload = {
      codigo:        form.codigo,
      nombre:        form.nombre,
      descripcion:   form.descripcion   || null,
      imagenUrl:     form.imagenUrl     || null,
      fechaInicio:   form.fechaInicio   || null,
      fechaFin:      form.fechaFin      || null,
      estado:        form.estado,
      progreso:      Number(form.progreso) || 0,
      beneficiarios: form.beneficiarios !== '' ? Number(form.beneficiarios) : null,
      presupuesto:   form.presupuesto   || null,
    };
    try {
      if (editing) { await api.put(`/proyectos/${editing.id}`, payload); toast.success('Proyecto actualizado'); }
      else         { await api.post('/proyectos', payload);               toast.success('Proyecto creado'); }
      setDialogOpen(false); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error guardando'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await api.delete(`/proyectos/${deleteId}`); toast.success('Proyecto eliminado'); setDeleteId(null); fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error eliminando'); }
  };

  const estadoInfo = (estado) => ESTADOS.find(e => e.value === estado) || ESTADOS[1];
  const FieldError = ({ campo }) => formErrors[campo] ? <p className="text-xs text-destructive mt-1">{formErrors[campo]}</p> : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Proyectos</h1>
          <p className="font-body text-muted-foreground text-sm">Gestión de proyectos de la fundación</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Nuevo Proyecto</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre o código..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1">
          {[{v:'todos',l:'Todos'}, ...ESTADOS.map(e=>({v:e.value,l:e.label}))].map(f => (
            <button key={f.v} onClick={() => setFiltroEstado(f.v)}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${filtroEstado === f.v ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {f.l}
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
                        <div className="bg-primary h-1.5 rounded-full" style={{width:`${p.progreso||0}%`}} />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{p.progreso||0}%</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge className={estadoInfo(p.estado).color}>{estadoInfo(p.estado).label}</Badge></TableCell>
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
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">{editing ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Código *</Label><Input value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} placeholder="PROY-001" className={formErrors.codigo ? 'border-destructive' : ''} /><FieldError campo="codigo" /></div>
              <div><Label>Nombre *</Label><Input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className={formErrors.nombre ? 'border-destructive' : ''} /><FieldError campo="nombre" /></div>
            </div>
            <div><Label>Descripción</Label><Textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} rows={3} /></div>

            {/* Estado manual */}
            <div>
              <Label>Estado</Label>
              <Select value={form.estado} onValueChange={v => setForm({...form, estado: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>{ESTADOS.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {/* Fechas opcionales */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha inicio <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                <Input type="date" value={form.fechaInicio}
                  onChange={e => { setForm({...form, fechaInicio: e.target.value, fechaFin: form.fechaFin && form.fechaFin <= e.target.value ? '' : form.fechaFin}); setFormErrors(p=>({...p,fechaFin:''})); }} />
              </div>
              <div>
                <Label>Fecha fin <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                <Input type="date" value={form.fechaFin} min={form.fechaInicio || undefined}
                  onChange={e => { setForm({...form, fechaFin: e.target.value}); setFormErrors(p=>({...p,fechaFin:''})); }}
                  className={formErrors.fechaFin ? 'border-destructive' : ''} />
                <FieldError campo="fechaFin" />
              </div>
            </div>

            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Progreso (%)</Label>
                <Input type="number" min={0} max={100} value={form.progreso} onChange={e => setForm({...form, progreso: Math.min(100, Math.max(0, Number(e.target.value)))})} />
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div className="bg-primary h-1.5 rounded-full transition-all" style={{width:`${form.progreso}%`}} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{form.progreso}% completado</p>
              </div>
              <div><Label>Beneficiarios</Label><Input type="number" min={0} value={form.beneficiarios} onChange={e => setForm({...form, beneficiarios: e.target.value})} placeholder="Ej: 1200" /></div>
            </div>
            <div><Label>Presupuesto</Label><Input value={form.presupuesto} onChange={e => setForm({...form, presupuesto: e.target.value})} placeholder="Ej: $50.000.000" /><p className="text-xs text-muted-foreground mt-1">Texto libre</p></div>
            <Separator />
            <CloudinaryUpload value={form.imagenUrl} onChange={url => setForm({...form, imagenUrl: url})} label="Imagen del proyecto" folder="fundacion/proyectos" disabled={saving} />
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
          <AlertDialogHeader><AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader>
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
