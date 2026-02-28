import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginService, registerService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await loginService(email, password);
      const userData = {
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        role: data.rol.toLowerCase(), 
        token: data.token
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      return { success: true, message: 'Bienvenido', role: userData.role };
    } catch (error) {
      return { success: false, message: error.message || 'Error de credenciales', role: null };
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      let rolParaBackend = "ALIADO_NAT"; 
      
      if (formData.rol === 'donante_aliado') {
        rolParaBackend = "ALIADO_NAT"; 
      } else if (formData.rol === 'admin') {
        rolParaBackend = "ADMIN";
      }

      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        rol: rolParaBackend 
      };

      await registerService(payload);
      return { success: true, message: '¡Registro exitoso!' };
    } catch (error) {
      const msg = error.message.includes("RolEnum") 
        ? "El tipo de usuario no es válido para el servidor." 
        : error.message;
      return { success: false, message: msg };
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};