// src/pages/admin/AdminLegal.jsx
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Trash2, Loader2, FileText, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const TIPOS = [
  { value: 'PDF',   label: 'PDF',          color: 'bg-red-500/15 text-red-600 border-0' },
  { value: 'Word',  label: 'Word',         color: 'bg-blue-500/15 text-blue-600 border-0' },
  { value: 'Drive', label: 'Google Drive', color: 'bg-yellow-500/15 text-yellow-700 border-0' },
  { value: 'Link',  label: 'Enlace',       color: 'bg-muted text-muted-foreground border-0' },
];

const emptyForm = { nombre: '', url: '', tipo: 'PDF', orden: 0 };

const AdminLegal = () => {
  const [docs, setDocs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [saving, setSaving]         = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/legal/admin');
      setDocs(res.data || []);
    } catch { toast.error('Error cargando documentos'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({ ...emptyForm, orden: docs.length });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.nombre || !form.url) { toast.error('Nombre y URL son obligatorios'); return; }
    setSaving(true);
    try {
      await api.post('/legal', form);
      toast.success('Documento agregado');
      setDialogOpen(false);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error guardando'); }
    finally { setSaving(false); }
  };

  const handleToggle = async (d) => {
    try {
      await api.put(`/legal/${d.id}/visibilidad`);
      toast.success(d.activo ? 'Documento ocultado' : 'Documento visible');
      fetchData();
    } catch { toast.error('Error actualizando visibilidad'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/legal/${deleteId}`);
      toast.success('Documento eliminado');
      setDeleteId(null);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error eliminando'); }
  };

  const tipoInfo = (tipo) => TIPOS.find(t => t.value === tipo) || TIPOS[0];
  const visibles = docs.filter(d => d.activo).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Documentos Legales</h1>
          <p className="font-body text-muted-foreground text-sm">
            {visibles} de {docs.length} documentos visibles para los aliados
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Agregar documento</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : docs.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-body text-muted-foreground">No hay documentos. Agrega el primero.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {docs.map(d => (
            <div key={d.id} className={`bg-card rounded-xl border p-4 transition-all ${d.activo ? 'border-border' : 'border-border/50 opacity-60'}`}>
              {/* Fila superior: icono + info + tipo */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-foreground truncate">{d.nombre}</p>
                  <a href={d.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5 truncate max-w-xs">
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{d.url}</span>
                  </a>
                </div>
                <Badge className={tipoInfo(d.tipo).color}>{tipoInfo(d.tipo).label}</Badge>
              </div>

              {/* Fila inferior: estado + acciones */}
              <div className="flex items-center justify-between gap-2 pl-12">
                <Badge className={d.activo
                  ? 'bg-primary/15 text-primary border-0'
                  : 'bg-muted text-muted-foreground border-0'}>
                  {d.activo ? 'Visible para aliados' : 'Oculto'}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs"
                    onClick={() => handleToggle(d)}>
                    {d.activo
                      ? <><EyeOff className="w-3.5 h-3.5" /> Ocultar</>
                      : <><Eye className="w-3.5 h-3.5" /> Mostrar</>}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(d.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-heading">Nuevo documento legal</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Nombre del documento *</Label>
              <Input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                placeholder="Ej: Estatutos de la Fundación" className="mt-1" />
            </div>
            <div>
              <Label>URL del documento *</Label>
              <Input value={form.url} onChange={e => setForm({...form, url: e.target.value})}
                placeholder="https://drive.google.com/..." className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">Pega el enlace de Google Drive, Dropbox o cualquier URL pública</p>
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={form.tipo} onValueChange={v => setForm({...form, tipo: v})}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este documento?</AlertDialogTitle>
            <AlertDialogDescription>Los aliados ya no podrán verlo ni descargarlo.</AlertDialogDescription>
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

export default AdminLegal;
