"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Plus,
    Edit,
    Trash2,
    Map,
    MoreHorizontal,
    FileType,
    CheckCircle2,
    Eye,
    EyeOff,
    Search,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type LayoutStatus = "Published" | "Draft";
type TemplateType = "Single Post" | "Archive";

interface Layout {
    id: string;
    name: string;
    type: TemplateType;
    status: LayoutStatus;
    updatedAt: string;
    isActive: boolean;
}

const INITIAL_LAYOUTS: Layout[] = [
    { id: "1", name: "Standard Blog Post", type: "Single Post", status: "Published", updatedAt: "2 hours ago", isActive: true },
    { id: "2", name: "Masonry Archive Grid", type: "Archive", status: "Published", updatedAt: "1 day ago", isActive: true },
    { id: "3", name: "Podcast Episode Layout", type: "Single Post", status: "Draft", updatedAt: "3 days ago", isActive: false },
    { id: "4", name: "Minimal List Archive", type: "Archive", status: "Draft", updatedAt: "1 week ago", isActive: false },
];

export default function LayoutsListPage() {
    const [layouts, setLayouts] = useState<Layout[]>(INITIAL_LAYOUTS);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Layout Templates</h1>
                    <p className="text-gray-500 mt-1">Design and manage visual templates for your blog and archives.</p>
                </div>
                <Link
                    href="/admin/layouts/new"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all"
                >
                    <Plus size={18} />
                    Create New Layout
                </Link>
            </div>

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
                    <span>{layouts.length} Layouts Available</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
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
                            {layouts.map((layout) => (
                                <tr key={layout.id} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                                                <Map size={24} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 flex items-center gap-2">
                                                    {layout.name}
                                                    {layout.isActive && (
                                                        <span className="bg-emerald-50 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-100">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[11px] font-bold text-gray-400 mt-0.5">TEMPLATE_ID: {layout.id}</div>
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
                                            layout.status === 'Published'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-gray-50 text-gray-400 border-gray-100'
                                        )}>
                                            {layout.status === 'Published' ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                                            {layout.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-400">
                                        {layout.updatedAt}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-blue-600 shadow-sm transition-all">
                                                {layout.status === 'Published' ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                            <Link
                                                href={`/admin/layouts/${layout.id}/edit`}
                                                className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-blue-600 shadow-sm transition-all"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-red-600 shadow-sm transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
