"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, Lightbulb, PartyPopper, ThumbsUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const REACTIONS = [
  { type: "like", label: "Like", Icon: ThumbsUp, color: "text-blue-600 bg-blue-50 border-blue-100" },
  { type: "love", label: "Love", Icon: Heart, color: "text-rose-600 bg-rose-50 border-rose-100" },
  {
    type: "insightful",
    label: "Insightful",
    Icon: Lightbulb,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    type: "celebrate",
    label: "Celebrate",
    Icon: PartyPopper,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
] as const;

type Counts = {
  like: number;
  love: number;
  insightful: number;
  celebrate: number;
  total: number;
};

function getVisitorKey() {
  if (typeof window === "undefined") return "";
  const key = "corehead_visitor_key";
  let v = localStorage.getItem(key);
  if (!v) {
    v =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, v);
  }
  return v;
}

export default function PostReactions({
  postId,
  siteId,
}: {
  postId: number;
  siteId?: number | null;
}) {
  const [counts, setCounts] = useState<Counts>({
    like: 0,
    love: 0,
    insightful: 0,
    celebrate: 0,
    total: 0,
  });
  const [mine, setMine] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const visitorKey = getVisitorKey();
      const qs = new URLSearchParams({ postId: String(postId) });
      if (visitorKey) qs.set("visitorKey", visitorKey);
      if (siteId != null) qs.set("siteId", String(siteId));
      const headers: Record<string, string> = {};
      if (siteId != null) headers["X-Site-Id"] = String(siteId);

      const res = await fetch(`${API_BASE}/reactions/public?${qs}`, {
        headers,
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.counts) setCounts(data.counts);
      setMine(data.mine || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [postId, siteId]);

  useEffect(() => {
    if (postId) load();
  }, [postId, load]);

  const react = async (type: string) => {
    if (busy) return;
    setBusy(true);
    try {
      const visitorKey = getVisitorKey();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (siteId != null) headers["X-Site-Id"] = String(siteId);

      // Toggle off if same reaction clicked again
      if (mine === type) {
        const res = await fetch(`${API_BASE}/reactions`, {
          method: "DELETE",
          headers,
          body: JSON.stringify({ postId, visitorKey }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.counts) setCounts(data.counts);
          setMine(null);
        }
      } else {
        const res = await fetch(`${API_BASE}/reactions`, {
          method: "POST",
          headers,
          body: JSON.stringify({ postId, type, visitorKey }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.counts) setCounts(data.counts);
          setMine(data.mine || type);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading reactions…
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <p className="text-sm font-bold text-slate-800">React to this post</p>
        <p className="text-xs font-semibold text-slate-400">
          {counts.total} reaction{counts.total === 1 ? "" : "s"}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map(({ type, label, Icon, color }) => {
          const selected = mine === type;
          const count = counts[type as keyof Counts] || 0;
          return (
            <button
              key={type}
              type="button"
              disabled={busy}
              onClick={() => react(type)}
              className={cn(
                "inline-flex items-center gap-2 h-10 px-3.5 rounded-xl border text-sm font-bold transition-all",
                selected
                  ? color + " ring-2 ring-offset-1 ring-current/20 scale-[1.02]"
                  : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200",
                busy && "opacity-60",
              )}
              title={label}
            >
              <Icon
                className={cn("w-4 h-4", selected && "fill-current")}
              />
              <span className="hidden sm:inline">{label}</span>
              <span className="text-xs font-black tabular-nums opacity-80">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
