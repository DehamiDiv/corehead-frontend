"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex flex-col font-sans">
      {/* Custom Navbar for Login Page */}
      <nav className="w-full px-6 py-4 flex items-center justify-between mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">
            <div className="w-4 h-4 rounded-full bg-blue-600 relative z-10" />
            <div className="absolute w-6 h-6 rounded-full border border-blue-600/30" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            CoreHead
          </span>
        </Link>

        {/* Centered Links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link
            href="#"
            className="text-sm font-medium text-slate-800 hover:text-blue-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-slate-800 hover:text-blue-700 transition-colors"
          >
            All Blogs
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-slate-800 hover:text-blue-700 transition-colors"
          >
            Settings
          </Link>
        </div>

        <button className="px-5 py-2 text-sm font-medium text-white transition-all bg-blue-700 rounded-md hover:bg-blue-800 shadow-sm">
          Get Started
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
            <p className="text-slate-600 text-sm">
              Enter your email below to login to your account
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wide ml-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wide ml-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-start">
              <Link
                href="#"
                className="text-xs font-medium text-slate-600 hover:text-blue-700 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] mt-2"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
