"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="adm-toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`adm-toast ${toast.type}`}>
            {toast.type === "success" && <CheckCircle2 size={18} className="adm-toast-icon" style={{ color: "var(--adm-success)" }} />}
            {toast.type === "error" && <AlertCircle size={18} className="adm-toast-icon" style={{ color: "var(--adm-danger)" }} />}
            {toast.type === "info" && <Info size={18} className="adm-toast-icon" style={{ color: "var(--adm-info)" }} />}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: "transparent", border: "none", color: "var(--adm-text-muted)", cursor: "pointer" }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within an AdminToastProvider");
  }
  return context;
}

