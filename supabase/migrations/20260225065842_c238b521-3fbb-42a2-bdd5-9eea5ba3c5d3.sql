
-- Storage bucket for content images
INSERT INTO storage.buckets (id, name, public) VALUES ('content-images', 'content-images', true);

-- Allow authenticated uploads
CREATE POLICY "Admins can upload content images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'content-images' AND public.is_admin());

CREATE POLICY "Admins can update content images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'content-images' AND public.is_admin());

CREATE POLICY "Admins can delete content images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'content-images' AND public.is_admin());

CREATE POLICY "Public can view content images"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images');

-- Images table linking to proyectos or convocatorias
CREATE TABLE public.contenido_imagenes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('proyecto', 'convocatoria')),
  entity_id UUID NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  orden INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contenido_imagenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access contenido_imagenes" ON public.contenido_imagenes FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Public can view contenido_imagenes" ON public.contenido_imagenes FOR SELECT TO authenticated USING (true);

CREATE INDEX idx_contenido_imagenes_entity ON public.contenido_imagenes (entity_type, entity_id);
