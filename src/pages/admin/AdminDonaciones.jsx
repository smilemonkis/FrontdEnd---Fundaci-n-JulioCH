// src/pages/admin/AdminDonaciones.jsx
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Loader2, Trash2, Printer, Download, DollarSign, TrendingUp, Clock, CheckCircle2, XCircle, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

const ESTADOS = ['PENDIENTE', 'COMPLETADA', 'RECHAZADA', 'CANCELADA'];

const estadoBadgeClass = (estado) => {
  switch (estado) {
    case 'COMPLETADA': return 'bg-primary/15 text-primary border-0';
    case 'PENDIENTE':  return 'bg-accent/15 text-accent border-0';
    default:           return 'bg-muted text-muted-foreground border-0';
  }
};

const AdminDonaciones = () => {
  const [donaciones, setDonaciones]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [deleteId, setDeleteId]         = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo]     = useState('todos');
  const [fechaDesde, setFechaDesde]     = useState('');
  const [fechaHasta, setFechaHasta]     = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/donaciones?page=0&size=200');
      setDonaciones(res.data.content || []);
    } catch {
      toast.error('Error cargando donaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Nombre visible del donante
  const donanteLabel = (d) => {
    if (d.donanteNombre) return d.donanteNombre;
    if (d.usuarioEmail)  return d.usuarioEmail;
    return `Donante #${d.id}`;
  };

  const emailLabel = (d) => d.donanteEmail || d.usuarioEmail || '—';

  const filtered = useMemo(() => donaciones.filter(d => {
    const label      = donanteLabel(d).toLowerCase();
    const em         = emailLabel(d).toLowerCase();
    const matchSearch = label.includes(search.toLowerCase()) || em.includes(search.toLowerCase());
    const matchEstado = filtroEstado === 'todos' || d.estado === filtroEstado;
    const matchTipo   = filtroTipo === 'todos'
      || (filtroTipo === 'aliado'  &&  d.usuarioId)
      || (filtroTipo === 'publico' && !d.usuarioId);
    const fecha      = d.fecha ? d.fecha.split('T')[0] : '';
    const matchDesde = !fechaDesde || fecha >= fechaDesde;
    const matchHasta = !fechaHasta || fecha <= fechaHasta;
    return matchSearch && matchEstado && matchTipo && matchDesde && matchHasta;
  }), [donaciones, search, filtroEstado, filtroTipo, fechaDesde, fechaHasta]);

  const stats = useMemo(() => {
    const total            = filtered.reduce((s, d) => s + Number(d.monto), 0);
    const completadas      = filtered.filter(d => d.estado === 'COMPLETADA');
    const pendientes       = filtered.filter(d => d.estado === 'PENDIENTE');
    const totalCompletadas = completadas.reduce((s, d) => s + Number(d.monto), 0);
    return { total, count: filtered.length, completadas: completadas.length, pendientes: pendientes.length, totalCompletadas };
  }, [filtered]);

  const statsPorProyecto = useMemo(() => {
    const map = {}; let libreTotal = 0, libreCount = 0;
    filtered.forEach(d => {
      if (d.destino === 'LIBRE_INVERSION' || !d.proyectoNombre) { libreTotal += Number(d.monto); libreCount++; }
      else {
        const key = d.proyectoNombre;
        if (!map[key]) map[key] = { nombre: key, total: 0, count: 0 };
        map[key].total += Number(d.monto); map[key].count++;
      }
    });
    return { proyectos: Object.values(map).sort((a, b) => b.total - a.total), libreTotal, libreCount };
  }, [filtered]);

  const handleUpdateEstado = async (id, nuevoEstado) => {
    const endpointMap = { 'COMPLETADA': 'aprobar', 'RECHAZADA': 'rechazar', 'CANCELADA': 'cancelar' };
    const accion = endpointMap[nuevoEstado];
    if (!accion) return;
    try {
      await api.put(`/donaciones/${id}/${accion}`);
      toast.success(`Donación ${nuevoEstado.toLowerCase()}`);
      setDonaciones(prev => prev.map(d => d.id === id ? { ...d, estado: nuevoEstado } : d));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error actualizando estado');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.put(`/donaciones/${deleteId}/cancelar`);
      toast.success('Donación cancelada');
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error cancelando donación');
    }
  };

  const handlePrint = (d) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Comprobante de Donación</title>
      <style>
        body{font-family:system-ui;padding:40px;max-width:600px;margin:0 auto}
        .header{text-align:center;margin-bottom:24px}
        .header h1{font-size:18px;margin:0;color:#2d7a50}
        h2{font-size:16px;border-bottom:2px solid #2d7a50;padding-bottom:8px;margin-top:24px}
        .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee}
        .label{font-weight:600;color:#555}
        .total{font-size:28px;color:#2d7a50;font-weight:bold;text-align:center;margin:24px 0;padding:16px;border:2px dashed #2d7a50;border-radius:8px}
        .footer{margin-top:40px;text-align:center;color:#999;font-size:11px;border-top:1px solid #eee;padding-top:16px}
      </style></head><body>
      <div class="header"><h1>Fundación Julio C. Hernández</h1><p>Comprobante de Donación</p></div>
      <h2>Datos del Comprobante</h2>
      <div class="row"><span class="label">Donante:</span><span>${donanteLabel(d)}</span></div>
      <div class="row"><span class="label">Correo:</span><span>${emailLabel(d)}</span></div>
      <div class="row"><span class="label">Destino:</span><span>${d.destino === 'LIBRE_INVERSION' ? 'Libre Inversión' : d.proyectoNombre || 'Proyecto'}</span></div>
      <div class="row"><span class="label">Fecha:</span><span>${d.fecha ? new Date(d.fecha).toLocaleDateString('es-CO') : '—'}</span></div>
      <div class="row"><span class="label">Estado:</span><span>${d.estado}</span></div>
      <div class="total">$${Number(d.monto).toLocaleString('es-CO')} COP</div>
      <div class="footer"><p>ID: ${d.id} — Fundación Julio C. Hernández — ${new Date().toLocaleDateString('es-CO')}</p></div>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  };

  const handleExport = () => {
    const csv = [
      ['Nombre', 'Email', 'Monto', 'Destino', 'Proyecto', 'Estado', 'Fecha', 'Tipo'].join(','),
      ...filtered.map(d => [
        donanteLabel(d), emailLabel(d), d.monto,
        d.destino, d.proyectoNombre || '',
        d.estado,
        d.fecha ? new Date(d.fecha).toLocaleDateString('es-CO') : '',
        d.usuarioId ? 'Aliado' : 'Público',
      ].join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `donaciones-${new Date().toISOString().slice(0, 7)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success(`Reporte exportado (${filtered.length} registros)`);
  };

  const clearFilters = () => { setFiltroEstado('todos'); setFiltroTipo('todos'); setFechaDesde(''); setFechaHasta(''); setSearch(''); };
  const hasFilters = filtroEstado !== 'todos' || filtroTipo !== 'todos' || fechaDesde || fechaHasta || search;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Donaciones</h1>
          <p className="font-body text-muted-foreground text-sm">Historial y gestión de donaciones</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2"><Download className="w-4 h-4" /> Exportar CSV</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign,    label: 'Total',       value: `$${stats.total.toLocaleString('es-CO')}`, color: 'primary' },
          { icon: TrendingUp,    label: 'Registros',   value: stats.count,                               color: 'secondary' },
          { icon: CheckCircle2,  label: 'Confirmadas', value: stats.completadas,                         color: 'primary' },
          { icon: Clock,         label: 'Pendientes',  value: stats.pendientes,                          color: 'accent' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center`}><Icon className={`w-5 h-5 text-${color}`} /></div>
            <div><p className="text-xs text-muted-foreground font-body">{label}</p><p className="font-heading text-lg font-bold">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Recaudo por proyecto */}
      {(statsPorProyecto.proyectos.length > 0 || statsPorProyecto.libreCount > 0) && (
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3"><FolderOpen className="w-4 h-4 text-primary" /><h3 className="font-heading text-sm font-semibold">Recaudo por Proyecto</h3></div>
          <div className="space-y-2">
            {statsPorProyecto.proyectos.map(p => (
              <div key={p.nombre} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium truncate">{p.nombre}</span>
                    <span className="text-sm font-semibold ml-2">${p.total.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stats.total > 0 ? (p.total / stats.total) * 100 : 0}%` }} />
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">{p.count}</Badge>
              </div>
            ))}
            {statsPorProyecto.libreCount > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Libre Inversión</span>
                    <span className="text-sm font-semibold ml-2">${statsPorProyecto.libreTotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${stats.total > 0 ? (statsPorProyecto.libreTotal / stats.total) * 100 : 0}%` }} />
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 text-xs">{statsPorProyecto.libreCount}</Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <div className="lg:col-span-2">
            <Label className="text-xs text-muted-foreground mb-1 block">Buscar nombre o email</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Nombre o email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Estado</Label>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Tipo</Label>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="aliado">Aliados</SelectItem>
                <SelectItem value="publico">Donantes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Desde</Label>
            <Input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1 block">Hasta</Label>
              <Input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} />
            </div>
            {hasFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters} className="text-muted-foreground shrink-0" title="Limpiar filtros">
                <XCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donante</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No hay donaciones que coincidan</TableCell></TableRow>
              ) : filtered.map(d => (
                <TableRow key={d.id}>
                  <TableCell>
                    <p className="font-medium text-sm">{donanteLabel(d)}</p>
                    <p className="text-xs text-muted-foreground">{emailLabel(d)}</p>
                  </TableCell>
                  <TableCell className="font-semibold">${Number(d.monto).toLocaleString('es-CO')}</TableCell>
                  <TableCell>
                    {d.destino === 'LIBRE_INVERSION'
                      ? <Badge className="bg-secondary/15 text-secondary border-0">Libre Inversión</Badge>
                      : <Badge className="bg-primary/15 text-primary border-0">{d.proyectoNombre || 'Proyecto'}</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge className={d.usuarioId ? 'bg-primary/10 text-primary border-0' : 'bg-muted text-muted-foreground border-0'}>
                      {d.usuarioId ? 'Aliado' : 'Donante'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button>
                          <Badge className={`${estadoBadgeClass(d.estado)} hover:opacity-80 cursor-pointer`}>{d.estado} ▾</Badge>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-1" align="start">
                        {['COMPLETADA', 'RECHAZADA', 'CANCELADA'].map(estado => (
                          <button key={estado} onClick={() => handleUpdateEstado(d.id, estado)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${d.estado === estado ? 'bg-muted font-semibold' : 'hover:bg-muted/50'}`}>
                            <Badge className={estadoBadgeClass(estado)}>{estado}</Badge>
                          </button>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="text-sm">{d.fecha ? new Date(d.fecha).toLocaleDateString('es-CO') : '—'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handlePrint(d)} title="Imprimir comprobante"><Printer className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(d.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
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
            <AlertDialogTitle>¿Cancelar esta donación?</AlertDialogTitle>
            <AlertDialogDescription>La donación pasará a estado CANCELADA.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Cancelar donación</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDonaciones;
