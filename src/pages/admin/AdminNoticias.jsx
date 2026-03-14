// src/pages/admin/AdminNoticias.jsx
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
import { Plus, Pencil, Trash2, Search, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

const emptyForm = {
  titulo: '', resumen: '', contenido: '', imagenUrl: '',
  autor: '', publicado: false,
};

const AdminNoticias = () => {
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
      const res = await api.get('/noticias?page=0&size=100');
      setItems(res.data.content || []);
    } catch { toast.error('Error cargando noticias'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() =>
    items.filter(n => n.titulo.toLowerCase().includes(search.toLowerCase())),
    [items, search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit   = (n) => {
    setEditing(n);
    setForm({
      titulo:    n.titulo,
      resumen:   n.resumen   || '',
      contenido: n.contenido || '',
      imagenUrl: n.imagenUrl || '',
      autor:     n.autor     || '',
      publicado: n.publicado ?? false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.titulo || !form.resumen || !form.contenido || !form.autor) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    setSaving(true);
    const payload = {
      titulo:    form.titulo,
      resumen:   form.resumen,
      contenido: form.contenido,
      imagenUrl: form.imagenUrl || null,
      autor:     form.autor,
      publicado: form.publicado,
      // No enviamos fechaPublicacion — el backend la asigna automáticamente al publicar
    };
    try {
      if (editing) {
        await api.put(`/noticias/${editing.id}`, payload);
        toast.success('Noticia actualizada');
      } else {
        await api.post('/noticias', payload);
        toast.success(form.publicado ? 'Noticia publicada' : 'Borrador guardado');
      }
      setDialogOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error guardando noticia');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/noticias/${deleteId}`);
      toast.success('Noticia eliminada');
      setDeleteId(null);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error eliminando noticia'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Noticias</h1>
          <p className="font-body text-muted-foreground text-sm">Gestión de noticias y publicaciones</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Nueva Noticia</Button>
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
                <TableHead>Autor</TableHead>
                <TableHead>Publicada</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay noticias</TableCell></TableRow>
              ) : filtered.map(n => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium max-w-[280px] truncate">{n.titulo}</TableCell>
                  <TableCell>{n.autor}</TableCell>
                  <TableCell>
                    {n.fechaPublicacion ? (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" /> {n.fechaPublicacion}
                      </span>
                    ) : '—'}
                  </TableCell>
                  <TableCell>
                    {n.publicado
                      ? <Badge className="bg-primary/15 text-primary border-0">Publicada</Badge>
                      : <Badge className="bg-muted text-muted-foreground border-0">Borrador</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(n)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(n.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? 'Editar Noticia' : 'Nueva Noticia'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div><Label>Título *</Label><Input value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} placeholder="Ej: La fundación lanza nuevo programa..." /></div>
            <div><Label>Resumen *</Label><Textarea value={form.resumen} onChange={e => setForm({...form, resumen: e.target.value})} rows={2} placeholder="Breve descripción para listados..." /></div>
            <div><Label>Contenido *</Label><Textarea value={form.contenido} onChange={e => setForm({...form, contenido: e.target.value})} rows={6} placeholder="Contenido completo de la noticia..." /></div>
            <div><Label>Autor *</Label><Input value={form.autor} onChange={e => setForm({...form, autor: e.target.value})} placeholder="Nombre del autor" /></div>

            <CloudinaryUpload
              value={form.imagenUrl}
              onChange={url => setForm({...form, imagenUrl: url})}
              label="Imagen principal"
              folder="fundacion/noticias"
              disabled={saving}
            />

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium font-body">Publicar noticia</p>
                <p className="text-xs text-muted-foreground font-body">
                  {form.publicado
                    ? 'Se publicará hoy y será visible en el sitio'
                    : 'Se guardará como borrador, no visible al público'}
                </p>
              </div>
              <Switch checked={form.publicado} onCheckedChange={v => setForm({...form, publicado: v})} />
            </div>

            {editing && editing.fechaPublicacion && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Publicada originalmente el {editing.fechaPublicacion}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? 'Guardar' : form.publicado ? 'Publicar' : 'Guardar borrador'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar noticia?</AlertDialogTitle>
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

export default AdminNoticias;
