"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LayoutGrid, BookOpen, Settings } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      // Redirect to login after success
      router.push("/login?registered=true");
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex flex-col font-sans">
      {/* Navbar - same as login */}
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

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link
            href="#"
            className="flex items-center gap-2 text-sm font-medium text-slate-800 hover:text-blue-700 transition-colors"
          >
            <LayoutGrid className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-sm font-medium text-slate-800 hover:text-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            All Blogs
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-sm font-medium text-slate-800 hover:text-blue-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>

        <Link
          href="/login"
          className="px-5 py-2 text-sm font-medium text-white transition-all bg-blue-700 rounded-md hover:bg-blue-800 shadow-sm"
        >
          Sign In
        </Link>
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

          {/* Error Message */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg">
              {error}
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
                  placeholder="Min. 6 characters"
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
