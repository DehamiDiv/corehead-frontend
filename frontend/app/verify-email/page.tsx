"use client";

import React, { useState, Suspense, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  AlertCircle,
  Loader2,
  ShieldCheck,
  Mail,
  Copy,
  Check,
  Info,
} from "lucide-react";
import { api } from "@/lib/api";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const callbackParam = searchParams.get("callback") || "";
  const emailKey = emailParam.trim().toLowerCase();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Restore dev OTP / email error from signup redirect
  useEffect(() => {
    if (!emailKey) return;
    try {
      const stored = sessionStorage.getItem(`corehead_dev_otp:${emailKey}`);
      if (stored && /^\d{6}$/.test(stored)) {
        setDevOtp(stored);
        setOtp(stored.split(""));
        setInfo(
          "SMTP is not configured on the backend, so no real email was sent. Use the verification code below (also printed in the backend console as [AUTH] Verification OTP).",
        );
      }
      const emailErr = sessionStorage.getItem(
        `corehead_email_error:${emailKey}`,
      );
      if (emailErr && !stored) {
        setInfo(emailErr);
      }
    } catch {
      /* ignore */
    }
  }, [emailKey]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const fillOtp = useCallback((code: string) => {
    const digits = code.replace(/\D/g, "").slice(0, 6).split("");
    while (digits.length < 6) digits.push("");
    setOtp(digits);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Support paste of full 6-digit code into one box
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 1) {
      fillOtp(cleaned);
      return;
    }
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    if (cleaned && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text");
    if (/\d{6}/.test(text.replace(/\D/g, ""))) {
      e.preventDefault();
      fillOtp(text);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    if (!emailParam) {
      setError("Missing email. Please sign up again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.verifyEmail({ email: emailParam, otp: otpString });
      try {
        sessionStorage.removeItem(`corehead_dev_otp:${emailKey}`);
        sessionStorage.removeItem(`corehead_email_error:${emailKey}`);
      } catch {
        /* ignore */
      }
      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        const qs = new URLSearchParams({ registered: "true" });
        if (callbackParam.startsWith("/")) {
          qs.set("callback", callbackParam);
        }
        router.push(`/login?${qs.toString()}`);
      }, 2000);
    } catch (err: any) {
      setError(
        err.message ||
          "Verification failed. Please check the code and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailParam || resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.resendOtp(emailParam);
      const realMail =
        res.emailSent === true && res.emailRealDelivery !== false;

      if (res.devOtp) {
        setDevOtp(res.devOtp);
        fillOtp(res.devOtp);
        try {
          sessionStorage.setItem(
            `corehead_dev_otp:${emailKey}`,
            String(res.devOtp),
          );
        } catch {
          /* ignore */
        }
        setInfo(
          "SMTP is not configured — a new code was generated and is shown below (and in the backend console). Configure EMAIL_HOST / EMAIL_USER / EMAIL_PASS in CoreHead-Backend/.env for real Gmail delivery.",
        );
        setSuccess("New verification code ready (dev mode).");
      } else if (realMail) {
        setDevOtp(null);
        setInfo(null);
        setSuccess("A new verification code was sent to your email.");
      } else {
        setInfo(
          res.emailError ||
            res.message ||
            "Email was not delivered. Check backend console for [AUTH] Verification OTP, or configure SMTP.",
        );
        setSuccess(res.message || "OTP regenerated.");
      }
      setResendCooldown(30);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  const handleCopyDevOtp = async () => {
    if (!devOtp) return;
    try {
      await navigator.clipboard.writeText(devOtp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

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
        <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
              <Mail className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-slate-600 text-sm">
              Enter the 6-digit verification code for
              <br />
              <span className="font-bold text-slate-900">
                {emailParam || "your account"}
              </span>
            </p>
          </div>

          {info && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg flex items-start gap-3 text-sm mb-5">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div className="space-y-1">
                <p className="font-semibold">Email not delivered to inbox</p>
                <p className="text-amber-800/90 text-xs leading-relaxed">
                  {info}
                </p>
              </div>
            </div>
          )}

          {devOtp && (
            <div className="bg-slate-900 text-white rounded-xl px-4 py-4 mb-5 shadow-lg">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                Dev OTP (SMTP not configured)
              </p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-3xl font-black tracking-[0.35em] font-mono">
                  {devOtp}
                </p>
                <button
                  type="button"
                  onClick={handleCopyDevOtp}
                  className="shrink-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                For real Gmail delivery: set{" "}
                <code className="text-slate-300">EMAIL_HOST</code>,{" "}
                <code className="text-slate-300">EMAIL_USER</code>,{" "}
                <code className="text-slate-300">EMAIL_PASS</code> in{" "}
                <code className="text-slate-300">CoreHead-Backend/.env</code>{" "}
                (Gmail App Password) and restart the backend.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg flex items-center gap-3 text-sm mb-5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete={idx === 0 ? "one-time-code" : "off"}
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 bg-white border border-slate-200 rounded-xl text-center text-2xl font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </button>

            <p className="text-center text-xs text-slate-500">
              Didn&apos;t receive the code? Check your spam folder or{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0 || !emailParam}
                className="text-blue-600 font-bold hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {isResending
                  ? "Sending..."
                  : resendCooldown > 0
                    ? `Resend OTP (${resendCooldown}s)`
                    : "Resend OTP"}
              </button>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-blue-200">
          <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
