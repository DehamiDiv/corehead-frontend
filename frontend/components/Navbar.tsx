"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Blogs", href: "/blog" },
  { name: "Guide", href: "/guides" },
];

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="absolute top-6 left-0 right-0 z-50 px-6 pointer-events-none">
      <nav className="mx-auto max-w-7xl bg-white/70 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-between px-10 py-4 pointer-events-auto">
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

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative text-base font-semibold text-slate-600 hover:text-blue-600 transition-colors duration-300 group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-5">
          {user ? (
            <>
              <Link
                href={user.role === "admin" ? "/admin" : "/admin/builder"}
                className="text-lg font-semibold text-slate-600 hover:text-blue-600 transition-colors hover:scale-105 px-5"
              >
                {user.role === "admin" ? "Dashboard" : "Visual Builder"}
              </Link>
              <button
                onClick={handleLogout}
                className="px-7 py-3 text-base font-bold text-white bg-slate-900 transition-all rounded-full hover:bg-slate-800 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-base font-bold text-slate-600 hover:text-slate-900 transition-colors px-5"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-7 py-3 text-base font-bold text-white bg-blue-600 transition-all rounded-full hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-blue-600 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden mt-3 mx-auto max-w-7xl bg-white/90 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl p-6 pointer-events-auto"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-lg font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    href={user.role === "admin" ? "/admin" : "/admin/builder"}
                    onClick={() => setMobileOpen(false)}
                    className="text-center px-6 py-3 text-base font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    {user.role === "admin" ? "Dashboard" : "Visual Builder"}
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="px-6 py-3 text-base font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-center px-6 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="text-center px-6 py-3 text-base font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
