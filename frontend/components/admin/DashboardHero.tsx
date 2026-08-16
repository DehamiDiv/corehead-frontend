"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Layout, Rocket, ChevronRight } from "lucide-react";

export default function DashboardHero() {
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user", e);
      }
    }
  }, []);

  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'administrator';

  return (
    <section className="relative py-20 px-8 text-center overflow-hidden">
      {/* Decorative Gradient Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-400/10 via-transparent to-transparent rounded-full blur-[120px] -z-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full text-xs font-black uppercase tracking-[0.15em] mb-8 border border-slate-100 shadow-xl shadow-blue-900/5">
          <Sparkles className="w-3.5 h-3.5 fill-blue-600" />
          {isAdmin ? "Enterprise AI CMS Platform" : "CoreHead Content Creator"}
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.05]">
          Welcome back, <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            {user?.name?.split(' ')[0] || (isAdmin ? "Admin" : "Creator")}!
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          {isAdmin 
            ? "You have full control over the CoreHead digital empire. Manage users, layouts, and site-wide configurations from one place."
            : "Manage your personal content and designs. Use our AI-powered tools to bring your creative vision to life."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto mb-16">
          <Link href="/admin/builder" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4.5 rounded-[20px] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group">
            Launch Visual Builder
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/admin/posts" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 font-bold px-10 py-4.5 rounded-[20px] border border-slate-200 transition-all shadow-lg shadow-slate-900/5 flex items-center justify-center gap-3">
            Manage Content
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        </div>

        {/* Quick Stats/Features */}
        <div className="flex flex-wrap items-center justify-center gap-10 text-slate-400 font-black text-[11px] uppercase tracking-widest">
           <div className="flex items-center gap-2">
             <Layout className="w-4 h-4 text-blue-500" />
             Visual Drag-and-Drop
           </div>
           <div className="flex items-center gap-2">
             <Rocket className="w-4 h-4 text-emerald-500" />
             Instant AI Generation
           </div>
           <div className="flex items-center gap-2">
             <Zap className="w-4 h-4 text-amber-500" />
             Real-time Sync
           </div>
        </div>
      </motion.div>
    </section>
  );
}
