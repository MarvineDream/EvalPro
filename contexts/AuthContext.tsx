'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContext as AuthContextType } from '@/lib/types';
import {
  authenticateUser,
  getCurrentUser,
  saveAuthData,
  clearAuthData,
} from '@/lib/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    const token = localStorage.getItem('authToken');

    if (currentUser && token) {
      // ✅ On attache le token à l'objet user
      setUser({ ...currentUser, token });
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ token: string; user: User } | null> => {
    setLoading(true);
    try {
      const result = await authenticateUser(email, password);
      if (result && result.user && result.token) {
        // ✅ On attache le token à l'objet user
        const userWithToken = { ...result.user, token: result.token };
        saveAuthData(result.user, result.token);
        setUser(userWithToken);
        return { token: result.token, user: userWithToken };
      }
      return null;
    } catch (error) {
      console.error('Erreur de login :', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
