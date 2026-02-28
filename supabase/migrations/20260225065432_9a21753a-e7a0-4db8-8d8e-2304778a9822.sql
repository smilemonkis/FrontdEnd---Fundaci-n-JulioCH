
-- =============================================
-- TABLA: proyectos
-- =============================================
CREATE TABLE public.proyectos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.proyectos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access proyectos" ON public.proyectos FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Public can view active proyectos" ON public.proyectos FOR SELECT TO authenticated USING (activo = true);

CREATE TRIGGER update_proyectos_updated_at BEFORE UPDATE ON public.proyectos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TABLA: convocatorias
-- =============================================
CREATE TABLE public.convocatorias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  activa BOOLEAN NOT NULL DEFAULT true,
  proyecto_id UUID REFERENCES public.proyectos(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.convocatorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access convocatorias" ON public.convocatorias FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Public can view active convocatorias" ON public.convocatorias FOR SELECT TO authenticated USING (activa = true);

CREATE INDEX idx_conv_fechas ON public.convocatorias (fecha_inicio, fecha_fin);

CREATE TRIGGER update_convocatorias_updated_at BEFORE UPDATE ON public.convocatorias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TABLA: donaciones
-- =============================================
CREATE TABLE public.donaciones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donante_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  monto NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  finalidad TEXT NOT NULL DEFAULT 'libre_inversion',
  proyecto_id UUID REFERENCES public.proyectos(id) ON DELETE SET NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.donaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access donaciones" ON public.donaciones FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Donors can view own donaciones" ON public.donaciones FOR SELECT TO authenticated USING (auth.uid() = donante_id);
CREATE POLICY "Donors can insert own donaciones" ON public.donaciones FOR INSERT TO authenticated WITH CHECK (auth.uid() = donante_id);
