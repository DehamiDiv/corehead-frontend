import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Action = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

/**
 * T16 — Shared empty / zero-data UI for admin + public surfaces.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actions = [],
  className,
  compact = false,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  actions?: Action[];
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-3xl border border-dashed border-slate-200 bg-white",
        compact ? "px-6 py-12" : "px-8 py-16 sm:py-20",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-500 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {actions.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actions.map((action) => {
            const styles =
              action.variant === "secondary"
                ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200/60";

            if (action.href) {
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={cn(
                    "inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold transition-colors",
                    styles
                  )}
                >
                  {action.label}
                </Link>
              );
            }

            return (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={cn(
                  "inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold transition-colors",
                  styles
                )}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
