
-- Agregar campos nuevos a profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS apellido text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS direccion text,
  ADD COLUMN IF NOT EXISTS ciudad text,
  ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;

-- Actualizar trigger handle_new_user para incluir nuevos campos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, nombre, apellido, email, telefono, municipio, direccion, ciudad)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'telefono',
    NEW.raw_user_meta_data->>'municipio',
    NEW.raw_user_meta_data->>'direccion',
    NEW.raw_user_meta_data->>'ciudad'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'rol')::app_role, 'ciudadano')
  );

  RETURN NEW;
END;
$function$;
