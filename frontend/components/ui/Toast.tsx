"use client";

import React, { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: {
    container: "bg-emerald-600 border-emerald-500 shadow-emerald-500/30",
    icon: "text-emerald-100",
    title: "text-white",
    message: "text-emerald-100",
    bar: "bg-emerald-400",
    close: "hover:bg-emerald-500 text-emerald-200 hover:text-white",
  },
  error: {
    container: "bg-red-600 border-red-500 shadow-red-500/30",
    icon: "text-red-100",
    title: "text-white",
    message: "text-red-100",
    bar: "bg-red-400",
    close: "hover:bg-red-500 text-red-200 hover:text-white",
  },
  warning: {
    container: "bg-amber-500 border-amber-400 shadow-amber-500/30",
    icon: "text-amber-100",
    title: "text-white",
    message: "text-amber-100",
    bar: "bg-amber-300",
    close: "hover:bg-amber-400 text-amber-200 hover:text-white",
  },
  info: {
    container: "bg-blue-600 border-blue-500 shadow-blue-500/30",
    icon: "text-blue-100",
    title: "text-white",
    message: "text-blue-100",
    bar: "bg-blue-400",
    close: "hover:bg-blue-500 text-blue-200 hover:text-white",
  },
};

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = toast.duration ?? 5000;
  const s = STYLES[toast.type];
  const Icon = ICONS[toast.type];

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 400);
  }, [toast.id, onRemove]);

  useEffect(() => {
    // Mount animation
    const mountTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const dismissTimer = setTimeout(() => dismiss(), duration);
    // Progress bar
    const interval = setInterval(() => {
      setProgress((p) => Math.max(0, p - (100 / (duration / 100))));
    }, 100);
    return () => {
      clearTimeout(mountTimer);
      clearTimeout(dismissTimer);
      clearInterval(interval);
    };
  }, [duration, dismiss]);

  return (
    <div
      className={`
        relative flex items-start gap-3 min-w-[300px] max-w-[420px] w-full
        px-4 py-3.5 rounded-2xl border shadow-2xl overflow-hidden
        transition-all duration-400 ease-out
        ${s.container}
        ${visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-95"
        }
      `}
      style={{ transition: "opacity 0.4s ease, transform 0.4s ease" }}
    >
      {/* Icon */}
      <div className={`shrink-0 mt-0.5 ${s.icon}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`font-semibold text-sm leading-tight mb-0.5 ${s.title}`}>
            {toast.title}
          </p>
        )}
        <p className={`text-sm leading-relaxed ${s.message}`}>
          {toast.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={dismiss}
        className={`shrink-0 p-1 rounded-lg transition-colors ${s.close}`}
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/10">
        <div
          className={`h-full ${s.bar} transition-all ease-linear`}
          style={{ width: `${progress}%`, transitionDuration: "100ms" }}
        />
      </div>
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────────
interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full">
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

// ─── useToast hook ────────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback(
    (type: ToastType, message: string, title?: string, duration?: number): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, type, message, title, duration }]);
      return id;
    },
    []
  );

  const success = useCallback(
    (message: string, title?: string, duration?: number) =>
      add("success", message, title ?? "Success", duration),
    [add]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) =>
      add("error", message, title ?? "Error", duration ?? 7000),
    [add]
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) =>
      add("warning", message, title ?? "Warning", duration),
    [add]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) =>
      add("info", message, title ?? "Info", duration),
    [add]
  );

  return { toasts, remove, success, error, warning, info };
}
