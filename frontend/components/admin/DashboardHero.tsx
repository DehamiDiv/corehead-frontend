"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Layout, Rocket, ChevronRight } from "lucide-react";

export default function DashboardHero() {
  return (
    <section className="relative py-24 px-8 text-center overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full text-xs font-black uppercase tracking-[0.15em] mb-8 border border-slate-100 shadow-xl shadow-blue-900/5">
          <Sparkles className="w-3.5 h-3.5 fill-blue-600" />
          The Next Generation CMS
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.05]">
          Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Core Content</span> <br/> 
          with Ease.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          A premium admin dashboard built for speed, performance, and unmatched user experience. 
          Monitor interactions, manage media, and publish blogs in seconds.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          <Link href="/admin/posts/create" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4.5 rounded-[20px] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group">
            Create New Blog
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
          <Link href="/admin/posts" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 font-bold px-10 py-4.5 rounded-[20px] border border-slate-200 transition-all shadow-lg shadow-slate-900/5 flex items-center justify-center gap-3">
            Manage Content
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        </div>

        {/* Quick Stats/Features */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-12 text-slate-400 font-bold text-[13px] uppercase tracking-wider">
           <div className="flex items-center gap-2.5">
             <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
             Active Dashboard
           </div>
           <div className="flex items-center gap-2.5">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
             Real-time API
           </div>
           <div className="flex items-center gap-2.5">
             <div className="w-2 h-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" />
             Cloud Media
           </div>
        </div>
      </motion.div>
    </section>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}
