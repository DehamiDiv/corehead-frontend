"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <div className="absolute top-6 left-0 right-0 z-50 px-6 pointer-events-none">
      <nav className="mx-auto max-w-7xl bg-white/70 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-between px-8 py-3 pointer-events-auto">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="CoreHead Logo"
            width={300}
            height={60}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {[
            { name: "Home", href: "/" },
            { name: "Features", href: "/#features" },
            { name: "Pricing", href: "/#pricing" },
            { name: "Blogs", href: "/blog" },
            { name: "Guide", href: "/guides" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-4"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2.5 text-sm font-bold text-white transition-all bg-[#0066FF] rounded-full hover:bg-blue-700 shadow-lg shadow-blue-200 hover:scale-105 active:scale-95"
          >
            Get a Demo
          </Link>
        </div>
      </nav>
    </div>
  );
}
