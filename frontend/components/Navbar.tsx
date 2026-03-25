"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 mx-auto max-w-7xl bg-white rounded-lg shadow-sm"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
          C
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          CoreHead
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {[
          { name: "Home", href: "/" },
          { name: "Features", href: "/#features" },
          { name: "Pricing", href: "/pricing" },
          { name: "Guide", href: "/guides" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
        >
          Log in
        </Link>
        <button className="px-5 py-2 text-sm font-medium text-white transition-all bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 hover:scale-105 active:scale-95">
          Get a Demo
        </button>
      </div>
    </motion.nav>
  );
}
