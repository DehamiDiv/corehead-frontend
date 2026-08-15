export type ToastTone = "success" | "error" | "warning" | "info";

export type ToastMessage = {
  id: number;
  message: string;
  tone: ToastTone;
  duration: number;
};

type ToastListener = (message: ToastMessage) => void;

const listeners = new Set<ToastListener>();
let nextToastId = 1;

function show(message: string, tone: ToastTone, duration = 4200) {
  const value = String(message || "").trim();
  if (!value) return;

  const toastMessage: ToastMessage = {
    id: nextToastId++,
    message: value,
    tone,
    duration,
  };
  listeners.forEach((listener) => listener(toastMessage));
}

export const toast = {
  success: (message: string, duration?: number) => show(message, "success", duration),
  error: (message: string, duration?: number) => show(message, "error", duration ?? 6000),
  warning: (message: string, duration?: number) => show(message, "warning", duration),
  info: (message: string, duration?: number) => show(message, "info", duration),
};

export function subscribeToToasts(listener: ToastListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
