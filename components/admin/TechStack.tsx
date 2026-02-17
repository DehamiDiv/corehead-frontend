"use client";

import { motion } from "framer-motion";

export default function TechStack() {
  return (
    <section className="py-20 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="flex items-center justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl text-slate-800">PostgreSQL</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl text-slate-900">NEXT.js</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl text-slate-800">OpenAI</span>
        </div>
      </motion.div>
    </section>
  );
}
