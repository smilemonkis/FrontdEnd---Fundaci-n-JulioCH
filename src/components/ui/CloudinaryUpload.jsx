// src/components/ui/CloudinaryUpload.jsx
// Componente reutilizable para subir imágenes via Cloudinary Upload Widget
// Uso: <CloudinaryUpload value={form.imagenUrl} onChange={url => setForm({...form, imagenUrl: url})} />

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

const CLOUD_NAME = 'dm9ojlpnk'; // ← tu cloud name de Cloudinary

const CloudinaryUpload = ({
  value = '',
  onChange,
  label = 'Imagen principal',
  folder = 'fundacion',
  disabled = false,
}) => {
  const widgetRef = useRef(null);
  const [loading, setLoading]     = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  // Cargar el script de Cloudinary una sola vez
  useEffect(() => {
    if (window.cloudinary) { setScriptReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => setScriptReady(true);
    document.body.appendChild(script);
    return () => { /* no remover — podría usarse en otro componente */ };
  }, []);

  const openWidget = () => {
    if (!scriptReady || !window.cloudinary) return;

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName:      CLOUD_NAME,
          uploadPreset:   'fundacion_unsigned', // ← crea este preset en Cloudinary (unsigned)
          folder:         folder,
          maxFiles:       1,
          maxFileSize:    5000000, // 5MB
          cropping:       false,
          multiple:       false,
          sources:        ['local', 'url', 'camera'],
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          language:       'es',
          text: {
            es: {
              or:           'O',
              back:         'Atrás',
              advanced:     'Avanzado',
              close:        'Cerrar',
              no_results:   'Sin resultados',
              search_placeholder: 'Buscar archivos',
              about_uw:     'Acerca del widget',
              menu:         { files: 'Mis archivos', web: 'Desde URL', camera: 'Cámara' },
              selection_counter: { selected: 'Seleccionado' },
              upload: {
                done:     '¡Listo!',
                singular: 'Subiendo 1 archivo...',
                plural:   'Subiendo {{num}} archivos...',
              },
              local: {
                browse:       'Explorar',
                dd_title_single: 'Arrastra tu imagen aquí',
                dd_title_multi:  'Arrastra tus imágenes aquí',
                drop_title_single: 'Suelta la imagen',
                drop_title_multiple: 'Suelta las imágenes',
              },
            },
          },
        },
        (error, result) => {
          setLoading(false);
          if (error) {
            console.error('Cloudinary error:', error);
            return;
          }
          if (result.event === 'upload-added') setLoading(true);
          if (result.event === 'success') {
            onChange(result.info.secure_url);
          }
        }
      );
    }

    widgetRef.current.open();
  };

  const handleClear = () => {
    onChange('');
    widgetRef.current = null; // reset widget para próxima apertura
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium leading-none">{label}</p>}

      {/* Preview si hay imagen */}
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-border h-36 bg-muted group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Zona de subida si no hay imagen */}
      {!value && (
        <div
          onClick={!disabled ? openWidget : undefined}
          className={`border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors ${
            !disabled ? 'cursor-pointer hover:border-primary/50 hover:bg-muted/50' : 'opacity-50'
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground font-body">Subiendo imagen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm font-body text-muted-foreground">
                Haz clic para subir una imagen
              </p>
              <p className="text-xs text-muted-foreground/60">JPG, PNG o WebP — máx. 5MB</p>
            </div>
          )}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openWidget}
          disabled={disabled || !scriptReady || loading}
          className="gap-2 flex-1"
        >
          {loading
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Subiendo...</>
            : <><Upload className="w-3.5 h-3.5" /> {value ? 'Cambiar imagen' : 'Subir imagen'}</>
          }
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={disabled}
            className="text-destructive hover:text-destructive gap-1"
          >
            <X className="w-3.5 h-3.5" /> Quitar
          </Button>
        )}
      </div>

      {/* Campo URL manual como fallback */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">O pega una URL directamente:</p>
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/..."
          disabled={disabled}
          className="text-xs"
        />
      </div>
    </div>
  );
};

export default CloudinaryUpload;
