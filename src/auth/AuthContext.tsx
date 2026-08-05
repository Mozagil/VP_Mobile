import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '../api/client';
import { setTokens, clearTokens } from './storage';

export type UserProfile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  level: string | null;
  position: string | null;
  goals: string[];
  frequency: number | null;
  avatar_url: string | null;
  language: string;
};

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: RegisterData) => Promise<{ access_token: string; refresh_token: string }>;
  finalizeSignUp: (accessToken: string, refreshToken: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

export type RegisterData = {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  level?: string;
  position?: string;
  goals?: string[];
  frequency?: number;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchMe().finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    await setTokens(data.access_token, data.refresh_token);
    await fetchMe();
  };

  const signOut = async () => {
    await clearTokens();
    setUser(null);
  };

  const signUp = async (payload: RegisterData) => {
    const { data } = await apiClient.post('/auth/register', payload);
    return { access_token: data.access_token, refresh_token: data.refresh_token };
  };

  const finalizeSignUp = async (accessToken: string, refreshToken: string) => {
    await setTokens(accessToken, refreshToken);
    await fetchMe();
  };

  const refreshUser = fetchMe;

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp, finalizeSignUp, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
