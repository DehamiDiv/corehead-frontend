"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Layout, Rocket } from "lucide-react";

export default function DashboardHero() {
  return (
    <section className="relative py-24 px-8 text-center overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Advanced AI
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
          Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Blog</span> <br/> 
          in Record Time
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          The world's most intuitive drag-and-drop builder with real-time AI assistance. 
          Create premium experiences without touching code.
        </p>

        {/* AI Input Field */}
        <div className="max-w-2xl mx-auto relative group">
          <div className="relative flex items-center bg-white rounded-3xl border border-gray-100 p-2 shadow-2xl shadow-blue-900/5 hover:border-blue-200 transition-all duration-300">
            <div className="flex-1 flex items-center pl-6">
              <Zap className="w-5 h-5 text-amber-500 mr-3" />
              <input
                type="text"
                placeholder="Ex: A minimalist travel blog with a dark theme..."
                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-[15px] font-semibold"
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center gap-2 group">
              Start with AI
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Quick Stats/Features */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-400 font-bold text-sm">
           <div className="flex items-center gap-2">
             <Layout className="w-4 h-4 text-blue-500" />
             50+ Templates
           </div>
           <div className="flex items-center gap-2">
             <Rocket className="w-4 h-4 text-emerald-500" />
             Fast Deployment
           </div>
           <div className="flex items-center gap-2">
             <Zap className="w-4 h-4 text-amber-500" />
             AI Assisted
           </div>
        </div>
      </motion.div>
    </section>
  );
}
