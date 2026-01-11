import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { AuthContext, type User, type UserData } from "./auth.context";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    api.post("/auth/logout").catch(() => {}); // Server side logout (ignore errors)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  useEffect(() => {
    // Initialize auth state from localStorage
    const initAuth = () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // Invalid stored user data, clear it
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth:logout events from api interceptor
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const login = (userData: UserData) => {
    localStorage.setItem("accessToken", userData.accessToken);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { accessToken, ...userToStore } = userData;
    localStorage.setItem("user", JSON.stringify(userToStore));
    setUser(userToStore);
  };

  const register = (userData: UserData) => {
    localStorage.setItem("accessToken", userData.accessToken);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { accessToken, ...userToStore } = userData;
    localStorage.setItem("user", JSON.stringify(userToStore));
    setUser(userToStore);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setUser, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
