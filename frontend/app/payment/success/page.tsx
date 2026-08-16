"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DetailedFooter from "@/components/DetailedFooter";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const syncSubscriptionStatus = async () => {
            if (typeof window === "undefined") return;
            const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Fetch latest profile state from backend
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
                const res = await fetch(`${apiUrl}/auth/me`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        // Save updated user parameters to browser local cache
                        localStorage.setItem("user", JSON.stringify(data.user));
                        setSuccess(true);
                    }
                }
            } catch (err) {
                console.error("Error syncing profile checkout:", err);
            } finally {
                setLoading(false);
            }
        };

        syncSubscriptionStatus();
    }, []);

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
            <Navbar />

            <section className="py-24 px-6 flex-1 flex items-center justify-center relative overflow-hidden">
                {/* Glow elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-[480px] w-full bg-white border border-slate-200/80 rounded-3xl p-8 text-center shadow-xl relative">
                    {loading ? (
                        <div className="space-y-6 py-12 flex flex-col items-center">
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Syncing your Account...</h1>
                            <p className="text-slate-500 text-sm">Please wait while we activate your premium benefits.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="w-20 h-20 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center mx-auto text-blue-600">
                                <CheckCircle className="w-10 h-10" />
                            </div>

                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-800 uppercase tracking-widest">
                                    <Sparkles className="w-3.5 h-3.5 fill-blue-600 text-blue-600" /> Subscription Active
                                </div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">Payment Successful!</h1>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Thank you for subscribing to CoreHead PRO. Your account has been upgraded with unlimited AI layout design power.
                                </p>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5">
                                <h3 className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Unlocked features:</h3>
                                {[
                                    "Unlimited AI layout schema designs",
                                    "Unlimited Notion-style text refining editor keys",
                                    "Priority server generation processing queue"
                                ].map((feat, index) => (
                                    <div key={index} className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold">
                                        <div className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
                                            <span className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" />
                                            <span className="relative w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                        </div>
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2">
                                <Link
                                    href="/admin/posts"
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 text-sm hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <DetailedFooter />
        </main>
    );
}
