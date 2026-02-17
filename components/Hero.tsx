"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden lg:pt-40 lg:pb-32 bg-[#a3caff]">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[50%] left-1/2 -translate-x-1/2 w-[150%] aspect-square rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[90%] aspect-square rounded-full bg-white/20 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 max-w-4xl px-6 mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-medium text-blue-900 bg-blue-400/30 border border-blue-300 rounded-md backdrop-blur-sm">
          v1.0 is now live
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-slate-900 md:text-7xl mb-6">
          The Fastest Foundation for
          <br />
          Your Content
        </h1>

        <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-700 md:text-xl leading-relaxed">
          CoreHead is a headless CMS built on Go, Next.js, and PostgreSQL,
          engineered for security, speed, and seamless deployment.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 mt-10 md:flex-row">
          <button className="px-8 py-3 text-base font-bold text-white transition-all bg-blue-700 rounded-full hover:bg-blue-800 shadow-lg shadow-blue-600/20">
            Get Started Now
          </button>
        </div>
      </motion.div>

      {/* Abstract Dashboard Preview Placeholder - Light Mode */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.6, type: "spring" }}
        className="relative w-full max-w-5xl px-6 mt-16"
        style={{ perspective: "1000px" }}
      >
        <div className="relative w-full aspect-[16/9] bg-white rounded-xl shadow-2xl shadow-blue-900/10 border border-slate-200 overflow-hidden group">
          {/* Mock UI Header */}
          <div className="absolute inset-x-0 top-0 h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2 z-10">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          {/* Mock UI Body */}
          <div className="p-8 pt-16 flex gap-6 h-full bg-slate-50/30">
            {/* Sidebar */}
            <div className="w-64 hidden md:block bg-white rounded-lg shadow-sm border border-slate-100 h-full p-4 space-y-3">
              <div className="h-8 bg-slate-100 rounded mb-6 w-3/4" />
              <div className="h-4 bg-slate-50 rounded w-full" />
              <div className="h-4 bg-slate-50 rounded w-full" />
              <div className="h-4 bg-slate-50 rounded w-5/6" />
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Stats Row */}
              <div className="h-32 bg-white rounded-lg shadow-sm border border-slate-100 p-6 flex gap-4">
                <div className="flex-1 bg-blue-50/50 rounded-md border border-blue-100/50" />
                <div className="flex-1 bg-purple-50/50 rounded-md border border-purple-100/50" />
                <div className="flex-1 bg-green-50/50 rounded-md border border-green-100/50" />
              </div>
              {/* Table/List */}
              <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-100 p-6 space-y-4">
                <div className="h-8 bg-slate-50 rounded w-1/4" />
                <div className="space-y-2">
                  <div className="h-12 bg-slate-50/50 rounded border border-slate-100" />
                  <div className="h-12 bg-slate-50/50 rounded border border-slate-100" />
                  <div className="h-12 bg-slate-50/50 rounded border border-slate-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
