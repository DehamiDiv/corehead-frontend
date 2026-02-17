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
    XCircle,
    Eye,
    EyeOff
} from "lucide-react";

// --- Types ---
type LayoutStatus = "published" | "draft";
type TemplateType = "Single Post" | "Archive";

interface Layout {
    id: string;
    name: string;
    type: TemplateType;
    status: LayoutStatus;
    updatedAt: string;
    isActive: boolean;
}

// --- Dummy Data ---
const initialLayouts: Layout[] = [
    {
        id: "1",
        name: "Standard Blog Post",
        type: "Single Post",
        status: "published",
        updatedAt: "2 hours ago",
        isActive: true,
    },
    {
        id: "2",
        name: "Masonry Archive Grid",
        type: "Archive",
        status: "published",
        updatedAt: "1 day ago",
        isActive: true,
    },
    {
        id: "3",
        name: "Podcast Episode Layout",
        type: "Single Post",
        status: "draft",
        updatedAt: "3 days ago",
        isActive: false,
    },
    {
        id: "4",
        name: "Minimal List Archive",
        type: "Archive",
        status: "draft",
        updatedAt: "1 week ago",
        isActive: false,
    },
];

export default function LayoutsListPage() {
    const [layouts, setLayouts] = useState<Layout[]>(initialLayouts);

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this layout?")) {
            setLayouts(layouts.filter(l => l.id !== id));
        }
    };

    const togglePublish = (id: string) => {
        setLayouts(layouts.map(l => {
            if (l.id === id) {
                return { ...l, status: l.status === "published" ? "draft" : "published" };
            }
            return l;
        }));
    };

    return (
        <div className="space-y-6 font-[family-name:var(--font-outfit)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Layouts</h1>
                    <p className="text-slate-500">Manage your blog post and archive layouts</p>
                </div>
                <Link
                    href="/admin/layouts/new"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={18} />
                    Create Layout
                </Link>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Type</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Updated</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {layouts.map((layout) => (
                                <tr key={layout.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <Map size={20} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 flex items-center gap-2">
                                                    {layout.name}
                                                    {layout.isActive && (
                                                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-green-200">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-400">ID: {layout.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <FileType size={16} className="text-slate-400" />
                                            {layout.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${layout.status === 'published'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                            {layout.status === 'published' ? (
                                                <CheckCircle2 size={12} />
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                            )}
                                            {layout.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {layout.updatedAt}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => togglePublish(layout.id)}
                                                className={`p-2 rounded-lg border transition-colors ${layout.status === 'published'
                                                        ? 'bg-white border-slate-200 text-slate-500 hover:text-orange-600 hover:border-orange-200'
                                                        : 'bg-white border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200'
                                                    }`}
                                                title={layout.status === 'published' ? "Unpublish" : "Publish"}
                                            >
                                                {layout.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>

                                            <Link
                                                href={`/admin/layouts/${layout.id}/edit`}
                                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(layout.id)}
                                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-red-600 hover:border-red-300 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {layouts.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                                <Map size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No layouts found</h3>
                            <p className="mt-1 max-w-sm mx-auto">Get started by creating a new layout for your blog posts or archives.</p>
                            <div className="mt-6">
                                <Link
                                    href="/admin/layouts/new"
                                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    <Plus size={18} />
                                    Create Layout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
