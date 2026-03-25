// src/pages/admin/AdminOportunidades.jsx
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

const TIPOS = ['EMPLEO', 'FORMACION', 'VOLUNTARIADO'];
const TIPO_LABELS = {
  EMPLEO:       { label: 'Empleo',       color: 'bg-blue-500/15 text-blue-600' },
  FORMACION:    { label: 'Formación',    color: 'bg-purple-500/15 text-purple-600' },
  VOLUNTARIADO: { label: 'Voluntariado', color: 'bg-green-500/15 text-green-600' },
};
const ESTADOS = [
  { value: 'PROXIMAMENTE', label: 'Próximamente', color: 'bg-accent/15 text-accent border-0' },
  { value: 'ABIERTO',      label: 'Abierto',      color: 'bg-primary/15 text-primary border-0' },
  { value: 'CERRADO',      label: 'Cerrado',      color: 'bg-muted text-muted-foreground border-0' },
];

const emptyForm = {
  titulo: '', descripcion: '', imagenUrl: '', tipo: 'EMPLEO',
  fechaLimite: '', enlace: '', estado: 'ABIERTO', activo: true,
  textoBoton: 'Aplicar', mostrarBoton: true,
};

const AdminOportunidades = () => {
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
      const res = await api.get('/oportunidades?page=0&size=100');
      setItems(res.data.content || []);
    } catch { toast.error('Error cargando oportunidades'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() =>
    items.filter(o => o.titulo.toLowerCase().includes(search.toLowerCase())),
    [items, search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit   = (o) => {
    setEditing(o);
    setForm({
      titulo:       o.titulo,
      descripcion:  o.descripcion   || '',
      imagenUrl:    o.imagenUrl     || '',
      tipo:         o.tipo          || 'EMPLEO',
      fechaLimite:  o.fechaLimite   || '',
      enlace:       o.enlace        || '',
      estado:       o.estado        || 'ABIERTO',
      activo:       o.activo        ?? true,
      textoBoton:   o.textoBoton    || 'Aplicar',
      mostrarBoton: o.mostrarBoton  ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.titulo || !form.descripcion || !form.tipo) { toast.error('Completa los campos obligatorios'); return; }
    setSaving(true);
    const payload = {
      titulo:       form.titulo,
      descripcion:  form.descripcion,
      imagenUrl:    form.imagenUrl    || null,
      tipo:         form.tipo,
      fechaLimite:  form.fechaLimite  || null,
      enlace:       form.enlace       || null,
      estado:       form.estado,
      activo:       form.activo,
      textoBoton:   form.textoBoton   || 'Aplicar',
      mostrarBoton: form.mostrarBoton,
    };
    try {
      if (editing) { await api.put(`/oportunidades/${editing.id}`, payload); toast.success('Oportunidad actualizada'); }
      else         { await api.post('/oportunidades', payload);              toast.success('Oportunidad creada'); }
      setDialogOpen(false); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error guardando'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await api.delete(`/oportunidades/${deleteId}`); toast.success('Oportunidad eliminada'); setDeleteId(null); fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Error eliminando'); }
  };

  const estadoInfo = (estado) => ESTADOS.find(e => e.value === estado) || ESTADOS[1];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Oportunidades</h1>
          <p className="font-body text-muted-foreground text-sm">Gestión de empleos, formación y voluntariado</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Nueva Oportunidad</Button>
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
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha límite</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Botón</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay oportunidades</TableCell></TableRow>
              ) : filtered.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium max-w-[220px] truncate">{o.titulo}</TableCell>
                  <TableCell><Badge className={`${TIPO_LABELS[o.tipo]?.color} border-0`}>{TIPO_LABELS[o.tipo]?.label || o.tipo}</Badge></TableCell>
                  <TableCell>{o.fechaLimite || '—'}</TableCell>
                  <TableCell><Badge className={estadoInfo(o.estado).color}>{estadoInfo(o.estado).label}</Badge></TableCell>
                  <TableCell>
                    {o.mostrarBoton
                      ? <Badge className="bg-primary/15 text-primary border-0">{o.textoBoton || 'Aplicar'}</Badge>
                      : <Badge className="bg-muted text-muted-foreground border-0">Oculto</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(o)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(o.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">{editing ? 'Editar Oportunidad' : 'Nueva Oportunidad'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div><Label>Título *</Label><Input value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} /></div>
            <div><Label>Descripción *</Label><Textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} rows={4} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo *</Label>
                <Select value={form.tipo} onValueChange={v => setForm({...form, tipo: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TIPOS.map(t => <SelectItem key={t} value={t}>{TIPO_LABELS[t].label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estado</Label>
                <Select value={form.estado} onValueChange={v => setForm({...form, estado: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ESTADOS.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Fecha límite <span className="text-muted-foreground text-xs">(opcional)</span></Label>
              <Input type="date" value={form.fechaLimite} onChange={e => setForm({...form, fechaLimite: e.target.value})} />
            </div>

            <CloudinaryUpload value={form.imagenUrl} onChange={url => setForm({...form, imagenUrl: url})} label="Imagen" folder="fundacion/oportunidades" disabled={saving} />

            <Separator />

            {/* ── Botón de acción ── */}
            <div>
              <p className="text-sm font-medium font-body mb-3">Botón de acción</p>
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium font-body">Mostrar botón</p>
                    <p className="text-xs text-muted-foreground">{form.mostrarBoton ? 'El botón aparece en el detalle' : 'El botón está oculto'}</p>
                  </div>
                  <Switch checked={form.mostrarBoton} onCheckedChange={v => setForm({...form, mostrarBoton: v})} />
                </div>
                {form.mostrarBoton && (
                  <>
                    <div>
                      <Label>Texto del botón</Label>
                      <Input value={form.textoBoton} onChange={e => setForm({...form, textoBoton: e.target.value})} placeholder="Aplicar" className="mt-1" />
                    </div>
                    <div>
                      <Label>Enlace <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                      <Input value={form.enlace} onChange={e => setForm({...form, enlace: e.target.value})} placeholder="https://..." className="mt-1" />
                      <p className="text-xs text-muted-foreground mt-1">Si no hay enlace el botón no aparece aunque esté activo</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex items-center gap-3">
                <Switch checked={form.activo} onCheckedChange={v => setForm({...form, activo: v})} />
                <Label>Oportunidad activa</Label>
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
          <AlertDialogHeader><AlertDialogTitle>¿Eliminar oportunidad?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOportunidades;
