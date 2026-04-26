"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Layout, Rocket, BarChart3 } from "lucide-react";

export default function DashboardHero() {
  return (
    <section className="relative py-20 px-8 text-center overflow-hidden">
      {/* Decorative Gradient Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-400/10 via-transparent to-transparent rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/50 backdrop-blur-md text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white shadow-sm">
          <Sparkles className="w-3 h-3" />
          Enterprise AI CMS Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95]">
          Manage Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Digital Empire</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-bold tracking-tight">
          Welcome back to CoreHead. Your all-in-one suite for AI-driven layout generation, 
          professional content management, and visual storytelling.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/admin/builder" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center gap-2 group">
            Launch Visual Builder
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/admin/blogs" className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold px-8 py-4 rounded-2xl transition-all shadow-sm flex items-center gap-2 group">
            Manage Content
            <BarChart3 className="w-4 h-4 text-slate-400" />
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
