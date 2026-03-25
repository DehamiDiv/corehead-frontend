"use client";

import { motion } from "framer-motion";

export default function DashboardHero() {
  return (
    <section className="relative py-16 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
          Design Intelligent Blogs in Minutes
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
          Create, customize, and publish dynamic blogs instantly using our
          drag-and-drop builder powered by AI.
        </p>

        {/* AI Input Field */}
        <div className="max-w-xl mx-auto relative group">
          <div className="relative flex items-center bg-white/40 backdrop-blur-md rounded-xl border border-white/50 p-1.5 pl-6 shadow-sm">
            <input
              type="text"
              placeholder="Describe the blog design you want"
              className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder-slate-500 text-sm"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow-md shadow-blue-600/20">
              Start with AI
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
