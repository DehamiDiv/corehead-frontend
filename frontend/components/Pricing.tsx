"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Zap, Loader2 } from "lucide-react";
import Script from "next/script";
import { api } from "@/lib/api";

export default function Pricing() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null); // "PRO" | null
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("accessToken") || localStorage.getItem("token"));
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch { }
      }

      // Inject PayHere Sandbox SDK dynamically to ensure it is always loaded and ready
      const existingScript = document.getElementById("payhere-sdk");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://www.payhere.lk/lib/payhere.js";
        script.id = "payhere-sdk";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  const handleUpgrade = async (planType: "PRO" = "PRO", gateway: "stripe" | "payhere" = "stripe") => {
    if (!token) {
      router.push(`/login?callback=/pricing`);
      return;
    }

    setLoading(gateway);
    try {
      if (gateway === "stripe") {
        const data = await api.createCheckoutSession(false, planType);
        if (data.success && data.url) {
          window.location.href = data.url;
        } else {
          alert("Failed to initialize Stripe checkout: " + (data.error || "Unknown error"));
          setLoading(null);
        }
      } else {
        const data = await api.createPayHereCheckout(planType);
        if (data.success) {
          const payhere = (window as any).payhere;
          if (!payhere) {
            alert("PayHere SDK not loaded yet. Please wait a moment and try again.");
            setLoading(null);
            return;
          }

          payhere.onCompleted = function (orderId: string) {
            console.log("PayHere Payment completed:", orderId);
            window.location.href = `/payment/success?gateway=payhere&order_id=${orderId}&plan=${planType}`;
          };

          payhere.onDismissed = function () {
            console.log("PayHere Payment dismissed");
            setLoading(null);
          };

          payhere.onError = function (error: any) {
            console.error("PayHere Payment error:", error);
            alert("PayHere payment error: " + error);
            setLoading(null);
          };

          const payment = {
            sandbox: true,
            merchant_id: data.merchant_id,
            return_url: data.return_url,
            cancel_url: data.cancel_url,
            notify_url: data.notify_url,
            order_id: data.order_id,
            items: data.items,
            amount: data.amount,
            currency: data.currency,
            hash: data.hash,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            country: data.country
          };

          payhere.startPayment(payment);
        } else {
          alert("Failed to initialize PayHere checkout: " + (data.error || "Unknown error"));
          setLoading(null);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert("Error contacting API: " + err.message);
      setLoading(null);
    }
  };

  const isPro = user?.subscription_status === "PRO";

  // Clean light check icon matching the brand blue theme
  const CheckIcon = ({ color = "text-blue-600 bg-blue-50" }) => (
    <div className={`w-5 h-5 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
      <Check className="w-3.5 h-3.5 stroke-[3]" />
    </div>
  );

  if (!mounted) {
    return (
      <section id="pricing" className="py-28 px-6 bg-slate-50/50 text-slate-800 relative overflow-hidden min-h-[600px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </section>
    );
  }

  return (
    <section id="pricing" className="py-28 px-6 bg-slate-50/50 text-slate-800 relative overflow-hidden">
      {/* Background decorations for soft glow */}
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-indigo-50/30 rounded-full blur-[150px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Block with Title, Subtitle, and Billing Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-none text-slate-900">
              Choose the Perfect <br className="hidden md:inline" />
              Plan for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600">You</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed font-normal">
              Choose a plan that will help you create professional templates, layout blogs and scale your content with AI. Suitable for personal projects, teamwork, and large-scale sites.
            </p>
          </div>

          {/* Monthly / Annually Segment Picker */}
          <div className="flex-shrink-0 flex items-center">
            <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex items-center shadow-sm">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`py-2 px-5 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 ${billingPeriod === "monthly"
                  ? "bg-slate-100 text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annually")}
                className={`py-2 px-5 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 flex items-center gap-1.5 ${billingPeriod === "annually"
                  ? "bg-slate-100 text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
                  }`}
              >
                Annually
                <span className="text-[10px] bg-blue-100 text-blue-700 border border-blue-200 py-0.5 px-1.5 rounded-full font-bold">
                  Save 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch justify-center max-w-6xl mx-auto">

          {/* Card 1: Starter Plan (Free Tier) */}
          <div className="rounded-3xl border border-slate-200 bg-white hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl shadow-slate-100/40 group">

            {/* Top Fluid Wave SVG Graphic - Cyan/Blue */}
            <div className="relative w-full h-32 overflow-hidden bg-slate-50">
              <svg className="w-full h-full object-cover scale-[1.02] transform transition-transform duration-700 group-hover:scale-105" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="starterWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="60%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <rect width="400" height="120" fill="#f8fafc" />
                <path d="M0 60 C120 100 240 20 400 70 L400 120 L0 120 Z" fill="url(#starterWaveGrad)" opacity="0.85" />
                <path d="M0 45 C150 15 280 90 400 35 L400 120 L0 120 Z" fill="url(#starterWaveGrad)" opacity="0.45" />
              </svg>
            </div>

            {/* Content Container */}
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Starter Plan</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Beginners who want to explore CoreHead template generation without any active commitment.
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 mb-8">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">$0.00</span>
                  <span className="text-slate-500 text-sm font-semibold">/ monthly</span>
                </div>

                {/* CTA Action button */}
                <div className="mb-8">
                  <button
                    disabled={true}
                    className="w-full py-3.5 px-6 rounded-xl border border-slate-200 text-slate-400 bg-slate-50 font-bold text-sm text-center cursor-not-allowed uppercase tracking-wider"
                  >
                    Your Current Plan
                  </button>
                </div>

                {/* Plan limits list */}
                <div className="border-t border-slate-100 pt-6 mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Plan Limits</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckIcon />
                      <span>5 AI generations per 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckIcon />
                      <span>1 active site creation limit</span>
                    </div>
                  </div>
                </div>

                {/* Features list */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckIcon />
                      <span>Standard visual layout creator editor</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                      <CheckIcon color="text-zinc-400 bg-zinc-100" />
                      <span className="text-slate-500">Community support forum access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Creator Plan (PRO subscription) - Matches Brand Blue Theme */}
          <div className="rounded-3xl border-2 border-blue-600 bg-white hover:border-blue-700 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl shadow-blue-600/10 relative transform md:-translate-y-2 z-10 group">

            {/* Save 25% floating tag for Professional plan */}
            <div className="absolute top-4 right-4 z-20 bg-blue-600 border border-blue-500 text-white font-extrabold text-[10px] tracking-widest uppercase py-1.5 px-3 rounded-full flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3 text-white fill-white" /> Save 25%
            </div>

            {/* Top Fluid Wave SVG Graphic - Deep Brand Blue/Navy */}
            <div className="relative w-full h-32 overflow-hidden bg-slate-50">
              <svg className="w-full h-full object-cover scale-[1.02] transform transition-transform duration-700 group-hover:scale-105" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="creatorWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="50%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <rect width="400" height="120" fill="#f8fafc" />
                <path d="M0 60 C120 100 240 20 400 70 L400 120 L0 120 Z" fill="url(#creatorWaveGrad)" opacity="0.85" />
                <path d="M0 45 C150 15 280 90 400 35 L400 120 L0 120 Z" fill="url(#creatorWaveGrad)" opacity="0.45" />
              </svg>
            </div>

            {/* Content Container */}
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Creator Plan (PRO)</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Freelancers and small creators that need fast layout design and robust AI capabilities.
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 mb-8">
                  {billingPeriod === "monthly" ? (
                    <>
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">$9.99</span>
                      <span className="text-slate-500 text-sm font-semibold">/ monthly</span>
                    </>
                  ) : (
                    <>
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">$7.49</span>
                      <span className="text-slate-500 text-sm font-semibold">/ monthly equiv</span>
                      <span className="text-xs text-blue-600 font-bold ml-2">(billed annually $89.88)</span>
                    </>
                  )}
                </div>

                {/* CTA Action button - Gradients of Brand Blue */}
                <div className="mb-8">
                  {isPro ? (
                    <button
                      disabled
                      className="w-full py-3.5 px-6 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 font-bold text-sm text-center flex items-center justify-center gap-1.5"
                    >
                      ✓ Plan Active (PRO)
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade("PRO", "stripe")}
                      disabled={loading !== null}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold text-sm text-center transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg shadow-slate-950/10 active:scale-[0.98]"
                    >
                      {loading === "stripe" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>Upgrade to PRO <Zap className="w-3.5 h-3.5 fill-white" /></>
                      )}
                    </button>
                  )}
                </div>

                {/* Plan limits list */}
                <div className="border-t border-slate-100 pt-6 mb-6">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Plan Limits</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckIcon />
                      <span>100 AI layout generations per 24h</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckIcon />
                      <span>Up to 5 active site creations limit</span>
                    </div>
                  </div>
                </div>

                {/* Features list */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Everything in Starter Plus</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckIcon />
                      <span>Unlimited AI grammar polishers & summary</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckIcon />
                      <span>Exclusive templates & pre-designed styles</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Enterprise Plan */}
          <div className="rounded-3xl border border-slate-200 bg-white hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl shadow-slate-100/40 group">

            {/* Top Fluid Wave SVG Graphic - Deep Navy/Purple */}
            <div className="relative w-full h-32 overflow-hidden bg-slate-50">
              <svg className="w-full h-full object-cover scale-[1.02] transform transition-transform duration-700 group-hover:scale-105" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="enterpriseWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#312e81" />
                    <stop offset="50%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <rect width="400" height="120" fill="#f8fafc" />
                <path d="M0 60 C120 100 240 20 400 70 L400 120 L0 120 Z" fill="url(#enterpriseWaveGrad)" opacity="0.85" />
                <path d="M0 45 C150 15 280 90 400 35 L400 120 L0 120 Z" fill="url(#enterpriseWaveGrad)" opacity="0.45" />
              </svg>
            </div>

            {/* Content Container */}
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Enterprise Plan</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Large teams and agencies requiring infinite scale, custom domains, and support.
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 mb-8">
                  {billingPeriod === "monthly" ? (
                    <>
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">$49.99</span>
                      <span className="text-slate-500 text-sm font-semibold">/ monthly</span>
                    </>
                  ) : (
                    <>
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">$37.49</span>
                      <span className="text-slate-500 text-sm font-semibold">/ monthly equiv</span>
                      <span className="text-xs text-blue-600 font-bold ml-2">(billed annually $449.88)</span>
                    </>
                  )}
                </div>

                {/* CTA Action button */}
                <div className="mb-8">
                  {user?.subscription_status === "ENTERPRISE" ? (
                    <button
                      disabled
                      className="w-full py-3.5 px-6 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 font-bold text-sm text-center flex items-center justify-center gap-1.5"
                    >
                      ✓ Plan Active (ENTERPRISE)
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade("ENTERPRISE" as any, "stripe")}
                      disabled={loading !== null}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-900 to-indigo-800 hover:from-indigo-800 hover:to-indigo-700 text-white font-bold text-sm text-center transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/10 active:scale-[0.98]"
                    >
                      {loading === "stripe" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>Upgrade to Enterprise <Zap className="w-3.5 h-3.5 fill-white" /></>
                      )}
                    </button>
                  )}
                </div>

                {/* Plan limits list */}
                <div className="border-t border-slate-100 pt-6 mb-6">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Plan Limits</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckIcon />
                      <span>Unlimited AI layout generations</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckIcon />
                      <span>Unlimited active site creations</span>
                    </div>
                  </div>
                </div>

                {/* Features list */}
                <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">Everything in PRO Plus</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckIcon />
                      <span>Team collaboration invites (Unlimited members)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckIcon />
                      <span>Dedicated Account Manager & 24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
