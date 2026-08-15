"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Loader2, ArrowLeft, Mail } from "lucide-react";
import { api } from "@/lib/api";
import FloatingBubbles from "@/components/auth/FloatingBubbles";
import { useToast, ToastContainer } from "@/components/ui/Toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toasts, remove, success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await api.forgotPassword(email);
      toastSuccess("If an account exists with this email, you will receive a reset link shortly.");
    } catch (err: any) {
      toastError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex flex-col font-sans relative overflow-hidden">
      {/* Floating Animated Bubbles Background */}
      <ToastContainer toasts={toasts} onRemove={remove} />
      <FloatingBubbles />

      <nav className="w-full px-6 py-4 flex items-center justify-between mx-auto max-w-7xl relative z-10">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="CoreHead Logo"
            width={220}
            height={55}
            className="h-16 w-auto object-contain"
            priority
          />
        </Link>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 pb-20 relative z-10">
        <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password</h1>
            <p className="text-slate-600 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Toast handles error */}

          {success ? (
            <div className="text-center space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-6 rounded-xl space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-6 h-6" />
                </div>
                <p className="font-medium text-slate-900">Email Sent!</p>
                <p className="text-sm text-slate-600">{success}</p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wide ml-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
