"use client";

import Link from "next/link";
import { User, Globe, Palette, ArrowRight, Shield, Bell, Zap, Database } from "lucide-react";

export default function SettingsPage() {
  const settingsCards = [
    {
      title: "Profile Settings",
      description: "Manage your personal information, avatar, and account security details.",
      href: "/admin/settings/profile",
      icon: User,
      color: "blue",
      badge: "Account"
    },
    {
      title: "Website Settings",
      description: "Configure site metadata, favicons, SEO settings, and analytics scripts.",
      href: "/admin/settings/website",
      icon: Globe,
      color: "emerald",
      badge: "General"
    },
    {
      title: "Appearance",
      description: "Choose from premium themes, customize colors, and manage the visual identity.",
      href: "/admin/settings/appearance",
      icon: Palette,
      color: "purple",
      badge: "Visual"
    },
    {
      title: "Security & Access",
      description: "Manage user permissions, password policies, and API access tokens.",
      href: "#",
      icon: Shield,
      color: "rose",
      badge: "Advanced"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Settings Overview</h1>
        <p className="text-gray-500 font-medium mt-2 text-lg">
          Configure your global platform settings and fine-tune your blogging experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl bg-${card.color}-50 text-${card.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <card.icon className="w-7 h-7" />
            </div>

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{card.title}</h2>
              <span className={`px-3 py-1 bg-${card.color}-50 text-${card.color}-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-${card.color}-100`}>
                {card.badge}
              </span>
            </div>

            <p className="text-gray-500 font-medium leading-relaxed mb-8">
              {card.description}
            </p>

            <div className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Configure Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Decorative background shape */}
            <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-${card.color}-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl`} />
          </Link>
        ))}
      </div>

      {/* Quick Actions / Status */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">System Status</h3>
            <p className="text-slate-400 font-medium mb-8">All systems are operational. Your CMS is up to date.</p>
            
            <div className="flex gap-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold">API Online</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold">DB Connected</span>
              </div>
            </div>
          </div>
          
          <Zap className="absolute -right-8 -top-8 w-48 h-48 text-white/5 group-hover:text-white/10 transition-colors duration-700 rotate-12" />
        </div>

        <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-between group">
          <Database className="w-10 h-10 text-blue-200" />
          <div>
            <h3 className="text-xl font-bold mt-8">Database Health</h3>
            <p className="text-blue-100 text-sm mt-1 font-medium">98.4% Storage available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
