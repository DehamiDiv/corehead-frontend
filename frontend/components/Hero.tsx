"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden lg:pt-32 lg:pb-32 bg-[#a3caff]">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[50%] left-1/2 -translate-x-1/2 w-[150%] aspect-square rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[90%] aspect-square rounded-full bg-white/20 blur-3xl"></div>
      </div>

      {/* YouTube Video Container - Moved to Top */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.2, type: "spring" }}
        className="relative z-20 w-full max-w-4xl px-6 mb-16"
        style={{ perspective: "1000px" }}
      >
        <div className="relative w-full aspect-[16/9] bg-black rounded-xl shadow-2xl shadow-blue-900/20 border border-slate-200 overflow-hidden group">
          {/* Mock UI Header */}
          <div className="absolute inset-x-0 top-0 h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2 z-10">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
            <div className="ml-4 text-[10px] text-slate-400 font-mono">corehead.io/demo</div>
          </div>
          {/* YouTube Iframe */}
          <div className="w-full h-full pt-10">
            <iframe
              src="https://www.youtube.com/embed/hx2W4fmqw_w?autoplay=1&mute=1&loop=1&playlist=hx2W4fmqw_w"
              title="CoreHead Demo Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-10 max-w-4xl px-6 mx-auto text-center"
      >
        <p className="max-w-2xl mx-auto text-xl font-medium text-slate-800 md:text-2xl leading-relaxed">
          CoreHead is a headless CMS built on Go, Next.js, and PostgreSQL,
          engineered for security, speed, and seamless deployment.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 mt-10 md:flex-row">
          <button className="px-10 py-4 text-lg font-bold text-white transition-all bg-blue-700 rounded-full hover:bg-blue-800 shadow-lg shadow-blue-600/30 hover:scale-105 active:scale-95">
            Get Started Now
          </button>
        </div>
      </motion.div>
    </section>
  );
}
