// src/pages/admin/AdminAliados.jsx
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, Trash2, Pencil, User, Building2, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const AdminAliados = () => {
  const [aliados, setAliados]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [filtroTipo, setFiltroTipo]     = useState('todos');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget]     = useState(null);
  const [editForm, setEditForm]         = useState({});
  const [saving, setSaving]             = useState(false);
  const [expandedId, setExpandedId]     = useState(null);
  const [donaciones, setDonaciones]     = useState({});
  const [loadingDon, setLoadingDon]     = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [natRes, jurRes] = await Promise.all([
        api.get('/aliados-naturales?page=0&size=100'),
        api.get('/aliados-juridicos?page=0&size=100'),
      ]);
      const naturales = (natRes.data.content || []).map(n => ({ ...n, tipo: 'natural', nombreDisplay: n.nombre || n.email }));
      const juridicos = (jurRes.data.content || []).map(j => ({ ...j, tipo: 'juridico', nombreDisplay: j.razonSocial || j.email }));
      setAliados([...naturales, ...juridicos]);
    } catch {
      toast.error('Error cargando aliados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => aliados.filter(a => {
    const matchSearch = a.nombreDisplay.toLowerCase().includes(search.toLowerCase()) ||
                        (a.email || '').toLowerCase().includes(search.toLowerCase());
    const matchTipo   = filtroTipo === 'todos' || a.tipo === filtroTipo;
    return matchSearch && matchTipo;
  }), [aliados, search, filtroTipo]);

  const fetchDonaciones = async (a) => {
    const key = `${a.tipo}-${a.id}`;
    if (donaciones[key]) return;
    setLoadingDon(key);
    try {
      const res = await api.get(`/donaciones/usuario/${a.usuarioId}?page=0&size=50`);
      setDonaciones(prev => ({ ...prev, [key]: res.data.content || [] }));
    } catch {
      setDonaciones(prev => ({ ...prev, [key]: [] }));
    } finally {
      setLoadingDon(null);
    }
  };

  const toggleExpand = (a) => {
    const key = `${a.tipo}-${a.id}`;
    if (expandedId === key) { setExpandedId(null); return; }
    setExpandedId(key);
    fetchDonaciones(a);
  };

  const openEdit = (a) => {
    setEditTarget(a);
    if (a.tipo === 'natural') {
      setEditForm({ nombre: a.nombre || '', email: a.email || '', telefono: a.telefono || '', direccion: a.direccion || '' });
    } else {
      setEditForm({ razonSocial: a.razonSocial || '', representante: a.representante || '', email: a.email || '', telefono: a.telefono || '', direccion: a.direccion || '' });
    }
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      const endpoint = editTarget.tipo === 'natural'
        ? `/aliados-naturales/${editTarget.id}`
        : `/aliados-juridicos/${editTarget.id}`;
      await api.put(endpoint, editForm);
      toast.success('Aliado actualizado');
      setEditTarget(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error actualizando aliado');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const endpoint = deleteTarget.tipo === 'natural'
        ? `/aliados-naturales/${deleteTarget.id}`
        : `/aliados-juridicos/${deleteTarget.id}`;
      await api.delete(endpoint);
      toast.success('Aliado eliminado');
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error eliminando aliado');
    }
  };

  const getDonTotal = (key) => (donaciones[key] || []).reduce((s, d) => s + Number(d.monto), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Aliados</h1>
        <p className="font-body text-muted-foreground text-sm">Gestión de aliados naturales y jurídicos</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar aliado..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos ({aliados.length})</SelectItem>
            <SelectItem value="natural">Naturales ({aliados.filter(a => a.tipo === 'natural').length})</SelectItem>
            <SelectItem value="juridico">Jurídicos ({aliados.filter(a => a.tipo === 'juridico').length})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Nombre / Razón Social</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Identificación</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No hay aliados</TableCell></TableRow>
              ) : filtered.map(a => {
                const key = `${a.tipo}-${a.id}`;
                return (
                  <>
                    <TableRow key={key} className="cursor-pointer hover:bg-muted/30" onClick={() => toggleExpand(a)}>
                      <TableCell>{expandedId === key ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}</TableCell>
                      <TableCell>
                        {a.tipo === 'natural'
                          ? <Badge className="bg-secondary/15 text-secondary border-0 gap-1"><User className="w-3 h-3" /> Natural</Badge>
                          : <Badge className="bg-accent/15 text-accent border-0 gap-1"><Building2 className="w-3 h-3" /> Jurídico</Badge>}
                      </TableCell>
                      <TableCell className="font-medium max-w-[180px] truncate">{a.nombreDisplay}</TableCell>
                      <TableCell className="text-sm">{a.email || '—'}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {a.tipo === 'natural' ? `${a.tipoDocumento || ''} ${a.documento || ''}` : `NIT ${a.nit || ''}`}
                      </TableCell>
                      <TableCell className="text-sm">{a.telefono || '—'}</TableCell>
                      <TableCell className="text-sm max-w-[160px] truncate">{a.direccion || '—'}</TableCell>
                      <TableCell className="text-right space-x-1" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(a)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>

                    {expandedId === key && (
                      <TableRow key={`${key}-exp`}>
                        <TableCell colSpan={8} className="bg-muted/20 p-0">
                          <div className="p-4">
                            {/* Datos completos del aliado */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3 bg-card rounded-lg border border-border">
                              {a.tipo === 'natural' ? (
                                <>
                                  <div><p className="text-xs text-muted-foreground">Tipo doc.</p><p className="text-sm font-medium">{a.tipoDocumento || '—'}</p></div>
                                  <div><p className="text-xs text-muted-foreground">Documento</p><p className="text-sm font-medium font-mono">{a.documento || '—'}</p></div>
                                  <div><p className="text-xs text-muted-foreground">Nombre</p><p className="text-sm font-medium">{a.nombre || '—'}</p></div>
                                  <div><p className="text-xs text-muted-foreground">Registrado</p><p className="text-sm">{a.createdAt ? new Date(a.createdAt).toLocaleDateString('es-CO') : '—'}</p></div>
                                </>
                              ) : (
                                <>
                                  <div><p className="text-xs text-muted-foreground">NIT</p><p className="text-sm font-medium font-mono">{a.nit || '—'}</p></div>
                                  <div><p className="text-xs text-muted-foreground">Razón social</p><p className="text-sm font-medium">{a.razonSocial || '—'}</p></div>
                                  <div><p className="text-xs text-muted-foreground">Representante</p><p className="text-sm font-medium">{a.representante || '—'}</p></div>
                                  <div><p className="text-xs text-muted-foreground">Registrado</p><p className="text-sm">{a.createdAt ? new Date(a.createdAt).toLocaleDateString('es-CO') : '—'}</p></div>
                                </>
                              )}
                            </div>

                            {/* Donaciones */}
                            <div className="flex items-center gap-2 mb-3">
                              <DollarSign className="w-4 h-4 text-primary" />
                              <h4 className="font-heading text-sm font-semibold">Historial de Donaciones</h4>
                              {donaciones[key]?.length > 0 && (
                                <Badge className="bg-primary/15 text-primary border-0 ml-auto">
                                  Total: ${getDonTotal(key).toLocaleString('es-CO')}
                                </Badge>
                              )}
                            </div>
                            {loadingDon === key ? (
                              <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>
                            ) : !donaciones[key] || donaciones[key].length === 0 ? (
                              <p className="text-sm text-muted-foreground py-2">Sin donaciones registradas.</p>
                            ) : (
                              <div className="rounded-lg border border-border overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-muted/50">
                                      <TableHead className="text-xs">Fecha</TableHead>
                                      <TableHead className="text-xs">Monto</TableHead>
                                      <TableHead className="text-xs">Destino</TableHead>
                                      <TableHead className="text-xs">Estado</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {donaciones[key].map(d => (
                                      <TableRow key={d.id}>
                                        <TableCell className="text-sm">{d.fecha ? new Date(d.fecha).toLocaleDateString('es-CO') : '—'}</TableCell>
                                        <TableCell className="text-sm font-semibold">${Number(d.monto).toLocaleString('es-CO')}</TableCell>
                                        <TableCell className="text-sm">{d.destino === 'LIBRE_INVERSION' ? 'Libre Inversión' : d.proyectoNombre || 'Proyecto'}</TableCell>
                                        <TableCell>
                                          <Badge className={d.estado === 'COMPLETADA' ? 'bg-primary/15 text-primary border-0' : d.estado === 'PENDIENTE' ? 'bg-accent/15 text-accent border-0' : 'bg-muted text-muted-foreground border-0'}>
                                            {d.estado}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog editar */}
      <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">
              Editar {editTarget?.tipo === 'natural' ? 'Aliado Natural' : 'Aliado Jurídico'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editTarget?.tipo === 'natural' ? (
              <>
                <div>
                  <Label>Nombre</Label>
                  <Input value={editForm.nombre || ''} onChange={e => setEditForm({...editForm, nombre: e.target.value})} />
                </div>
                <div>
                  <Label>Correo electrónico</Label>
                  <Input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input value={editForm.telefono || ''} onChange={e => setEditForm({...editForm, telefono: e.target.value})} />
                </div>
                <div>
                  <Label>Dirección</Label>
                  <Input value={editForm.direccion || ''} onChange={e => setEditForm({...editForm, direccion: e.target.value})} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>Razón social</Label>
                  <Input value={editForm.razonSocial || ''} onChange={e => setEditForm({...editForm, razonSocial: e.target.value})} />
                </div>
                <div>
                  <Label>Representante legal</Label>
                  <Input value={editForm.representante || ''} onChange={e => setEditForm({...editForm, representante: e.target.value})} />
                </div>
                <div>
                  <Label>Correo electrónico</Label>
                  <Input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input value={editForm.telefono || ''} onChange={e => setEditForm({...editForm, telefono: e.target.value})} />
                </div>
                <div>
                  <Label>Dirección</Label>
                  <Input value={editForm.direccion || ''} onChange={e => setEditForm({...editForm, direccion: e.target.value})} />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancelar</Button>
            <Button onClick={handleEditSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog eliminar */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este aliado?</AlertDialogTitle>
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

export default AdminAliados;
