"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { subscribeToToasts, type ToastMessage, type ToastTone } from "@/lib/toast";
import { cn } from "@/lib/utils";

const toneStyles: Record<ToastTone, { card: string; icon: string }> = {
  success: {
    card: "border-emerald-200 bg-emerald-50 text-emerald-950",
    icon: "text-emerald-600",
  },
  error: {
    card: "border-red-200 bg-red-50 text-red-950",
    icon: "text-red-600",
  },
  warning: {
    card: "border-amber-200 bg-amber-50 text-amber-950",
    icon: "text-amber-600",
  },
  info: {
    card: "border-blue-200 bg-blue-50 text-blue-950",
    icon: "text-blue-600",
  },
};

function ToastIcon({ tone }: { tone: ToastTone }) {
  const className = cn("mt-0.5 h-5 w-5 shrink-0", toneStyles[tone].icon);
  if (tone === "success") return <CheckCircle2 className={className} />;
  if (tone === "error") return <AlertCircle className={className} />;
  if (tone === "warning") return <TriangleAlert className={className} />;
  return <Info className={className} />;
}

export default function ToastProvider() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = (id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setMessages((current) => current.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const activeTimers = timers.current;
    const unsubscribe = subscribeToToasts((message) => {
      setMessages((current) => [...current.slice(-3), message]);
      const timer = setTimeout(() => dismiss(message.id), message.duration);
      activeTimers.set(message.id, timer);
    });

    return () => {
      unsubscribe();
      activeTimers.forEach((timer) => clearTimeout(timer));
      activeTimers.clear();
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-3 sm:right-6 sm:top-6"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          role={message.tone === "error" ? "alert" : "status"}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl shadow-slate-950/10",
            toneStyles[message.tone].card,
          )}
        >
          <ToastIcon tone={message.tone} />
          <p className="min-w-0 flex-1 whitespace-pre-line text-sm font-semibold leading-5">
            {message.message}
          </p>
          <button
            type="button"
            onClick={() => dismiss(message.id)}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg opacity-60 transition hover:bg-black/5 hover:opacity-100"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
