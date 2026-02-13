"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-16 overflow-hidden text-center md:pt-40">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-medium text-blue-300 border rounded-full bg-blue-500/10 border-blue-500/20">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping"></span>
            <span className="relative inline-flex w-2 h-2 bg-blue-500 rounded-full"></span>
          </span>
          v1.0 is now live
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-transparent md:text-7xl bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50">
          Build the future with <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Corehead
          </span>
        </h1>

        <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-400 md:text-xl">
          The all-in-one platform for modern developers. manage projects, track
          issues, and deploy faster than ever before with our intuitive
          interface.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 mt-10 md:flex-row">
          <button className="group relative px-8 py-3.5 text-sm font-semibold text-white bg-white/10 backdrop-blur-xl border border-white/10 rounded-full overflow-hidden transition-all hover:bg-white/20 hover:scale-105 active:scale-95">
            <div className="absolute inset-0 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 bg-gradient-to-r from-purple-600 to-blue-600 opacity-20" />
            <span className="relative flex items-center gap-2">
              Start Building Now{" "}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          <button className="px-8 py-3.5 text-sm font-semibold text-gray-300 transition-all hover:text-white hover:bg-white/5 rounded-full">
            View Documentation
          </button>
        </div>
      </motion.div>

      {/* Abstract Dashboard Preview Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.6, type: "spring" }}
        className="relative w-full max-w-5xl mt-16 p-2 rounded-xl bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm border border-white/10"
        style={{ perspective: "1000px" }}
      >
        <div className="w-full aspect-[16/9] bg-black/80 rounded-lg overflow-hidden relative group">
          {/* Mock UI content */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-blue-900/20" />
          <div className="grid grid-cols-4 gap-4 p-8 h-full">
            <div className="col-span-1 bg-white/5 rounded-lg h-full border border-white/5" />
            <div className="col-span-3 flex flex-col gap-4">
              <div className="h-32 bg-white/5 rounded-lg border border-white/5" />
              <div className="flex-1 bg-white/5 rounded-lg border border-white/5" />
            </div>
          </div>
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
}
