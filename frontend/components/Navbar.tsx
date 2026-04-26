"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mx-auto max-w-7xl bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200">
          C
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          CoreHead
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-10">
        {[
          { name: "Home", href: "/" },
          { name: "About", href: "/#about" },
          { name: "Blog", href: "/blog" },
          { name: "Contact", href: "/#contact" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-[15px] font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center">
        <Link
          href="/login"
          className="px-8 py-2.5 text-sm font-bold text-white transition-all bg-[#0066FF] rounded-full hover:bg-blue-700 shadow-md shadow-blue-200 hover:scale-105 active:scale-95"
        >
          Sign-In
        </Link>
      </div>
    </nav>
  );
}
