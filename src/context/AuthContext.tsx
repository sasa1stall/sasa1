import React, { createContext, useState, useEffect, useContext } from 'react';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setLoading(false);
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

  const logout = () => {
    api.post('/auth/logout'); // Server side logout
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
