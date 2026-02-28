
-- Enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'empleado', 'donante_aliado', 'ciudadano');

-- Enum para tipo de documento
CREATE TYPE public.tipo_documento AS ENUM ('CC', 'TI', 'CE', 'PASAPORTE');

-- Enum para tipo de aliado
CREATE TYPE public.tipo_aliado AS ENUM ('natural', 'juridico');

-- Tabla de perfiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  telefono TEXT,
  municipio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Tabla de roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Aliado natural (persona)
CREATE TABLE public.aliado_natural (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  tipo_documento tipo_documento NOT NULL,
  numero_documento TEXT NOT NULL UNIQUE,
  fecha_nacimiento DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.aliado_natural ENABLE ROW LEVEL SECURITY;

-- Aliado jurídico (empresa)
CREATE TABLE public.aliado_juridico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  nit TEXT NOT NULL UNIQUE,
  razon_social TEXT NOT NULL,
  representante_legal TEXT NOT NULL,
  cargo_representante TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.aliado_juridico ENABLE ROW LEVEL SECURITY;

-- Helper: has_role (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- Trigger para auto-crear perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email, telefono, municipio)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'telefono',
    NEW.raw_user_meta_data->>'municipio'
  );

  -- Asignar rol basado en metadata
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'rol')::app_role, 'ciudadano')
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS: profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "System can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS: user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Only admins can manage roles" ON public.user_roles
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update roles" ON public.user_roles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete roles" ON public.user_roles
  FOR DELETE USING (public.is_admin());

-- RLS: aliado_natural
CREATE POLICY "Owners and admins can view aliado_natural" ON public.aliado_natural
  FOR SELECT USING (profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert own aliado_natural" ON public.aliado_natural
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Owners and admins can update aliado_natural" ON public.aliado_natural
  FOR UPDATE USING (profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "Owners and admins can delete aliado_natural" ON public.aliado_natural
  FOR DELETE USING (profile_id = auth.uid() OR public.is_admin());

-- RLS: aliado_juridico
CREATE POLICY "Owners and admins can view aliado_juridico" ON public.aliado_juridico
  FOR SELECT USING (profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert own aliado_juridico" ON public.aliado_juridico
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Owners and admins can update aliado_juridico" ON public.aliado_juridico
  FOR UPDATE USING (profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "Owners and admins can delete aliado_juridico" ON public.aliado_juridico
  FOR DELETE USING (profile_id = auth.uid() OR public.is_admin());
