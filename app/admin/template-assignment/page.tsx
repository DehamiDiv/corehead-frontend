"use client";

import React, { useState } from "react";
import { Save, Plus, Trash2, Layers, Tag } from "lucide-react";

// --- Types ---
interface LayoutOption {
    id: string;
    name: string;
}

interface CategoryOption {
    id: string;
    name: string;
}

interface CategoryOverride {
    id: string;
    categoryId: string;
    singleLayoutId: string;
    archiveLayoutId: string;
}

// --- Dummy Data ---
const singleLayouts: LayoutOption[] = [
    { id: "1", name: "Standard Blog Post" },
    { id: "3", name: "Podcast Episode Layout" },
    { id: "5", name: "Minimalist Editorial" },
];

const archiveLayouts: LayoutOption[] = [
    { id: "2", name: "Masonry Archive Grid" },
    { id: "4", name: "Minimal List Archive" },
];

const categories: CategoryOption[] = [
    { id: "tech", name: "Technology" },
    { id: "design", name: "Design" },
    { id: "lifestyle", name: "Lifestyle" },
    { id: "news", name: "News" },
];

export default function TemplateAssignmentPage() {
    // Global Defaults State
    const [globalSingle, setGlobalSingle] = useState("1");
    const [globalArchive, setGlobalArchive] = useState("2");

    // Overrides State
    const [overrides, setOverrides] = useState<CategoryOverride[]>([
        { id: "1", categoryId: "design", singleLayoutId: "5", archiveLayoutId: "2" }
    ]);

    // New Override Form State
    const [newCatId, setNewCatId] = useState("tech");
    const [newSingleId, setNewSingleId] = useState("1");
    const [newArchiveId, setNewArchiveId] = useState("2");

    const handleGlobalSave = () => {
        alert("Global defaults saved!");
    };

    const handleAddOverride = () => {
        // Check if duplicate
        if (overrides.some(o => o.categoryId === newCatId)) {
            alert("Override for this category already exists!");
            return;
        }

        const newOverride: CategoryOverride = {
            id: Date.now().toString(),
            categoryId: newCatId,
            singleLayoutId: newSingleId,
            archiveLayoutId: newArchiveId,
        };

        setOverrides([...overrides, newOverride]);
    };

    const handleRemoveOverride = (id: string) => {
        setOverrides(overrides.filter(o => o.id !== id));
    };

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;
    const getLayoutName = (id: string, list: LayoutOption[]) => list.find(l => l.id === id)?.name || id;

    return (
        <div className="max-w-5xl mx-auto space-y-8 font-[family-name:var(--font-outfit)]">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Template Assignment</h1>
                <p className="text-slate-500">Manage global defaults and category-specific layout overrides.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Section A: Global Defaults */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Layers className="text-blue-600" size={20} />
                            Global Default Layouts
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">
                            These layouts will be used for all content unless a specific override is defined.
                        </p>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Default Single Post Layout
                                </label>
                                <select
                                    value={globalSingle}
                                    onChange={(e) => setGlobalSingle(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                                >
                                    {singleLayouts.map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Default Archive Layout
                                </label>
                                <select
                                    value={globalArchive}
                                    onChange={(e) => setGlobalArchive(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                                >
                                    {archiveLayouts.map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={handleGlobalSave}
                                    className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Save Global Defaults
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section B: Category Overrides */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Tag className="text-purple-600" size={20} />
                            Category Overrides
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Assign specific layouts to categories to override the global defaults.
                        </p>

                        {/* Add New Override Form */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 space-y-3">
                            <h3 className="text-sm font-semibold text-slate-700">Add New Override</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <select
                                    value={newCatId}
                                    onChange={(e) => setNewCatId(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                >
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <div className="grid grid-cols-2 gap-3">
                                    <select
                                        value={newSingleId}
                                        onChange={(e) => setNewSingleId(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    >
                                        {singleLayouts.map(l => (
                                            <option key={l.id} value={l.id}>{l.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={newArchiveId}
                                        onChange={(e) => setNewArchiveId(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    >
                                        {archiveLayouts.map(l => (
                                            <option key={l.id} value={l.id}>{l.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={handleAddOverride}
                                    className="w-full py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add Override
                                </button>
                            </div>
                        </div>

                        {/* List of Overrides */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-700">Active Overrides</h3>
                            {overrides.length === 0 ? (
                                <p className="text-sm text-slate-400 italic">No overrides defined.</p>
                            ) : (
                                <div className="space-y-2">
                                    {overrides.map((override) => (
                                        <div key={override.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                                            <div>
                                                <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                                                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded textxs">{getCategoryName(override.categoryId)}</span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                                                    <div>Single: <span className="text-slate-700">{getLayoutName(override.singleLayoutId, singleLayouts)}</span></div>
                                                    <div>Archive: <span className="text-slate-700">{getLayoutName(override.archiveLayoutId, archiveLayouts)}</span></div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveOverride(override.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Remove Override"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
