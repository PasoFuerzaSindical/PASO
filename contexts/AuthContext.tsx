
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { AdminUser } from '../lib/types';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: string | null;
  admins: AdminUser[];
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  addAdmin: (user: string, pass: string) => boolean;
  removeAdmin: (id: string) => void;
  updatePassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default credentials for the very first run
const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASS = 'paso2026!';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('paso-auth', false);
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>('paso-current-user', null);
  const [admins, setAdmins] = useLocalStorage<AdminUser[]>('paso-admins', []);
  const navigate = useNavigate();

  // On initial load, create a default admin if none exist
  useEffect(() => {
    if (admins.length === 0) {
      setAdmins([
        {
          id: 'default',
          username: DEFAULT_ADMIN_USER,
          password: DEFAULT_ADMIN_PASS,
        },
      ]);
    }
  }, [admins, setAdmins]);

  const login = (user: string, pass: string): boolean => {
    const admin = admins.find(a => a.username === user);
    if (admin && admin.password === pass) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      navigate('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/');
  };

  const updatePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return { success: false, message: "No hay sesión activa." };
    
    const adminIndex = admins.findIndex(a => a.username === currentUser);
    if (adminIndex === -1) return { success: false, message: "Usuario no encontrado." };
    
    if (admins[adminIndex].password !== oldPass) {
      return { success: false, message: "La contraseña actual es incorrecta." };
    }

    const updatedAdmins = [...admins];
    updatedAdmins[adminIndex] = { ...updatedAdmins[adminIndex], password: newPass };
    setAdmins(updatedAdmins);
    
    return { success: true, message: "Contraseña actualizada correctamente." };
  };

  const addAdmin = (user: string, pass: string): boolean => {
    if (admins.some(a => a.username.toLowerCase() === user.toLowerCase())) {
        return false; // User already exists
    }
    const newAdmin: AdminUser = {
        id: new Date().toISOString(),
        username: user,
        password: pass,
    };
    setAdmins(prev => [...prev, newAdmin]);
    return true;
  };

  const removeAdmin = (id: string) => {
    if (admins.length <= 1) {
        alert("No se puede eliminar al último administrador.");
        return;
    }
    setAdmins(prev => prev.filter(a => a.id !== id));
  };
  
  const safeAdmins = admins.map(({ password, ...rest }) => rest);

  const value = { 
    isAuthenticated, 
    currentUser,
    admins: safeAdmins, 
    login, 
    logout, 
    addAdmin, 
    removeAdmin,
    updatePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
