// src/pages/aliado/AliadoPerfil.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { User, Building2, MapPin, Phone, Mail, Pencil, Eye, EyeOff, Loader2, KeyRound, CreditCard, Hash, Lock } from 'lucide-react';
import { toast } from 'sonner';

const INDICATIVOS = [
  { code: '+57',  flag: '🇨🇴', label: 'CO' },
  { code: '+1',   flag: '🇺🇸', label: 'US' },
  { code: '+58',  flag: '🇻🇪', label: 'VE' },
  { code: '+593', flag: '🇪🇨', label: 'EC' },
  { code: '+51',  flag: '🇵🇪', label: 'PE' },
  { code: '+52',  flag: '🇲🇽', label: 'MX' },
  { code: '+34',  flag: '🇪🇸', label: 'ES' },
];

const emailValido = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// Parsea un teléfono guardado como "+573001234567" en indicativo + número
const parseTelefono = (tel) => {
  if (!tel) return { indicativo: '+57', numero: '' };
  const ind = INDICATIVOS.find(i => tel.startsWith(i.code));
  if (ind) return { indicativo: ind.code, numero: tel.slice(ind.code.length) };
  return { indicativo: '+57', numero: tel };
};

const AliadoPerfil = () => {
  const { user } = useAuth();
  const [detalle, setDetalle]       = useState(null);
  const [tipoAliado, setTipoAliado] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [editField, setEditField]   = useState(null);
  const [editValue, setEditValue]   = useState('');
  const [indicativo, setIndicativo] = useState('+57');
  const [telefonoNum, setTelefonoNum] = useState('');
  const [passOpen, setPassOpen]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [pass, setPass]             = useState({ actual: '', nueva: '', confirmar: '' });
  const [showPass, setShowPass]     = useState({ actual: false, nueva: false, confirmar: false });

  const fetchDetalle = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const rol = user.rol?.toUpperCase();
      const esNatural  = rol === 'ALIADO_NAT'  || rol === 'ALIADO_NATURAL';
      const esJuridico = rol === 'ALIADO_JUR'  || rol === 'ALIADO_JURIDICO';
      if (esNatural) {
        const res = await api.get('/aliados-naturales?page=0&size=100');
        const found = (res.data.content || []).find(a => Number(a.usuarioId) === Number(user.id));
        setDetalle(found || null);
        setTipoAliado('natural');
      } else if (esJuridico) {
        const res = await api.get('/aliados-juridicos?page=0&size=100');
        const found = (res.data.content || []).find(a => Number(a.usuarioId) === Number(user.id));
        setDetalle(found || null);
        setTipoAliado('juridico');
      }
    } catch { toast.error('Error cargando perfil'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDetalle(); }, [user]);

  const openEdit = (field, value) => {
    setFieldError('');
    setEditField(field);
    if (field === 'telefono') {
      const parsed = parseTelefono(value);
      setIndicativo(parsed.indicativo);
      setTelefonoNum(parsed.numero);
    } else {
      setEditValue(value || '');
    }
  };

  const validarField = () => {
    if (editField === 'email') {
      if (!editValue.trim()) { setFieldError('El correo es requerido'); return false; }
      if (!emailValido(editValue)) { setFieldError('Correo electrónico inválido'); return false; }
    }
    if (editField === 'telefono') {
      if (!telefonoNum.trim()) { setFieldError('El teléfono es requerido'); return false; }
      if (!/^\d+$/.test(telefonoNum)) { setFieldError('Solo números sin espacios'); return false; }
      if (telefonoNum.length < 7) { setFieldError('Mínimo 7 dígitos'); return false; }
    }
    if (editField === 'direccion' && !editValue.trim()) {
      setFieldError('La dirección es requerida'); return false;
    }
    if (editField === 'representante' && !editValue.trim()) {
      setFieldError('El representante es requerido'); return false;
    }
    return true;
  };

  const handleSaveField = async () => {
    if (!validarField()) return;
    setSaving(true);
    try {
      const endpoint = tipoAliado === 'natural'
        ? `/aliados-naturales/${detalle.id}`
        : `/aliados-juridicos/${detalle.id}`;
      const valor = editField === 'telefono' ? `${indicativo}${telefonoNum}` : editValue;
      await api.put(endpoint, { [editField]: valor });
      toast.success('Campo actualizado');
      setEditField(null);
      fetchDetalle();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error actualizando');
    } finally { setSaving(false); }
  };

  const handleSavePass = async () => {
    if (!pass.actual)                         { toast.error('Ingresa tu contraseña actual'); return; }
    if (pass.nueva.length < 8)               { toast.error('Mínimo 8 caracteres'); return; }
    if (!/[A-Z]/.test(pass.nueva))           { toast.error('Debe tener al menos una mayúscula'); return; }
    if (!/\d/.test(pass.nueva))              { toast.error('Debe tener al menos un número'); return; }
    if (pass.nueva !== pass.confirmar)        { toast.error('Las contraseñas no coinciden'); return; }
    setSaving(true);
    try {
      await api.put(`/usuarios/${user.id}/cambiar-password`, {
        passwordActual: pass.actual,
        passwordNueva:  pass.nueva,
      });
      toast.success('Contraseña actualizada');
      setPassOpen(false);
      setPass({ actual: '', nueva: '', confirmar: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error actualizando contraseña');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-12 text-muted-foreground font-body">Cargando perfil...</div>;

  const campos = tipoAliado === 'natural' ? [
    { key: 'nombre',        label: 'Nombre completo',    icon: <User className="w-4 h-4" />,       value: detalle?.nombre,        editable: false },
    { key: 'tipoDocumento', label: 'Tipo de documento',  icon: <CreditCard className="w-4 h-4" />, value: detalle?.tipoDocumento, editable: false },
    { key: 'documento',     label: 'Número documento',   icon: <Hash className="w-4 h-4" />,       value: detalle?.documento,     editable: false },
    { key: 'email',         label: 'Correo electrónico', icon: <Mail className="w-4 h-4" />,       value: detalle?.email,         editable: true,  type: 'email' },
    { key: 'telefono',      label: 'Teléfono',           icon: <Phone className="w-4 h-4" />,      value: detalle?.telefono,      editable: true,  isTel: true },
    { key: 'direccion',     label: 'Dirección',          icon: <MapPin className="w-4 h-4" />,     value: detalle?.direccion,     editable: true },
  ] : [
    { key: 'nit',           label: 'NIT',                icon: <Hash className="w-4 h-4" />,       value: detalle?.nit,           editable: false },
    { key: 'razonSocial',   label: 'Razón social',       icon: <Building2 className="w-4 h-4" />,  value: detalle?.razonSocial,   editable: false },
    { key: 'representante', label: 'Representante legal',icon: <User className="w-4 h-4" />,       value: detalle?.representante, editable: true },
    { key: 'email',         label: 'Correo electrónico', icon: <Mail className="w-4 h-4" />,       value: detalle?.email,         editable: true,  type: 'email' },
    { key: 'telefono',      label: 'Teléfono',           icon: <Phone className="w-4 h-4" />,      value: detalle?.telefono,      editable: true,  isTel: true },
    { key: 'direccion',     label: 'Dirección',          icon: <MapPin className="w-4 h-4" />,     value: detalle?.direccion,     editable: true },
  ];

  const campoActual = campos.find(c => c.key === editField);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Mi Perfil</h1>
          <p className="font-body text-muted-foreground">Información de tu cuenta</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setPassOpen(true)}>
          <KeyRound className="w-4 h-4" /> Cambiar contraseña
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {tipoAliado === 'juridico' ? <Building2 className="w-7 h-7 text-primary" /> : <User className="w-7 h-7 text-primary" />}
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {tipoAliado === 'juridico' ? detalle?.razonSocial : detalle?.nombre || user?.profile?.nombreDisplay || user.email}
            </h2>
            <span className="px-2.5 py-0.5 text-xs rounded-full font-medium bg-cta/10 text-cta">
              {tipoAliado === 'juridico' ? 'Aliado Jurídico' : 'Aliado Natural'}
            </span>
          </div>
        </div>

        <div className="divide-y divide-border">
          {campos.map(c => (
            <div key={c.key} className="flex items-center justify-between py-3 gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                  {c.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-body text-muted-foreground">{c.label}</p>
                  <p className="font-body text-sm font-medium text-foreground truncate">{c.value || '—'}</p>
                </div>
              </div>
              {c.editable ? (
                <button onClick={() => openEdit(c.key, c.value)}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                  title={`Editar ${c.label}`}>
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="w-7 h-7 flex items-center justify-center shrink-0" title="No modificable">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!detalle && !loading && (
        <div className="bg-card rounded-xl border border-border p-6 text-center text-muted-foreground font-body text-sm">
          No se encontraron datos de perfil asociados a tu cuenta.
        </div>
      )}

      {/* Dialog editar campo */}
      <Dialog open={!!editField} onOpenChange={() => { setEditField(null); setFieldError(''); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading">Editar {campoActual?.label}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            {campoActual?.isTel ? (
              <div>
                <Label>Teléfono</Label>
                <div className={`flex rounded-lg border overflow-hidden mt-1 ${fieldError ? 'border-destructive' : 'border-input'}`}>
                  <select value={indicativo} onChange={e => setIndicativo(e.target.value)}
                    className="bg-muted px-2 py-2.5 text-sm font-body border-r border-input focus:outline-none shrink-0">
                    {INDICATIVOS.map(i => (
                      <option key={i.code} value={i.code}>{i.flag} {i.code}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={telefonoNum}
                    onChange={e => setTelefonoNum(e.target.value.replace(/\D/g, ''))}
                    placeholder="300 811 8210"
                    inputMode="numeric"
                    maxLength={10}
                    autoFocus
                    className="flex-1 px-3 py-2.5 text-sm font-body bg-background focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <Label>{campoActual?.label}</Label>
                <Input
                  type={campoActual?.type || 'text'}
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  autoFocus
                  className={`mt-1 ${fieldError ? 'border-destructive' : ''}`}
                />
              </div>
            )}
            {fieldError && <p className="text-xs text-destructive">{fieldError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditField(null); setFieldError(''); }}>Cancelar</Button>
            <Button onClick={handleSaveField} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog contraseña */}
      <Dialog open={passOpen} onOpenChange={setPassOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-heading">Cambiar Contraseña</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              { key: 'actual',    label: 'Contraseña actual' },
              { key: 'nueva',     label: 'Nueva contraseña' },
              { key: 'confirmar', label: 'Confirmar nueva contraseña' },
            ].map(({ key, label }) => (
              <div key={key}>
                <Label>{label}</Label>
                <div className="relative mt-1">
                  <Input
                    type={showPass[key] ? 'text' : 'password'}
                    value={pass[key]}
                    onChange={e => setPass({...pass, [key]: e.target.value})}
                    className="pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(s => ({...s, [key]: !s[key]}))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            {pass.nueva && (
              <div className="space-y-1 text-xs">
                <p className={pass.nueva.length >= 8 ? 'text-primary' : 'text-muted-foreground'}>
                  {pass.nueva.length >= 8 ? '✓' : '○'} Mínimo 8 caracteres
                </p>
                <p className={/[A-Z]/.test(pass.nueva) ? 'text-primary' : 'text-muted-foreground'}>
                  {/[A-Z]/.test(pass.nueva) ? '✓' : '○'} Al menos una mayúscula
                </p>
                <p className={/\d/.test(pass.nueva) ? 'text-primary' : 'text-muted-foreground'}>
                  {/\d/.test(pass.nueva) ? '✓' : '○'} Al menos un número
                </p>
              </div>
            )}
            {pass.nueva && pass.confirmar && (
              <p className={`text-xs ${pass.nueva === pass.confirmar ? 'text-primary' : 'text-destructive'}`}>
                {pass.nueva === pass.confirmar ? '✓ Las contraseñas coinciden' : '✗ No coinciden'}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPassOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePass} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AliadoPerfil;
