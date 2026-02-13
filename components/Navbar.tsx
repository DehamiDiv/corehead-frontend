"use client";

import Link from "next/link";
import { motion } from "framer-motion";
// Assuming we might use a UI library or standard buttons later, but for now I'll stick to standard html/tailwind for speed unless I added shadcn. I didn't add shadcn, so I will implement buttons directly or generic ones.
// Actually, let's just make the buttons inline for now to avoid dependency on non-existent UI components.

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mx-auto max-w-7xl md:px-12 backdrop-blur-md bg-black/30 border-b border-white/10"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
        <span className="text-xl font-bold tracking-tight text-white">
          Corehead
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {["Features", "Testimonials", "Pricing", "About"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          Log in
        </Link>
        <button className="px-5 py-2 text-sm font-medium text-white transition-all bg-white/10 border border-white/10 rounded-full hover:bg-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm">
          Get Started
        </button>
      </div>
    </motion.nav>
  );
}
