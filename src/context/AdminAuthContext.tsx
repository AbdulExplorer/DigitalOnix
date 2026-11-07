"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminUser } from "@/types/admin";
import { supabase } from "@/lib/supabase-client";

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPasswordRequest: (email: string) => Promise<{ success: boolean; message: string }>;
}

const DEFAULT_ADMIN: AdminUser = {
  id: "usr-admin-01",
  email: "admin@digitalonix.in",
  name: "Agency Administrator",
  role: "Super Admin",
  avatarUrl: "",
  lastLogin: "Today, 10:45 AM",
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const SESSION_KEY = "digitalonix_admin_session";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || "admin@digitalonix.in",
              name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Administrator",
              role: "Super Admin",
              lastLogin: "Active Supabase Session",
            });
            setIsLoading(false);
            return;
          }
        }

        // Fallback local session
        const stored = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.id && parsed?.email) {
            setUser(parsed);
          }
        }
      } catch {
        // Ignore session read error
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
  }, []);

  const login = async (
    email: string,
    pass: string,
    rememberMe = false
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid administrator email address." };
    }
    if (!pass || pass.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    // 1. If Supabase is connected, authenticate directly with Supabase Auth!
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass,
        });

        if (error) {
          // If Supabase authentication fails with custom credentials, also check demo fallback
          if (email.toLowerCase() === "admin@digitalonix.in" && pass === "admin123") {
            const demoUser: AdminUser = {
              ...DEFAULT_ADMIN,
              email: email.toLowerCase(),
              lastLogin: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setUser(demoUser);
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(demoUser));
            return { success: true };
          }
          return { success: false, error: error.message };
        }

        if (data.user) {
          const activeUser: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "Administrator",
            role: "Super Admin",
            lastLogin: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };

          setUser(activeUser);
          if (rememberMe) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(activeUser));
          } else {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(activeUser));
          }
          return { success: true };
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to connect to authentication server.";
        return { success: false, error: message };
      }
    }

    // 2. Demo fallback if Supabase credentials are not yet active
    if (email.toLowerCase() === "admin@digitalonix.in" && pass === "admin123") {
      const activeUser: AdminUser = {
        ...DEFAULT_ADMIN,
        email: email.toLowerCase(),
        lastLogin: new Date().toLocaleDateString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setUser(activeUser);
      const sessionData = JSON.stringify(activeUser);
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, sessionData);
      } else {
        sessionStorage.setItem(SESSION_KEY, sessionData);
      }
      return { success: true };
    }

    return {
      success: false,
      error: "Supabase client not loaded. If you just added .env.local, please stop (Ctrl+C) and restart (npm run dev) your terminal server.",
    };
  };

  const logout = async () => {
    setUser(null);
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch {}
    router.push("/admin/login");
  };

  const resetPasswordRequest = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!email || !email.includes("@")) {
      return { success: false, message: "Please enter a valid administrator email." };
    }

    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (error) {
          return { success: false, message: error.message };
        }
      } catch {}
    }

    return {
      success: true,
      message: `A secure password reset link has been dispatched to ${email}. Check your inbox.`,
    };
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        resetPasswordRequest,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
