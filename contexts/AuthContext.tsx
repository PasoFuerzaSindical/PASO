


import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { AdminUser } from '../lib/types';

interface AuthContextType {
  isAuthenticated: boolean;
  admins: AdminUser[];
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  addAdmin: (user: string, pass: string) => boolean;
  removeAdmin: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default credentials for the very first run
const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASS = 'paso2026!';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('paso-auth', false);
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
  }, []); // Run only once

  const login = (user: string, pass: string): boolean => {
    const admin = admins.find(a => a.username === user);
    if (admin && admin.password === pass) {
      setIsAuthenticated(true);
      navigate('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    navigate('/');
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
    // Prevent deleting the last admin
    if (admins.length <= 1) {
        alert("No se puede eliminar al último administrador.");
        return;
    }
    setAdmins(prev => prev.filter(a => a.id !== id));
  };
  
  // Expose admins without password for security
  const safeAdmins = admins.map(({ password, ...rest }) => rest);

  const value = { isAuthenticated, admins: safeAdmins, login, logout, addAdmin, removeAdmin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
