"use client";

import { useState, useEffect } from "react";
import { Sparkles, X, Check, Zap, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    cooldownRemaining?: number;
}

export default function PaywallModal({
    isOpen,
    onClose,
    title = "AI Quota Exceeded!",
    description = "You've used all 5 free AI generations on your Free Plan. Upgrade to CoreHead PRO to unlock unlimited generation and styling power.",
    cooldownRemaining = 0
}: PaywallModalProps) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(cooldownRemaining);

    useEffect(() => {
        if (cooldownRemaining) {
            setTimeLeft(prev => {
                // Prevent minor network drifts (< 15 seconds) from resetting the local running count
                if (prev > 0 && Math.abs(prev - cooldownRemaining) < 15) {
                    return prev;
                }
                return cooldownRemaining;
            });
        }
    }, [cooldownRemaining]);

    useEffect(() => {
        if (!isOpen) return;
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isOpen]);

    if (!isOpen) return null;

    const handleUpgrade = () => {
        onClose();
        window.location.href = "/pricing";
    };

    const formatTime = (seconds: number) => {
        if (seconds <= 0) return "Ready!";
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const parts = [];
        if (hrs > 0) parts.push(`${hrs}h`);
        if (mins > 0 || hrs > 0) parts.push(`${mins}m`);
        parts.push(`${secs}s`);

        return parts.join(" ");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className="relative w-full max-w-[500px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 transform scale-100 transition-all duration-300 animate-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top Gradient Banner */}
                <div className="bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-800 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 translate-x-2 -translate-y-2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/30 rounded-full blur-xl -ml-6 -mb-6 pointer-events-none" />

                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/15 border border-white/25 rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-bounce">
                        <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
                        CoreHead Pro Feature
                    </div>

                    <h2 className="text-3xl font-extrabold tracking-tight leading-tight">{title}</h2>
                    <p className="mt-2 text-blue-100 text-sm leading-relaxed font-semibold">{description}</p>

                    {timeLeft > 0 && (
                        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl border border-white/20 text-sm font-bold tracking-wide animate-pulse">
                            <Clock className="w-4 h-4 text-blue-200" />
                            <span className="text-blue-200">Resets in:</span>
                            <span className="text-white font-mono">{formatTime(timeLeft)}</span>
                        </div>
                    )}
                </div>

                {/* Feature List Section */}
                <div className="p-8 space-y-6">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Everything unlocked in PRO:</p>
                    <div className="space-y-4">
                        {[
                            "Unlimited AI-assisted dynamic site layouts",
                            "Unlimited AI Assistant (polish grammar, summarize, lengthen)",
                            "Save custom design templates/layouts instantly",
                            "Exclusive premium layouts & design styling modes",
                            "Priority fast-response AI processing & zero queue times"
                        ].map((feat, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="mt-0.5 w-5.5 h-5.5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                                <span className="text-sm text-slate-600 font-bold leading-relaxed">{feat}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                    <button
                        onClick={handleUpgrade}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-705 hover:to-indigo-750 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-sm"
                    >
                        <Zap className="w-4 h-4 fill-white" />
                        Upgrade to Professional Plan
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-slate-500 font-extrabold rounded-2xl transition-colors text-sm"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}
