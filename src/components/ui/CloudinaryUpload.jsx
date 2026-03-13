// src/components/ui/CloudinaryUpload.jsx
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

const CLOUD_NAME  = 'dm9ojlpnk';
const UPLOAD_PRESET = 'fundacion_unsigned';

const CloudinaryUpload = ({
  value = '',
  onChange,
  label = 'Imagen',
  folder = 'fundacion',
  disabled = false,
}) => {
  const inputRef          = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Solo JPG, PNG o WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Máximo 5MB');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        setError('Error subiendo imagen');
      }
    } catch {
      setError('Error de conexión con Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    onChange('');
    setError('');
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium leading-none">{label}</p>}

      {/* Preview */}
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-border h-36 bg-muted group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
          className={`border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors ${
            !disabled && !uploading ? 'cursor-pointer hover:border-primary/50 hover:bg-muted/50' : 'opacity-50'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Arrastra una imagen o haz click para seleccionar</p>
              <p className="text-xs text-muted-foreground/60">JPG, PNG o WebP — máx. 5MB</p>
            </div>
          )}
        </div>
      )}

      {/* Input file oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled || uploading}
      />

      {/* Botones */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className="gap-2 flex-1"
        >
          {uploading
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Subiendo...</>
            : <><Upload className="w-3.5 h-3.5" /> {value ? 'Cambiar imagen' : 'Seleccionar imagen'}</>
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

      {/* Error */}
      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* URL manual fallback */}
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
