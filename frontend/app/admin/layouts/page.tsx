"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Plus,
    Edit,
    Trash2,
    Map,
    FileType,
    CheckCircle2,
    Eye,
    EyeOff,
    Search,
    RefreshCw,
    AlertCircle,
    RotateCcw,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

// --- Types ---
interface Layout {
    id: number;
    name: string;
    type: string;
    status: string;
    category: string | null;
    updatedAt: string;
    createdAt: string;
    author?: { email: string };
}

export default function LayoutsListPage() {
    const [layouts, setLayouts] = useState<Layout[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null); // ID of layout being actioned

    // ── Fetch all templates from backend ──────────────────────────────────────
    const fetchLayouts = useCallback(async (quiet = false) => {
        if (!quiet) setLoading(true);
        setError(null);
        try {
            const data = await api.getTemplates();
            setLayouts(data);
        } catch (err: any) {
            setError(err.message || "Failed to load layouts");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLayouts();
    }, [fetchLayouts]);

    // ── Publish / Unpublish toggle ────────────────────────────────────────────
    const handlePublishToggle = async (layout: Layout) => {
        if (layout.status === "published") return; // Can only publish drafts for now
        setActionLoading(layout.id);
        try {
            await api.publishTemplate(String(layout.id));
            // Refresh list
            await fetchLayouts(true);
        } catch (err: any) {
            alert(`Publish failed: ${err.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    // ── Delete layout ─────────────────────────────────────────────────────────
    const handleDelete = async (layout: Layout) => {
        if (!confirm(`Are you sure you want to delete "${layout.name}"?`)) return;
        setActionLoading(layout.id);
        try {
            await api.deleteTemplate(String(layout.id));
            setLayouts(prev => prev.filter(l => l.id !== layout.id));
        } catch (err: any) {
            alert(`Delete failed: ${err.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    // ── Filter by search ──────────────────────────────────────────────────────
    const filteredLayouts = layouts.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-900 leading-tight">Layout Templates</h1>
                    <p className="text-slate-500 mt-1 font-medium">Design and manage visual templates for your blog</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchLayouts(true)}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                    >
                        <RotateCcw className={cn("w-4 h-4 text-slate-400", loading && "animate-spin")} />
                        Refresh
                    </button>
                    <Link
                        href="/admin/layouts/new"
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl text-[14px] font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Create Layout
                    </Link>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-[20px] mb-8 animate-in fade-in zoom-in-95">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-[14px] font-bold">{error}</span>
                    <button onClick={() => fetchLayouts()} className="ml-auto text-[13px] font-black uppercase tracking-wider hover:underline">Retry</button>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center gap-5 mb-8">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-[14px] font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="text-[14px] font-bold text-slate-900 px-4 py-2 bg-slate-50/50 rounded-xl border border-slate-50">
                    {filteredLayouts.length} templates found
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="px-8 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Template Details</th>
                                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider">Modified</th>
                                <th className="px-8 py-4 text-[13px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                                        <p className="text-slate-500 font-medium">Fetching layout templates...</p>
                                    </td>
                                </tr>
                            ) : filteredLayouts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="p-6 bg-slate-50 rounded-full inline-block mb-4">
                                            <Map className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">No layouts found</h3>
                                        <p className="text-slate-500 mt-2 font-medium">Get started by creating your first template</p>
                                        <Link href="/admin/layouts/new" className="inline-flex items-center gap-2 mt-6 text-blue-600 font-bold hover:underline">
                                            <Plus className="w-4 h-4" />
                                            Create Layout
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                filteredLayouts.map((layout) => {
                                    const isPublished = layout.status === "published";
                                    const isActive = actionLoading === layout.id;
                                    return (
                                        <tr key={layout.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm transition-transform group-hover:scale-105">
                                                        <Map className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 flex items-center gap-2">
                                                            {layout.name}
                                                            {layout.category === "global_default" && (
                                                                <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-100 tracking-wider">
                                                                    Global Default
                                                                </span>
                                                            )}
                                                            {layout.category && layout.category !== "global_default" && (
                                                                <span className="bg-purple-50 text-purple-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-purple-100 tracking-wider">
                                                                    {layout.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] font-bold text-slate-300 mt-0.5 uppercase tracking-widest">ID: #{layout.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-[14px] font-bold text-slate-600">
                                                    <FileType className="w-4 h-4 text-slate-300" />
                                                    {layout.type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border",
                                                    isPublished
                                                        ? "bg-blue-50 text-blue-600 border-blue-100"
                                                        : "bg-slate-50 text-slate-400 border-slate-100"
                                                )}>
                                                    {isPublished ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                                                    {isPublished ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-[13px] font-bold text-slate-400 uppercase tracking-wider">
                                                {formatDate(layout.updatedAt)}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handlePublishToggle(layout)}
                                                        disabled={isPublished || isActive}
                                                        className={cn(
                                                            "p-2.5 bg-white border rounded-xl shadow-sm transition-all",
                                                            isPublished
                                                                ? "border-slate-50 text-slate-200 cursor-not-allowed"
                                                                : "border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50"
                                                        )}
                                                        title={isPublished ? "Already Published" : "Publish Layout"}
                                                    >
                                                        {isActive ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : (isPublished ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />)}
                                                    </button>
                                                    <Link
                                                        href={`/admin/layouts/${layout.id}/edit`}
                                                        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50 shadow-sm transition-all"
                                                        title="Edit Layout"
                                                    >
                                                        <Edit className="w-4.5 h-4.5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(layout)}
                                                        disabled={isActive}
                                                        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50/50 shadow-sm transition-all disabled:opacity-40"
                                                        title="Delete Layout"
                                                    >
                                                        <Trash2 className="w-4.5 h-4.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
