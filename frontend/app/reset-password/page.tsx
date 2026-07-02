"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      await api.resetPassword({ token, password });
      setSuccess("Your password has been successfully reset.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-8 rounded-2xl flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12" />
          <h2 className="text-xl font-bold text-slate-900">Invalid Link</h2>
          <p className="text-sm text-slate-600">The password reset link is invalid or missing.</p>
          <Link href="/forgot-password" size="sm" className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg font-semibold">
             Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl p-8 md:p-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Set New Password</h1>
        <p className="text-slate-600 text-sm">
          Please enter your new password below.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm mb-5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-xl font-bold text-slate-900">Success!</p>
          <p className="text-slate-600">{success}</p>
          <p className="text-xs text-slate-500 pt-2">Redirecting to login page...</p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide ml-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide ml-1">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isLoading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 flex flex-col font-sans">
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
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 pb-20">
        <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-blue-700" />}>
          <ResetPasswordForm />
        </Suspense>
      </main>
    </div>
  );
}
