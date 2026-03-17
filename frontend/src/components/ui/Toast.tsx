"use client";
import * as React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

type ToastItem = Toast;

interface ToastContextValue {
  add: (t: Omit<ToastItem, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue>({ add: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const add = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { ...t, id }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <ToastContainer
        toasts={toasts}
        onRemove={(id) => setToasts((p) => p.filter((x) => x.id !== id))}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: "var(--color-green)",
  error: "var(--color-red)",
  warning: "var(--color-amber)",
  info: "var(--color-blue)",
};

const bgs = {
  success: "rgba(16,185,129,0.08)",
  error: "rgba(239,68,68,0.08)",
  warning: "rgba(245,158,11,0.08)",
  info: "rgba(59,130,246,0.08)",
};

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}) {
  if (!toasts.length) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        gap: "0.625rem",
        width: "320px",
      }}
    >
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            style={{
              background: "var(--color-bg-card)",
              border: `1px solid ${bgs[t.type]}`,
              borderLeft: `3px solid ${colors[t.type]}`,
              borderRadius: "10px",
              padding: "0.875rem 1rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              animation: "slideUp 200ms ease",
            }}
          >
            <Icon
              size={16}
              style={{ color: colors[t.type], flexShrink: 0, marginTop: "1px" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-text-1)",
                }}
              >
                {t.title}
              </div>
              {t.message && (
                <div
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-text-2)",
                    marginTop: "2px",
                  }}
                >
                  {t.message}
                </div>
              )}
            </div>
            <button
              onClick={() => onRemove(t.id)}
              style={{
                color: "var(--color-text-3)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
