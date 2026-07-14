"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api, setAccessToken, setOnAuthFailure } from "./apiClient";

export type User = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore
    }
    setAccessToken(null);
    setUser(null);
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    setOnAuthFailure(logout);
    return () => setOnAuthFailure(() => {});
  }, [logout]);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await api.get<User>("/api/users/me");
      setUser(userData);
    } catch {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("no refresh");
        return res.json();
      })
      .then((json) => {
        setAccessToken(json.data.accessToken);
        return refreshUser();
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Login failed");
    }
    const data = json.data ?? json;
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const userData = await api.post<User>("/api/auth/register", { name, email, password });
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
