"use client";

import { useState } from "react";
import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface NewsletterSubscribeFormProps {
  siteName: string;
  siteSlug?: string;
  siteId?: number | string;
  className?: string;
}

export default function NewsletterSubscribeForm({
  siteName,
  siteSlug,
  siteId,
  className = "",
}: NewsletterSubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          siteName,
          siteSlug,
          siteId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage(
          data.message ||
            `Subscribed! You'll receive email alerts when new posts are published on ${siteName}.`
        );
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-4 h-4 text-[var(--site-primary,#2563eb)]" />
        <h4 className="text-sm font-bold tracking-tight text-[var(--site-ink,#0f172a)]">
          Subscribe to {siteName} Alerts
        </h4>
      </div>
      <p className="text-xs text-[var(--site-muted,#64748b)] mb-3 leading-relaxed">
        Get new stories, articles, and updates delivered straight to your inbox.
      </p>

      {status === "success" ? (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Subscription Confirmed!</p>
            <p className="mt-0.5 opacity-90">{message}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                disabled={loading}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[color-mix(in_srgb,var(--site-ink,#0f172a)_15%,transparent)] bg-[color-mix(in_srgb,var(--site-bg,#ffffff)_80%,transparent)] text-xs text-[var(--site-ink,#0f172a)] placeholder:text-[var(--site-muted,#94a3b8)] focus:outline-none focus:ring-2 focus:ring-[var(--site-primary,#2563eb)] transition-all disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="px-4 py-2.5 rounded-xl bg-[var(--site-primary,#2563eb)] text-white text-xs font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </div>

          {status === "error" && (
            <div className="text-[11px] text-red-500 font-medium flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{message}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
