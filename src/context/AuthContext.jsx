import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginService, registerService } from '../services/authService';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const mapearRol = (rolBackend) => {
  switch (rolBackend?.toUpperCase()) {
    case 'ADMIN':       return 'admin';
    case 'ALIADO_NAT':  return 'donante_aliado';
    case 'ALIADO_JUR':  return 'donante_aliado';
    case 'ESTUDIANTE':  return 'estudiante';
    case 'ASPIRANTE':   return 'aspirante';
    default:            return 'ciudadano';
  }
};

const construirNombreDisplay = (data) => {
  if (data.razonSocial) return data.razonSocial;
  if (data.nombre)      return data.nombre;
  return data.email;
};

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); }
      catch { localStorage.clear(); }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await loginService(email, password);
      const userData = {
        id:     data.userId,
        email:  data.email,
        rol:    data.rol,
        role:   mapearRol(data.rol),
        activo: data.activo,
        token:  data.token,
        profile: {
          nombreDisplay: construirNombreDisplay(data),
          nombre:        data.nombre      ?? null,
          razonSocial:   data.razonSocial ?? null,
          nit:           data.nit         ?? null,
          email:         data.email,
          telefono:      null,
          direccion:     null,
        },
      };
      setUser(userData);
      localStorage.setItem('user',  JSON.stringify(userData));
      localStorage.setItem('token', data.token);

      // ✅ Toast de bienvenida con nombre real
      const nombre = construirNombreDisplay(data);
      toast.success(`¡Bienvenido, ${nombre}! 👋`, {
        description: mapearRol(data.rol) === 'admin'
          ? 'Accediendo al panel de administración...'
          : 'Accediendo a tu panel de aliado...',
        duration: 3000,
      });

      return { success: true, message: 'Bienvenido', role: userData.role };
    } catch (error) {
      // ❌ Toast de error
      toast.error('No pudimos iniciar sesión', {
        description: error.message || 'Verifica tu correo y contraseña.',
        duration: 4000,
      });
      return { success: false, message: error.message || 'Error de credenciales', role: null };
    }
  }, []);

  const register = useCallback(async (formData, tipoAliado) => {
    try {
      await registerService(formData, tipoAliado);
      toast.success('¡Registro exitoso!', {
        description: 'Ya puedes iniciar sesión con tu cuenta.',
        duration: 4000,
      });
      return { success: true, message: '¡Registro exitoso!' };
    } catch (error) {
      toast.error('Error en el registro', {
        description: error.message || 'Intenta de nuevo.',
        duration: 4000,
      });
      return { success: false, message: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    const nombre = user?.profile?.nombreDisplay || 'Aliado';
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // 👋 Toast de despedida
    toast.info(`Hasta pronto, ${nombre} 👋`, {
      description: 'Sesión cerrada correctamente.',
      duration: 3000,
    });
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
