"use client";

import React, { useState } from "react";
import { Play, Check, AlertCircle, Code } from "lucide-react";

// --- Mock Data Service ---
const MOCK_DB = {
    layouts: [
        { id: "1", name: "Standard Blog Post", type: "Single Post" },
        { id: "2", name: "Masonry Archive Grid", type: "Archive" },
        { id: "5", name: "Minimalist Editorial", type: "Single Post" },
    ],
    overrides: [
        { categoryId: "design", singleLayoutId: "5", archiveLayoutId: "2" }
    ],
    defaults: {
        single: "1",
        archive: "2"
    }
};

export default function ResolverTestPage() {
    const [type, setType] = useState("Single Post");
    const [category, setCategory] = useState("tech"); // tech, design, lifestyle
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const resolveLayout = () => {
        setLoading(true);
        setResult(null);

        // Simulate API delay
        setTimeout(() => {
            let resolvedId = type === "Single Post" ? MOCK_DB.defaults.single : MOCK_DB.defaults.archive;
            let reason = "Global Default";

            // Check overrides
            const override = MOCK_DB.overrides.find(o => o.categoryId === category);
            if (override) {
                if (type === "Single Post" && override.singleLayoutId) {
                    resolvedId = override.singleLayoutId;
                    reason = `Category Override (${category})`;
                } else if (type === "Archive" && override.archiveLayoutId) {
                    resolvedId = override.archiveLayoutId;
                    reason = `Category Override (${category})`;
                }
            }

            const layout = MOCK_DB.layouts.find(l => l.id === resolvedId);

            setResult({
                layoutId: resolvedId,
                layoutName: layout?.name || "Unknown",
                reason: reason,
                schema: {
                    version: "1.0",
                    sections: [
                        { id: "hero", type: "hero-section" },
                        { id: "body", type: "content" }
                    ]
                }
            });
            setLoading(false);
        }, 600);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 font-[family-name:var(--font-outfit)]">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Layout Resolver Debugger</h1>
                <p className="text-slate-500">Test which layout will be served for a specific context.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Context Inputs</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                            Template Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                        >
                            <option value="Single Post">Single Post</option>
                            <option value="Archive">Archive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">
                            Category Context
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                        >
                            <option value="tech">Technology (No overrides)</option>
                            <option value="design">Design (Has overrides)</option>
                            <option value="lifestyle">Lifestyle</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={resolveLayout}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all shadow-sm ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md"
                        }`}
                >
                    {loading ? (
                        "Resolving..."
                    ) : (
                        <>
                            <Play size={18} fill="currentColor" />
                            Fetch Active Layout
                        </>
                    )}
                </button>
            </div>

            {result && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${result.reason.includes("Override")
                            ? "bg-purple-50 border-purple-200"
                            : "bg-green-50 border-green-200"
                        }`}>
                        <div className={`mt-0.5 p-1 rounded-full ${result.reason.includes("Override") ? "bg-purple-200 text-purple-700" : "bg-green-200 text-green-700"
                            }`}>
                            <Check size={16} strokeWidth={3} />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-800">
                                Resolved to: <span className="text-lg">{result.layoutName}</span>
                            </div>
                            <p className="text-sm text-slate-600">
                                Resolution Strategy: <strong>{result.reason}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg">
                        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-mono flex items-center gap-2">
                                <Code size={14} />
                                JSON Response
                            </span>
                            <span className="text-xs text-slate-500">ID: {result.layoutId}</span>
                        </div>
                        <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
