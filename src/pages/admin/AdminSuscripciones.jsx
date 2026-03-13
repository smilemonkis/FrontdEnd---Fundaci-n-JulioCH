// src/pages/admin/AdminSuscripciones.jsx
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Trash2, Loader2, Mail, Users } from 'lucide-react';
import { toast } from 'sonner';

const AdminSuscripciones = () => {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/suscripciones?page=0&size=200');
      setItems(res.data.content || []);
    } catch {
      toast.error('Error cargando suscripciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() =>
    items.filter(s => s.email.toLowerCase().includes(search.toLowerCase())),
    [items, search]);

  const activos   = items.filter(s => s.activo).length;
  const inactivos = items.length - activos;

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/suscripciones/${deleteId}`);
      toast.success('Suscripción eliminada');
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error eliminando suscripción');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Suscripciones</h1>
          <p className="font-body text-muted-foreground text-sm">Boletín informativo — lista de correos suscritos</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2"><Users className="w-5 h-5 text-primary" /></div>
          <div><p className="text-2xl font-bold font-heading">{items.length}</p><p className="text-xs text-muted-foreground">Total</p></div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="bg-green-500/10 rounded-lg p-2"><Mail className="w-5 h-5 text-green-600" /></div>
          <div><p className="text-2xl font-bold font-heading text-green-600">{activos}</p><p className="text-xs text-muted-foreground">Activos</p></div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="bg-muted rounded-lg p-2"><Mail className="w-5 h-5 text-muted-foreground" /></div>
          <div><p className="text-2xl font-bold font-heading text-muted-foreground">{inactivos}</p><p className="text-xs text-muted-foreground">Inactivos</p></div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar por correo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Correo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha suscripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No hay suscripciones</TableCell></TableRow>
              ) : filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.email}</TableCell>
                  <TableCell>
                    {s.activo
                      ? <Badge className="bg-primary/15 text-primary border-0">Activo</Badge>
                      : <Badge className="bg-muted text-muted-foreground border-0">Inactivo</Badge>}
                  </TableCell>
                  <TableCell>{s.fechaSuscripcion?.substring(0, 10) || '—'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar suscripción?</AlertDialogTitle>
            <AlertDialogDescription>Se eliminará permanentemente este correo de la lista.</AlertDialogDescription>
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

export default AdminSuscripciones;
