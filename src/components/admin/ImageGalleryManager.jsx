import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ImageGalleryManager = ({ entityType, entityId, images, onImagesChange }) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const maxOrden = images.length > 0 ? Math.max(...images.map((i) => i.orden)) + 1 : 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop();
      const path = `${entityType}/${entityId}/${Date.now()}-${i}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('content-images').upload(path, file, { upsert: false });
      if (uploadError) { toast.error(`Error subiendo ${file.name}: ${uploadError.message}`); continue; }
      const { data: urlData } = supabase.storage.from('content-images').getPublicUrl(path);
      const { error: insertError } = await supabase.from('contenido_imagenes').insert({ entity_type: entityType, entity_id: entityId, url: urlData.publicUrl, storage_path: path, orden: maxOrden + i });
      if (insertError) toast.error(`Error guardando referencia: ${insertError.message}`);
    }
    toast.success('Imágenes subidas correctamente');
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    onImagesChange();
  };

  const handleDelete = async (img) => {
    await supabase.storage.from('content-images').remove([img.storage_path]);
    const { error } = await supabase.from('contenido_imagenes').delete().eq('id', img.id);
    if (error) toast.error(error.message); else toast.success('Imagen eliminada');
    onImagesChange();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium font-body text-foreground">Imágenes de referencia</p>
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="gap-2">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          {uploading ? 'Subiendo...' : 'Agregar'}
        </Button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>
      {images.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <ImagePlus className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground font-body">Sin imágenes. Haz clic en "Agregar" para subir.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.sort((a, b) => a.orden - b.orden).map((img) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-muted">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button onClick={() => handleDelete(img)} className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" title="Eliminar imagen"><X className="w-3.5 h-3.5" /></button>
              {img.orden === 0 && <span className="absolute bottom-1.5 left-1.5 bg-primary/90 text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">Principal</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ImageGalleryManager;
