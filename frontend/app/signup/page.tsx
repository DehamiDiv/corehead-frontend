"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, LayoutGrid, BookOpen, Settings, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await api.register({
        email: formData.email,
        password: formData.password,
        // Backend register currenty only takes email and password based on authService.js
      });

      setSuccess("Account created successfully! Redirecting to login...");
      
      // Redirect to login after success (small delay to show message)
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex flex-col font-sans">
      {/* Navbar - same as login */}
      <nav className="w-full px-6 py-4 flex items-center justify-between mx-auto max-w-7xl relative z-10">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="CoreHead Logo" 
            width={160} 
            height={40} 
            className="h-14 w-auto object-contain" 
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-slate-700">Already have an account?</span>
          <Link 
            href="/login"
            className="px-5 py-2 text-sm font-bold text-blue-700 transition-all bg-white/50 backdrop-blur-md border border-white/50 rounded-full hover:bg-white/80 shadow-sm"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Create Account
            </h1>
            <p className="text-slate-600 text-sm">
              Sign up to start building with CoreHead
            </p>
          </div>

          {/* Success/Error Message */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 bg-emerald-100 border border-emerald-300 text-emerald-700 text-sm rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {success}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wide ml-1"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wide ml-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            {/* Password */}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Strong Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
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
              <p className="text-[10px] text-slate-500 mt-1 ml-1 leading-tight">
                Min. 8 characters: Include Uppercase, Lowercase, Number & Symbol (@$!%*?&).
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wide ml-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] mt-2"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Link to Login */}
            <p className="text-center text-sm text-slate-600 mt-2">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-700 hover:text-blue-800 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
