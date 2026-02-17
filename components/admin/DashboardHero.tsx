"use client";

import { motion } from "framer-motion";

export default function DashboardHero() {
  return (
    <section className="relative pt-32 pb-20 px-6 text-center">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 top-0 h-[500px] overflow-hidden -z-10 bg-gradient-to-b from-blue-100/50 to-white/0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-300/20 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
          Design Intelligent Blogs in Minutes
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Create, customize, and publish dynamic blogs instantly using our
          drag-and-drop builder powered by AI.
        </p>

        {/* AI Input Field */}
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-slate-100 p-2 pl-6">
            <input
              type="text"
              placeholder="Describe the blog design you want"
              className="flex-1 bg-transparent border-none outline-none text-slate-700 placeholder-slate-400"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-md shadow-blue-600/20">
              Start with AI
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
