// src/pages/admin/AdminContacto.jsx
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, Trash2, Mail, Phone, User, MessageSquare, Eye } from 'lucide-react';
import { toast } from 'sonner';

const ESTADOS = [
  { value: 'NUEVO',      label: 'Nuevo',      color: 'bg-accent/15 text-accent border-0' },
  { value: 'LEIDO',      label: 'Leído',      color: 'bg-muted text-muted-foreground border-0' },
  { value: 'RESPONDIDO', label: 'Respondido', color: 'bg-primary/15 text-primary border-0' },
];

const AdminContacto = () => {
  const [mensajes, setMensajes]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [viewing, setViewing]     = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [filtro, setFiltro]       = useState('todos');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contacto?page=0&size=100');
      setMensajes(res.data.content || []);
    } catch { toast.error('Error cargando mensajes'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() =>
    filtro === 'todos' ? mensajes : mensajes.filter(m => m.estado === filtro),
    [mensajes, filtro]);

  const handleVerMensaje = async (m) => {
    setViewing(m);
    if (m.estado === 'NUEVO') {
      try {
        await api.put(`/contacto/${m.id}/estado?estado=LEIDO`);
        setMensajes(prev => prev.map(x => x.id === m.id ? {...x, estado: 'LEIDO'} : x));
      } catch {}
    }
  };

  const handleEstado = async (id, estado) => {
    try {
      await api.put(`/contacto/${id}/estado?estado=${estado}`);
      toast.success('Estado actualizado');
      setMensajes(prev => prev.map(m => m.id === id ? {...m, estado} : m));
      if (viewing?.id === id) setViewing(prev => ({...prev, estado}));
    } catch { toast.error('Error actualizando estado'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/contacto/${deleteId}`);
      toast.success('Mensaje eliminado');
      setDeleteId(null);
      if (viewing?.id === deleteId) setViewing(null);
      fetchData();
    } catch { toast.error('Error eliminando'); }
  };

  const estadoInfo = (e) => ESTADOS.find(x => x.value === e) || ESTADOS[0];
  const nuevos = mensajes.filter(m => m.estado === 'NUEVO').length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            Mensajes de Contacto
            {nuevos > 0 && (
              <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                {nuevos}
              </span>
            )}
          </h1>
          <p className="font-body text-muted-foreground text-sm">Mensajes recibidos desde el formulario de contacto</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[{v:'todos',l:`Todos (${mensajes.length})`}, ...ESTADOS.map(e=>({v:e.value,l:e.label}))].map(f => (
          <button key={f.v} onClick={() => setFiltro(f.v)}
            className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${filtro === f.v ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {f.l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay mensajes</TableCell></TableRow>
              ) : filtered.map(m => (
                <TableRow key={m.id} className={m.estado === 'NUEVO' ? 'bg-accent/5' : ''}>
                  <TableCell className="font-medium">{m.nombre}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.correo}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString('es-CO') : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge className={estadoInfo(m.estado).color}>{estadoInfo(m.estado).label}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleVerMensaje(m)} title="Ver mensaje">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(m.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog ver mensaje */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Mensaje de {viewing?.nombre}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div><p className="text-xs text-muted-foreground">Nombre</p><p className="text-sm font-medium">{viewing.nombre}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div><p className="text-xs text-muted-foreground">Correo</p>
                    <a href={`mailto:${viewing.correo}`} className="text-sm font-medium text-primary hover:underline">{viewing.correo}</a>
                  </div>
                </div>
                {viewing.telefono && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div><p className="text-xs text-muted-foreground">Teléfono</p>
                      <a href={`tel:${viewing.telefono}`} className="text-sm font-medium text-primary hover:underline">{viewing.telefono}</a>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <div><p className="text-xs text-muted-foreground">Fecha</p>
                    <p className="text-sm">{viewing.createdAt ? new Date(viewing.createdAt).toLocaleDateString('es-CO') : '—'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
                <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Mensaje</p>
                  <p className="text-sm whitespace-pre-wrap">{viewing.mensaje}</p>
                </div>
              </div>

              {/* Cambiar estado */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Marcar como:</span>
                {ESTADOS.map(e => (
                  <button key={e.value} onClick={() => handleEstado(viewing.id, e.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${viewing.estado === e.value ? 'ring-2 ring-primary' : 'hover:opacity-80'} ${e.color}`}>
                    {e.label}
                  </button>
                ))}
              </div>

              {/* Responder por correo */}
              <a href={`mailto:${viewing.correo}?subject=Re: Mensaje recibido — Fundación Julio C.H.`}
                className="block w-full text-center bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
                Responder por correo
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este mensaje?</AlertDialogTitle>
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

export default AdminContacto;
