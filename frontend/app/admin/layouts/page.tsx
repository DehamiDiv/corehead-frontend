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
    AlertCircle
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
    const fetchLayouts = useCallback(async () => {
        setLoading(true);
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
            await fetchLayouts();
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
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Layout Templates</h1>
                    <p className="text-gray-500 mt-1">Design and manage visual templates for your blog and archives.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchLayouts}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        title="Refresh"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    <Link
                        href="/admin/builder"
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all"
                    >
                        <Plus size={18} />
                        Create New Layout
                    </Link>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
                    <AlertCircle size={18} />
                    <span className="text-sm font-medium">{error}</span>
                    <button onClick={fetchLayouts} className="ml-auto text-sm underline font-semibold">Retry</button>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full max-w-md">
                    <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search layouts..."
                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                    <span>{filteredLayouts.length} Layout{filteredLayouts.length !== 1 ? "s" : ""} Found</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-24 text-gray-400 text-sm gap-3">
                        <RefreshCw size={18} className="animate-spin" />
                        Loading layouts...
                    </div>
                ) : filteredLayouts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                        <Map size={40} className="opacity-30" />
                        <p className="text-sm font-medium">No layouts found.</p>
                        <Link href="/admin/layouts/new" className="text-blue-600 text-sm font-bold hover:underline">Create your first layout</Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Layout Details</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Modified</th>
                                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredLayouts.map((layout) => {
                                    const isPublished = layout.status === "published";
                                    const isActive = actionLoading === layout.id;
                                    return (
                                        <tr key={layout.id} className="hover:bg-gray-50/50 transition-all group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                                                        <Map size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 flex items-center gap-2">
                                                            {layout.name}
                                                            {layout.category === "global_default" && (
                                                                <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-100">
                                                                    Global Default
                                                                </span>
                                                            )}
                                                            {layout.category && layout.category !== "global_default" && (
                                                                <span className="bg-purple-50 text-purple-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-purple-100">
                                                                    {layout.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] font-bold text-gray-400 mt-0.5">ID: {layout.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                    <FileType size={16} className="text-gray-400" />
                                                    {layout.type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border",
                                                    isPublished
                                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                                        : "bg-gray-50 text-gray-400 border-gray-100"
                                                )}>
                                                    {isPublished ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                                                    {isPublished ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold text-gray-400">
                                                {formatDate(layout.updatedAt)}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {/* Publish Toggle */}
                                                    <button
                                                        onClick={() => handlePublishToggle(layout)}
                                                        disabled={isPublished || isActive}
                                                        className={cn(
                                                            "p-2.5 bg-white border rounded-xl shadow-sm transition-all",
                                                            isPublished
                                                                ? "border-gray-100 text-gray-300 cursor-not-allowed"
                                                                : "border-gray-100 text-gray-500 hover:text-blue-600 hover:border-blue-200"
                                                        )}
                                                        title={isPublished ? "Already Published" : "Publish Layout"}
                                                    >
                                                        {isActive ? <RefreshCw size={18} className="animate-spin" /> : (isPublished ? <Eye size={18} /> : <EyeOff size={18} />)}
                                                    </button>
                                                    {/* Edit */}
                                                    <Link
                                                        href={`/admin/layouts/${layout.id}`}
                                                        className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-blue-600 shadow-sm transition-all"
                                                        title="Edit Layout"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => handleDelete(layout)}
                                                        disabled={isActive}
                                                        className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-red-600 shadow-sm transition-all disabled:opacity-40"
                                                        title="Delete Layout"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
