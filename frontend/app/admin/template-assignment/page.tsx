"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Save, Plus, Trash2, Layers, Tag, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

// --- Types ---
interface LayoutOption {
    id: number;
    name: string;
    type: string;
    status: string;
}

interface CategoryOverride {
    id: string;          // local UI id
    categoryId: string;
    layoutId: number;    // one layout per category override (matched by type from the same assign call)
    layoutType: string;
}

/** R2-5: Match builder / layouts UI type names */
function isPublishedStatus(status?: string) {
    return String(status || "").toLowerCase() === "published";
}

function isSingleType(type?: string) {
    const t = String(type || "").toLowerCase();
    return (
        t.includes("single") ||
        t === "blog" ||
        t === "post" ||
        t === "single_post" ||
        t === "single-post"
    );
}

function isArchiveType(type?: string) {
    const t = String(type || "").toLowerCase();
    return (
        t.includes("archive") ||
        t.includes("loop") ||
        t.includes("collection") ||
        t === "list"
    );
}

export default function TemplateAssignmentPage() {
    // ── All layouts fetched from backend ──────────────────────────────────────
    const [allLayouts, setAllLayouts] = useState<LayoutOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    // ── Global defaults state ─────────────────────────────────────────────────
    const [globalSingleId, setGlobalSingleId] = useState<string>("");
    const [globalArchiveId, setGlobalArchiveId] = useState<string>("");
    const [savingGlobal, setSavingGlobal] = useState(false);
    const [globalSuccess, setGlobalSuccess] = useState(false);

    // ── Category override form state ──────────────────────────────────────────
    const [newCatId, setNewCatId] = useState("");
    const [newLayoutId, setNewLayoutId] = useState<string>("");
    const [savingOverride, setSavingOverride] = useState(false);
    const [overrideSuccess, setOverrideSuccess] = useState(false);

    // ── Local override list (populated from published+assigned templates) ──────
    const [overrides, setOverrides] = useState<CategoryOverride[]>([]);

    // ── Derived layout lists ──────────────────────────────────────────────────
    const publishedLayouts = allLayouts.filter((l) => isPublishedStatus(l.status));
    const singleLayouts = publishedLayouts.filter((l) => isSingleType(l.type));
    const archiveLayouts = publishedLayouts.filter((l) => isArchiveType(l.type));

    // ── Fetch all templates + site categories ─────────────────────────────────
    const fetchLayouts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [dataRaw, catsRaw] = await Promise.all([
                api.getTemplates(),
                api.getCategories().catch(() => ({ categories: [] })),
            ]);
            const data: LayoutOption[] = Array.isArray(dataRaw)
                ? dataRaw
                : (dataRaw as any)?.templates || [];
            setAllLayouts(data);

            const catList = (catsRaw?.categories || catsRaw || []).map((c: any) => ({
                id: String(c.slug || c.id || c.name),
                name: c.name || String(c.slug || c.id),
            }));
            setCategories(catList);
            if (catList.length > 0 && !newCatId) setNewCatId(catList[0].id);

            const singles = data.filter(
                (l) => isPublishedStatus(l.status) && isSingleType(l.type)
            );
            const archives = data.filter(
                (l) => isPublishedStatus(l.status) && isArchiveType(l.type)
            );

            // Prefer already-assigned global defaults
            const globalSingle = singles.find((l: any) => l.category === "global_default");
            const globalArchive = archives.find((l: any) => l.category === "global_default");
            if (globalSingle) setGlobalSingleId(String(globalSingle.id));
            else if (singles.length > 0 && !globalSingleId)
                setGlobalSingleId(String(singles[0].id));
            if (globalArchive) setGlobalArchiveId(String(globalArchive.id));
            else if (archives.length > 0 && !globalArchiveId)
                setGlobalArchiveId(String(archives[0].id));

            const published = data.filter((l) => isPublishedStatus(l.status));
            if (published.length > 0 && !newLayoutId)
                setNewLayoutId(String(published[0].id));

            // Build overrides from assigned templates (category !== null && !== 'global_default')
            const assignedOverrides: CategoryOverride[] = data
                .filter(
                    (l: any) =>
                        l.category &&
                        l.category !== "global_default" &&
                        isPublishedStatus(l.status)
                )
                .map((l: any) => ({
                    id: String(l.id),
                    categoryId: l.category,
                    layoutId: l.id,
                    layoutType: l.type,
                }));
            setOverrides(assignedOverrides);
        } catch (err: any) {
            setError(err.message || "Failed to load templates");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLayouts();
    }, [fetchLayouts]);

    // ── Save Global Defaults ──────────────────────────────────────────────────
    const handleGlobalSave = async () => {
        setSavingGlobal(true);
        setGlobalSuccess(false);
        try {
            const calls: Promise<any>[] = [];
            if (globalSingleId) calls.push(api.assignTemplate(globalSingleId, { isGlobalDefault: true }));
            if (globalArchiveId) calls.push(api.assignTemplate(globalArchiveId, { isGlobalDefault: true }));
            await Promise.all(calls);
            setGlobalSuccess(true);
            setTimeout(() => setGlobalSuccess(false), 3000);
            await fetchLayouts();
        } catch (err: any) {
            alert(`Failed to save global defaults: ${err.message}`);
        } finally {
            setSavingGlobal(false);
        }
    };

    // ── Add Category Override ─────────────────────────────────────────────────
    const handleAddOverride = async () => {
        if (!newLayoutId) return;
        setSavingOverride(true);
        setOverrideSuccess(false);
        try {
            await api.assignTemplate(newLayoutId, { categoryId: newCatId });
            setOverrideSuccess(true);
            setTimeout(() => setOverrideSuccess(false), 3000);
            await fetchLayouts(); // refresh to get updated state from backend
        } catch (err: any) {
            alert(`Failed to add override: ${err.message}`);
        } finally {
            setSavingOverride(false);
        }
    };

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || id;
    const getLayoutName = (id: number) => allLayouts.find(l => l.id === id)?.name || String(id);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32 gap-3 text-gray-400 text-sm">
                <RefreshCw size={20} className="animate-spin" />
                Loading template data...
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Template Assignment</h1>
                <p className="text-slate-500 mt-1">Manage global defaults and category-specific layout overrides.</p>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
                    <AlertCircle size={18} />
                    <span className="text-sm font-medium">{error}</span>
                    <button onClick={fetchLayouts} className="ml-auto text-sm underline font-semibold">Retry</button>
                </div>
            )}

            {publishedLayouts.length === 0 && !error && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 px-5 py-4 rounded-2xl text-sm font-medium">
                    <AlertCircle size={18} />
                    No published templates found. Publish a template first before assigning.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ── Section A: Global Defaults ──────────────────────────────── */}
                <div>
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Layers className="text-blue-600" size={20} />
                                Global Default Layouts
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Used for all content unless a category override is defined.
                            </p>
                        </div>

                        {/* Single Post Global Default */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Default Single Post Layout
                            </label>
                            {singleLayouts.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No published single-post layouts available.</p>
                            ) : (
                                <select
                                    value={globalSingleId}
                                    onChange={(e) => setGlobalSingleId(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white text-sm"
                                >
                                    {singleLayouts.map(l => (
                                        <option key={l.id} value={String(l.id)}>{l.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Archive Global Default */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Default Archive Layout
                            </label>
                            {archiveLayouts.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No published archive layouts available.</p>
                            ) : (
                                <select
                                    value={globalArchiveId}
                                    onChange={(e) => setGlobalArchiveId(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white text-sm"
                                >
                                    {archiveLayouts.map(l => (
                                        <option key={l.id} value={String(l.id)}>{l.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleGlobalSave}
                            disabled={savingGlobal || publishedLayouts.length === 0}
                            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {savingGlobal ? (
                                <RefreshCw size={16} className="animate-spin" />
                            ) : globalSuccess ? (
                                <CheckCircle2 size={16} />
                            ) : (
                                <Save size={16} />
                            )}
                            {globalSuccess ? "Saved!" : savingGlobal ? "Saving..." : "Save Global Defaults"}
                        </button>
                    </div>
                </div>

                {/* ── Section B: Category Overrides ──────────────────────────── */}
                <div>
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Tag className="text-purple-600" size={20} />
                                Category Overrides
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Assign a specific layout to a category to override global defaults.
                            </p>
                        </div>

                        {/* Add New Override Form */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                            <h3 className="text-sm font-semibold text-slate-700">Add New Override</h3>
                            <div className="space-y-3">
                                {/* Category Selector */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                                    <select
                                        value={newCatId}
                                        onChange={(e) => setNewCatId(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                                    >
                                        {categories.length === 0 ? (
                                            <option value="">No categories — create some first</option>
                                        ) : (
                                            categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                {/* Layout Selector */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Layout to Assign</label>
                                    {publishedLayouts.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic">No published layouts available.</p>
                                    ) : (
                                        <select
                                            value={newLayoutId}
                                            onChange={(e) => setNewLayoutId(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                                        >
                                            {publishedLayouts.map(l => (
                                                <option key={l.id} value={String(l.id)}>{l.name} ({l.type})</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <button
                                    onClick={handleAddOverride}
                                    disabled={savingOverride || publishedLayouts.length === 0}
                                    className="w-full py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {savingOverride ? (
                                        <RefreshCw size={14} className="animate-spin" />
                                    ) : overrideSuccess ? (
                                        <CheckCircle2 size={14} className="text-emerald-600" />
                                    ) : (
                                        <Plus size={14} />
                                    )}
                                    {overrideSuccess ? "Assigned!" : savingOverride ? "Assigning..." : "Add Override"}
                                </button>
                            </div>
                        </div>

                        {/* Active Overrides List */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-slate-700">
                                Active Overrides
                                <span className="ml-2 text-xs font-normal text-slate-400">(from backend)</span>
                            </h3>
                            {overrides.length === 0 ? (
                                <p className="text-sm text-slate-400 italic">No category overrides assigned yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {overrides.map((override) => (
                                        <div key={override.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                                            <div>
                                                <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                                                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                                                        {getCategoryName(override.categoryId)}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    Layout: <span className="text-slate-700">{getLayoutName(override.layoutId)}</span>
                                                    <span className="ml-2 text-slate-400">({override.layoutType})</span>
                                                </div>
                                            </div>
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
