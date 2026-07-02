"use client";

import React, { useState, useEffect } from "react";
import { FileText, LayoutTemplate, Users, Eye, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    posts: 0,
    layouts: 0,
    users: 0,
    views: "12.4K"
  });
  const [user, setUser] = useState<{ role?: string } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }

        // Fetch actual data
        const [posts, templates] = await Promise.all([
          api.getPreviewPosts(100), // Using a high limit to count
          api.getTemplates()
        ]);

        setStats(prev => ({
          ...prev,
          posts: Array.isArray(posts) ? posts.length : 0,
          layouts: Array.isArray(templates) ? templates.length : (templates.layouts ? templates.layouts.length : 0),
        }));

        if (user?.role === 'admin') {
            const users = await api.getUsers();
            setStats(prev => ({ ...prev, users: Array.isArray(users) ? users.length : 0 }));
        }

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
  }, [user?.role]);

  const cards = [
    { label: "Content Items", value: stats.posts, icon: FileText, color: "blue" },
    { label: "Visual Templates", value: stats.layouts, icon: LayoutTemplate, color: "indigo" },
    { label: "AI Generations", value: "24", icon: Sparkles, color: "emerald" }, // Mocked for demo
  ];

  if (user?.role === 'admin') {
    cards.push({ label: "Team Members", value: stats.users, icon: Users, color: "amber" });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-8 relative z-20 pb-8 max-w-5xl mx-auto">
      {cards.map((card, idx) => (
        <div key={idx} className="group relative">
          <div className="relative bg-white/40 backdrop-blur-md p-5 rounded-[2rem] border border-white/50 shadow-sm flex flex-col gap-4 hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center text-${card.color}-600 shadow-sm`}>
                <card.icon size={20} />
              </div>
            </div>
            
            <div>
              <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.15em] mb-1">{card.label}</p>
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
