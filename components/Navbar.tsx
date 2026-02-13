"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mx-auto max-w-7xl md:px-12 backdrop-blur-md bg-white/70 border-b border-white/50 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-600" />
        <span className="text-lg font-bold tracking-tight text-slate-900">
          Corehead.app
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {["Features", "Testimonials", "Pricing", "About"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
        >
          Log in
        </Link>
        <button className="px-5 py-2 text-sm font-medium text-white transition-all bg-blue-600 border border-transparent rounded-full hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-md shadow-blue-500/20">
          Get a Demo
        </button>
      </div>
    </motion.nav>
  );
}
