"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function GuidesHero() {
  return (
    <section className="relative py-24 px-6 md:px-12 bg-[#2563EB] overflow-hidden">
      {/* Background Gradient blobfish */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-400/20 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-50 text-xs font-semibold uppercase tracking-wider mb-6">
            Documentation & Tutorials
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            CoreHead Guides
          </h1>

          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Learn how to build, structure, scale, and automate your content
            workflows with step-by-step tutorials and best practices.
          </p>

          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search the guides..."
              className="w-full py-4 pl-12 pr-4 rounded-full bg-white text-slate-900 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder:text-slate-400"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
