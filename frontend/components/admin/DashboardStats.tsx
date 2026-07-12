"use client";

import React, { useState, useEffect } from "react";
import { FileText, LayoutTemplate, Users, Sparkles, Globe2 } from "lucide-react";
import { api } from "@/lib/api";

type StatCard = {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
};

export default function DashboardStats() {
  const [stats, setStats] = useState({
    posts: 0,
    layouts: 0,
    users: 0,
    sites: 0,
    ai: 0,
  });
  const [user, setUser] = useState<{ role?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("user");
        let role: string | undefined;
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (!cancelled) setUser(parsedUser);
            role = parsedUser?.role;
          } catch {
            /* ignore */
          }
        }

        const isAdmin =
          String(role || "").toLowerCase() === "admin" ||
          String(role || "").toLowerCase() === "administrator";

        const [postsData, templatesData, aiData, sitesData] =
          await Promise.all([
            api.getPreviewPosts(100).catch(() => null),
            api.getTemplates().catch(() => null),
            api.getAiHistory(100).catch(() => null),
            isAdmin ? api.getMySites().catch(() => null) : Promise.resolve(null),
          ]);

        const postsCount = Array.isArray(postsData)
          ? postsData.length
          : Array.isArray((postsData as any)?.posts)
            ? (postsData as any).posts.length
            : 0;

        const layoutsCount = Array.isArray(templatesData)
          ? templatesData.length
          : Array.isArray((templatesData as any)?.layouts)
            ? (templatesData as any).layouts.length
            : Array.isArray((templatesData as any)?.templates)
              ? (templatesData as any).templates.length
              : 0;

        const aiCount = Array.isArray(aiData)
          ? aiData.length
          : Array.isArray((aiData as any)?.history)
            ? (aiData as any).history.length
            : Array.isArray((aiData as any)?.items)
              ? (aiData as any).items.length
              : 0;

        const sitesList = Array.isArray(sitesData)
          ? sitesData
          : Array.isArray((sitesData as any)?.sites)
            ? (sitesData as any).sites
            : [];

        let usersCount = 0;
        if (isAdmin) {
          try {
            const users = await api.getUsers();
            usersCount = Array.isArray(users)
              ? users.length
              : Array.isArray((users as any)?.users)
                ? (users as any).users.length
                : 0;
          } catch {
            usersCount = 0;
          }
        }

        if (!cancelled) {
          setStats({
            posts: postsCount,
            layouts: layoutsCount,
            users: usersCount,
            sites: sitesList.length,
            ai: aiCount,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const isAdmin =
    String(user?.role || "").toLowerCase() === "admin" ||
    String(user?.role || "").toLowerCase() === "administrator";

  const cards: StatCard[] = [
    {
      label: "Content Items",
      value: loading ? "…" : stats.posts,
      icon: FileText,
      color: "blue",
    },
    {
      label: "Visual Templates",
      value: loading ? "…" : stats.layouts,
      icon: LayoutTemplate,
      color: "indigo",
    },
    {
      label: "AI Generations",
      value: loading ? "…" : stats.ai,
      icon: Sparkles,
      color: "emerald",
    },
  ];

  if (isAdmin) {
    cards.push({
      label: "Sites",
      value: loading ? "…" : stats.sites,
      icon: Globe2,
      color: "sky",
    });
    cards.push({
      label: "Team Members",
      value: loading ? "…" : stats.users,
      icon: Users,
      color: "amber",
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-8 relative z-20 pb-8 max-w-5xl mx-auto">
      {cards.map((card, idx) => (
        <div key={idx} className="group relative">
          <div className="relative bg-white/40 backdrop-blur-md p-5 rounded-[2rem] border border-white/50 shadow-sm flex flex-col gap-4 hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div
                className={`w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center text-${card.color}-600 shadow-sm`}
              >
                <card.icon size={20} />
              </div>
            </div>

            <div>
              <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.15em] mb-1">
                {card.label}
              </p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter">
                {card.value}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
