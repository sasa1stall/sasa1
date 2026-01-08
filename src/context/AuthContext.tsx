import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: any) => void;
  register: (userData: any) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    api.post('/auth/logout').catch(() => {}); // Server side logout (ignore errors)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    // Initialize auth state from localStorage
    const initAuth = () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          // Invalid stored user data, clear it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth:logout events from api interceptor
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const login = async (userData: any) => {
    localStorage.setItem('accessToken', userData.accessToken);
    const { accessToken, ...userToStore } = userData;
    localStorage.setItem('user', JSON.stringify(userToStore));
    setUser(userData);
  };

  const register = async (userData: any) => {
     localStorage.setItem('accessToken', userData.accessToken);
     const { accessToken, ...userToStore } = userData;
     localStorage.setItem('user', JSON.stringify(userToStore));
     setUser(userData);
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

