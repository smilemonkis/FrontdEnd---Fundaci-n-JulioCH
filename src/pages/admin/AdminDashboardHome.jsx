// src/pages/admin/AdminDashboardHome.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FolderKanban, Users, Heart, Megaphone, Loader2,
  ArrowUpRight, CalendarDays, Clock, CheckCircle2,
  ArrowRight, ExternalLink
} from 'lucide-react';
import {
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted-foreground))',
];

const AdminDashboardHome = () => {
  const navigate = useNavigate();
  const [kpis, setKpis]                       = useState(null);
  const [recentDonaciones, setRecentDonaciones] = useState([]);
  const [proyectos, setProyectos]               = useState([]);
  const [donacionesPorMes, setDonacionesPorMes] = useState([]);
  const [loading, setLoading]                   = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Llamadas paralelas a Spring Boot
        // Usamos size grande para obtener todos los registros en el dashboard
        const [proyRes, aliNatRes, aliJurRes, donRes, convRes] = await Promise.all([
          api.get('/proyectos?page=0&size=100'),
          api.get('/aliados-naturales?page=0&size=1'),
          api.get('/aliados-juridicos?page=0&size=1'),
          api.get('/donaciones?page=0&size=100'),
          api.get('/convocatorias?page=0&size=100'),
        ]);

        // Spring Boot devuelve Page<T>: { content, totalElements, ... }
        const proyData = proyRes.data.content     || [];
        const donData  = donRes.data.content      || [];
        const convData = convRes.data.content     || [];
        const totalAliNat = aliNatRes.data.totalElements || 0;
        const totalAliJur = aliJurRes.data.totalElements || 0;

        const pendientes  = donData.filter(d => d.estado === 'PENDIENTE');
        const confirmadas = donData.filter(d => d.estado === 'COMPLETADA');

        setProyectos(proyData.slice(0, 5));

        setKpis({
          totalProyectos:        proyData.length,
          proyectosActivos:      proyData.filter(p => p.activo).length,
          totalAliados:          totalAliNat + totalAliJur,
          totalDonaciones:       donData.length,
          montoDonaciones:       donData.reduce((s, d) => s + Number(d.monto), 0),
          convocatoriasActivas:  convData.filter(c => c.activa).length,
          totalConvocatorias:    convData.length,
          donacionesPendientes:  pendientes.length,
          montoPendiente:        pendientes.reduce((s, d) => s + Number(d.monto), 0),
          donacionesConfirmadas: confirmadas.length,
        });

        // Últimas 5 donaciones para la tabla reciente
        setRecentDonaciones(donData.slice(0, 5));

        // Agrupar donaciones por mes (últimos 6 meses)
        const meses = {};
        const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          meses[key] = 0;
        }
        donData.forEach(d => {
          if (!d.fecha) return;
          const key = d.fecha.slice(0, 7);
          if (key in meses) meses[key] += Number(d.monto);
        });
        setDonacionesPorMes(
          Object.entries(meses).map(([k, v]) => ({
            mes:   monthNames[parseInt(k.split('-')[1]) - 1],
            monto: v,
          }))
        );
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const k = kpis;
  const pieData = [
    { name: 'Activos',  value: k.proyectosActivos },
    { name: 'Cerrados', value: k.totalProyectos - k.proyectosActivos },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="font-body text-muted-foreground mt-1">Resumen general de la Fundación</p>
        </div>
        <p className="text-xs font-body text-muted-foreground flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Proyectos Activos"  value={`${k.proyectosActivos}`}                           subtitle={`de ${k.totalProyectos} totales`}    icon={FolderKanban} accent="primary"   onClick={() => navigate('/admin/proyectos')} />
        <KPICard title="Convocatorias"      value={`${k.convocatoriasActivas}`}                       subtitle={`${k.totalConvocatorias} en total`}  icon={Megaphone}    accent="secondary" onClick={() => navigate('/admin/convocatorias')} />
        <KPICard title="Aliados"            value={`${k.totalAliados}`}                               subtitle="naturales y jurídicos"               icon={Users}        accent="accent"    onClick={() => navigate('/admin/aliados')} />
        <KPICard title="Total Donaciones"   value={`$${k.montoDonaciones.toLocaleString('es-CO')}`}   subtitle={`${k.totalDonaciones} donaciones`}   icon={Heart}        accent="primary"   onClick={() => navigate('/admin/donaciones')} />
      </div>

      {/* Pendientes / Confirmadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => navigate('/admin/donaciones')} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 hover:border-accent hover:shadow-md transition-all group text-left">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-body">Pendientes por aprobar</p>
            <p className="font-heading text-xl font-bold text-foreground">{k.donacionesPendientes}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
        </button>
        <button onClick={() => navigate('/admin/donaciones')} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 hover:border-primary hover:shadow-md transition-all group text-left">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-body">Confirmadas</p>
            <p className="font-heading text-xl font-bold text-foreground">{k.donacionesConfirmadas}</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-body font-medium text-muted-foreground">Donaciones — Últimos 6 meses</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground" onClick={() => navigate('/admin/donaciones')}>
                Ver todo <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={donacionesPorMes} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }}
                  formatter={(value) => [`$${value.toLocaleString('es-CO')}`, 'Monto']}
                />
                <Area type="monotone" dataKey="monto" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorMonto)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/proyectos')}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-body font-medium text-muted-foreground">Estado de Proyectos</CardTitle>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                  <span className="text-xs font-body text-muted-foreground">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tablas recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Donaciones recientes */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-body font-medium text-muted-foreground">Donaciones Recientes</CardTitle>
              {k.donacionesPendientes > 0 && (
                <Badge className="text-xs border-accent text-accent bg-accent/10">
                  {k.donacionesPendientes} pendiente{k.donacionesPendientes > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentDonaciones.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Sin donaciones registradas</p>
            ) : recentDonaciones.map(d => (
              <div key={d.id} className="w-full flex items-center justify-between py-2.5 px-2 rounded-lg border-b border-border last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${d.estado === 'COMPLETADA' ? 'bg-primary/10' : 'bg-accent/10'}`}>
                    <Heart className={`w-4 h-4 ${d.estado === 'COMPLETADA' ? 'text-primary' : 'text-accent'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{d.usuarioEmail || `Usuario #${d.usuarioId}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.fecha ? new Date(d.fecha).toLocaleDateString('es-CO') : '—'}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-semibold text-foreground">${Number(d.monto).toLocaleString('es-CO')}</p>
                  <Badge className={`text-[10px] px-1.5 ${d.estado === 'COMPLETADA' ? 'bg-primary/15 text-primary border-0' : d.estado === 'PENDIENTE' ? 'bg-accent/15 text-accent border-0' : 'bg-muted text-muted-foreground border-0'}`}>
                    {d.estado}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground text-xs" onClick={() => navigate('/admin/donaciones')}>
              Ver todas <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Proyectos recientes */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-body font-medium text-muted-foreground">Proyectos Recientes</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground" onClick={() => navigate('/admin/proyectos')}>
                Ver todos <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {proyectos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Sin proyectos</p>
            ) : proyectos.map(p => (
              <button key={p.id} onClick={() => navigate('/admin/proyectos')} className="w-full flex items-center justify-between py-2.5 px-2 rounded-lg border-b border-border last:border-0 hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${p.activo ? 'bg-primary/10' : 'bg-muted'}`}>
                    <FolderKanban className={`w-4 h-4 ${p.activo ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.nombre}</p>
                    <p className="text-xs text-muted-foreground font-mono">{p.codigo}</p>
                  </div>
                </div>
                <Badge className={`text-[10px] px-1.5 shrink-0 ${p.activo ? 'bg-primary/15 text-primary border-0' : 'bg-muted text-muted-foreground border-0'}`}>
                  {p.activo ? 'Activo' : 'Cerrado'}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function KPICard({ title, value, subtitle, icon: Icon, accent, onClick }) {
  return (
    <Card className="border border-border group hover:shadow-md transition-all duration-200 overflow-hidden relative cursor-pointer hover:border-primary/30" onClick={onClick}>
      <div className={`absolute top-0 left-0 w-1 h-full bg-${accent}`} />
      <CardHeader className="flex flex-row items-center justify-between pb-1 pl-5">
        <CardTitle className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wide">{title}</CardTitle>
        <div className={`w-8 h-8 rounded-lg bg-${accent}/10 flex items-center justify-center`}>
          <Icon className={`h-4 w-4 text-${accent}`} />
        </div>
      </CardHeader>
      <CardContent className="pl-5">
        <div className="text-2xl font-heading font-bold text-foreground">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-xs font-body text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminDashboardHome;