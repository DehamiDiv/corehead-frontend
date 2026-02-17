"use client";

import { motion } from "framer-motion";

export default function TechStack() {
  return (
    <section className="py-20 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="flex items-center justify-center gap-12 opacity-80"
      >
        <div className="flex items-center gap-2">
          {/* PostgreSQL */}
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
            alt="PostgreSQL"
            className="h-12 w-12"
          />
          <span className="font-bold text-2xl text-slate-700">PostgreSQL</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Next.js */}
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
            alt="Next.js"
            className="h-12 w-12"
          />
          <span className="font-bold text-2xl text-slate-800">NEXT.js</span>
        </div>
        <div className="flex items-center gap-2">
          {/* OpenAI - using a generic similar icon or text as simple icon might not be in devicon/ is tricky. 
              Screenshot shows specific OpenAI logo text. 
              I'll use text with the logo icon if available or just styling.
              Found a CDN for OpenAI logo.
          */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg"
            alt="OpenAI"
            className="h-10 w-10"
          />
          <span className="font-bold text-2xl text-slate-800">OpenAI</span>
        </div>
      </motion.div>
    </section>
  );
}
