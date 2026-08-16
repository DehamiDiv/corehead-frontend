"use client";

import { XCircle, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DetailedFooter from "@/components/DetailedFooter";

export default function PaymentCancelPage() {
    return (
        <main className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
            <Navbar />

            <section className="py-24 px-6 flex-1 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-[480px] w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-md shadow-2xl">
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-rose-500/20 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto text-rose-400">
                            <XCircle className="w-10 h-10" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tight text-slate-100">Checkout Cancelled</h1>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                The payment session was cancelled. No charges were made to your account. Feel free to resume upgrading whenever you are ready.
                            </p>
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                            <Link
                                href="/pricing"
                                className="w-full h-12 bg-white/10 hover:bg-white/15 text-slate-200 font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm border border-white/10"
                            >
                                <ArrowLeft className="w-4 h-4" /> View Pricing Plans
                            </Link>

                            <Link
                                href="/admin/posts"
                                className="w-full h-12 bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                Go to Dashboard <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <DetailedFooter />
        </main>
    );
}
