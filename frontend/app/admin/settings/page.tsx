"use client";

import Link from "next/link";
import { Settings as SettingsIcon, User, Globe, Palette, ArrowRight, Shield, Bell, Zap, Database, Sparkles, CreditCard, Link2 } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLaunching(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLaunching) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center justify-center mb-8 relative group">
            <div className="absolute inset-0 bg-emerald-600 rounded-[2.5rem] animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
            <SettingsIcon className="w-12 h-12 text-emerald-600 relative z-10" />
          </div>
          
          <h1 className="text-white text-3xl font-black tracking-tighter mb-2 italic">
            CORE<span className="text-emerald-500">HEAD</span>
          </h1>
          <div className="flex items-center gap-3">
             <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-emerald-500" />
             <p className="text-emerald-200/50 font-bold uppercase tracking-[0.3em] text-[10px]">Optimizing Platform Settings</p>
             <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-emerald-500" />
          </div>
        </div>

        <div className="absolute bottom-12 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
           <div className="h-full bg-emerald-500 rounded-full animate-progress-loading" style={{ width: '100%' }} />
        </div>

        <style jsx>{`
          @keyframes progress-loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
          .animate-progress-loading {
            animation: progress-loading 1.5s ease-in-out forwards;
          }
        `}</style>
      </div>
    );
  }
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
      title: "Custom Domain",
      description: "Attach a custom hostname (Premium+) so visitors open your site without /s/slug.",
      href: "/admin/settings/domain",
      icon: Link2,
      color: "blue",
      badge: "R6"
    },
    {
      title: "Plan & Billing",
      description: "View and change the site plan (demo billing — no card required).",
      href: "/admin/settings/billing",
      icon: CreditCard,
      color: "emerald",
      badge: "R6"
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
