"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, LayoutGrid, BookOpen, Settings, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { resolvePostAuthDestination } from "@/lib/postAuthRedirect";
import { persistSession } from "@/lib/authSession";

import { useToast, ToastContainer } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callback');
  const { toasts, remove, success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const registered = searchParams.get('registered');
    const session = searchParams.get('session');

    if (registered === "true") {
      toastSuccess("Account created! Please verify your email and log in.", "Welcome!");
    }
    if (session === "expired") {
      toastInfo("Your session has expired. Please sign in again.", "Session Expired");
    }
  }, []);

  useEffect(() => {
    const id = "google-gsi-client";
    const existingScript = document.getElementById(id);

    const initializeGoogleSignIn = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.warn("Google Client ID not configured.");
        return;
      }
      try {
        const gg = (window as any).google;
        gg.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLoginCallback,
        });
        gg.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          {
            type: "standard",
            theme: "outline",
            size: "large",
            width: 382,
            text: "signin_with",
          }
        );
      } catch (e) {
        console.error("Google Sign-In init error:", e);
      }
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = id;
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    } else if ((window as any).google?.accounts) {
      initializeGoogleSignIn();
    }
  }, []);

  const handleGoogleLoginCallback = async (response: any) => {
    try {
      const data = await api.googleLogin({ credential: response.credential });
      persistSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
      toastSuccess("Signed in with Google!", "Welcome back");
      const destination = await resolvePostAuthDestination(data.user, callbackUrl);
      if (destination.startsWith("/onboarding")) {
        setTimeout(() => router.push(destination), 1200);
      } else {
        setTimeout(() => router.push(destination), 900);
      }
    } catch (err: any) {
      toastError(err.message || "Google Sign-In failed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await api.login({ email, password });

      persistSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      const destination = await resolvePostAuthDestination(data.user, callbackUrl);
      const goingToOnboarding = destination.startsWith("/onboarding");

      toastSuccess(
        goingToOnboarding
          ? "Login successful! Let's create your site."
          : "Login successful! Redirecting...",
        "Welcome back"
      );

      setTimeout(() => {
        router.push(destination);
      }, 900);
    } catch (err: any) {
      const message = err?.response?.data?.error || err.message || "Login failed. Please check your credentials and try again.";
      toastError(message, "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex flex-col font-sans relative overflow-hidden">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={remove} />



      {/* Custom Navbar for Login Page */}
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

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-slate-700">Don't have an account?</span>
          <Link
            href="/signup"
            className="px-5 py-2 text-sm font-bold text-blue-700 transition-all bg-white/50 backdrop-blur-md border border-white/50 rounded-full hover:bg-white/80 shadow-sm"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 pb-20 relative z-10">
        <div className="w-full max-w-md bg-white/40 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h1>
            <p className="text-slate-600 text-sm">
              Enter your email below to login to your account
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                href="/forgot-password"
                className="text-xs font-medium text-slate-600 hover:text-blue-700 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Google Sign In Button */}
            <div className="w-full flex justify-center">
              <div id="google-signin-btn" className="w-full max-w-[382px]"></div>
            </div>

            <p className="text-center text-sm text-slate-600 mt-2">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-blue-700 hover:text-blue-800 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
