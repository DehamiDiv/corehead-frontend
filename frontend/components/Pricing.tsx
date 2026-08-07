"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Zap, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function Pricing() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null); // 'real' | null

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("accessToken") || localStorage.getItem("token"));
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch { }
      }
    }
  }, []);

  const handleUpgrade = async () => {
    if (!token) {
      router.push("/login?callback=/pricing");
      return;
    }

    setLoading("real");
    try {
      const data = await api.createCheckoutSession(false);
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initialize checkout session: " + (data.error || "Unknown error"));
        setLoading(null);
      }
    } catch (err: any) {
      console.error(err);
      alert("Error contacting API: " + err.message);
      setLoading(null);
    }
  };

  const isPro = user?.subscription_status === "PRO";

  return (
    <section id="pricing" className="py-32 px-6 bg-slate-50 text-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900">
            Plans & <span className="text-blue-600">Pricing</span>
          </h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Supercharge your content workflow. Choose to integrate Stripe test cards or run instant sandbox simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Card 1: Free Tier */}
          <div className="relative rounded-[40px] overflow-hidden bg-white border border-slate-200/80 p-10 flex flex-col justify-between shadow-xl shadow-slate-100">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Free Tier</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-6xl font-extrabold text-slate-900 tracking-tighter">$0</span>
                <span className="text-xl text-slate-500 font-semibold">/month</span>
              </div>

              <div className="space-y-5 mb-10">
                {[
                  "Create standard layout templates",
                  "5 AI generation credits per account",
                  "Standard blog post visual writer editor",
                  "Community support access"
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-4 text-base font-semibold text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-slate-500" />
                    </div>
                    {feat}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                disabled={true}
                className="w-full py-4 px-8 rounded-full border border-slate-200 text-slate-400 bg-slate-50 font-bold text-lg text-center cursor-not-allowed"
              >
                {isPro ? "Downgraded" : "Your Current Plan"}
              </button>
            </div>
          </div>

          {/* Card 2: Professional Plan */}
          <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-b from-blue-50/50 to-white border-2 border-blue-600 p-10 flex flex-col justify-between shadow-2xl shadow-blue-600/5 scale-105 z-10">
            <div className="absolute top-0 right-0 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-[10px] tracking-widest uppercase rounded-bl-[20px] rounded-tr-[38px] flex items-center gap-1 shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-white" /> Most Popular
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Professional PRO</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-6xl font-extrabold text-slate-900 tracking-tighter">$9.99</span>
                <span className="text-xl text-slate-500 font-semibold">/month</span>
              </div>

              <div className="space-y-5 mb-10">
                {[
                  "Unlimited AI layout schema generation",
                  "Unlimited Notion-Style AI content refining",
                  "Advanced custom database template saves",
                  "Exclusive layouts & styling blocks unlocked",
                  "Priority developer support access"
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-4 text-base font-semibold text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-blue-600 font-bold" />
                    </div>
                    {feat}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              {isPro ? (
                <button
                  disabled
                  className="w-full py-4 px-8 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-extrabold text-lg text-center"
                >
                  ✓ Plan Active (PRO)
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={loading !== null}
                  className="w-full py-4 px-8 rounded-full bg-blue-600 text-white font-extrabold text-lg text-center hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
                >
                  {loading === "real" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Upgrade to PRO <Zap className="w-4 h-4 fill-white" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
