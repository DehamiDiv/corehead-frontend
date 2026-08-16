"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
    ArrowLeft, 
    Save, 
    UploadCloud, 
    Code, 
    FileType, 
    Layout as LayoutIcon, 
    Loader2,
    Eye,
    Monitor,
    Tablet,
    Smartphone,
    X,
} from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { PublicPageRenderer } from "@/components/Renderer/PublicPageRenderer";
import { getCurrentSite, getCurrentSiteId } from "@/lib/siteStorage";
import type { LayoutDocumentV1 } from "@/lib/layoutContract";
import {
    defaultLayoutDocument,
    prepareLayoutForSave,
} from "@/lib/templateLayout";
import {
    HOME_PAGE_BINDINGS,
    HOME_PAGE_LAYOUT_STARTERS,
} from "@/lib/homePageLayoutStarters";

// Default schema structure for new layouts
// This prevents hardcoding the JSON directly inside the component's state initialization.
const DEFAULT_LAYOUT_SCHEMA = defaultLayoutDocument("Single Post");

export default function CreateLayoutPage() {
    // --- State Management ---
    const [layoutName, setLayoutName] = useState("");
    const [templateType, setTemplateType] = useState("Single Post");
    const [schemaContent, setSchemaContent] = useState(
        JSON.stringify(DEFAULT_LAYOUT_SCHEMA, null, 2)
    );
    const [isProcessing, setIsProcessing] = useState(false);
    const [homeBinding, setHomeBinding] = useState<(typeof HOME_PAGE_BINDINGS)[number]["value"]>("site.name");
    const [previewDocument, setPreviewDocument] = useState<LayoutDocumentV1 | null>(null);
    const [previewData, setPreviewData] = useState<Record<string, any>>({});
    const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    
    const router = useRouter();

    const applyHomeStarter = (starterId: (typeof HOME_PAGE_LAYOUT_STARTERS)[number]["id"]) => {
        const starter = HOME_PAGE_LAYOUT_STARTERS.find((item) => item.id === starterId);
        if (!starter) return;
        const document = JSON.parse(JSON.stringify(starter.document));
        document.name = layoutName.trim() || starter.document.name;
        setSchemaContent(JSON.stringify(document, null, 2));
    };

    const insertHomeBindingBlock = () => {
        try {
            const document = JSON.parse(schemaContent);
            if (!Array.isArray(document.blocks)) throw new Error("The layout must contain a blocks array.");
            const binding = HOME_PAGE_BINDINGS.find((item) => item.value === homeBinding);
            if (!binding) return;
            const suffix = `${Date.now()}-${document.blocks.length + 1}`;
            document.blocks.push({
                id: `home-binding-${suffix}`,
                type: binding.blockType,
                content: binding.blockType === "Image"
                    ? { src: "", alt: binding.label }
                    : binding.label,
                ...(binding.blockType === "Heading" ? { level: 2 } : {}),
                bindings: { content: binding.value },
            });
            setSchemaContent(JSON.stringify(document, null, 2));
        } catch (error: any) {
            alert(`Cannot add binding: ${error.message}`);
        }
    };

    const openPreview = async () => {
        setIsPreviewLoading(true);
        try {
            const prepared = prepareLayoutForSave(JSON.parse(schemaContent), {
                name: layoutName.trim() || "Layout Preview",
                type: templateType,
                status: "draft",
                origin: "manual",
            });
            const site = getCurrentSite();
            const siteId = site?.id ?? getCurrentSiteId();
            let posts: any[] = [];
            try {
                const response = await api.getPreviewPosts(12, siteId);
                posts = Array.isArray(response) ? response : response?.posts || [];
            } catch {
                posts = [];
            }
            if (posts.length === 0) {
                posts = [
                    { id: "sample-1", slug: "sample-story", title: "A sample story for your new home page", excerpt: "Published posts from the selected site will appear here.", category: "Journal", coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80" },
                    { id: "sample-2", slug: "second-story", title: "Designing a thoughtful publishing experience", excerpt: "Use this preview to check hierarchy, spacing, and responsive behavior.", category: "Design", coverImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80" },
                    { id: "sample-3", slug: "third-story", title: "Ideas worth sharing", excerpt: "Your readers will see the latest published content in this collection.", category: "Ideas", coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80" },
                ];
            }
            const previewSite = {
                id: site?.id,
                name: site?.name || "Your Site",
                slug: site?.slug || "preview-site",
                logo: site?.logo || "",
                tagline: "Stories, ideas, and updates from our team.",
                description: "A publication created with CoreHead.",
                heroImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80",
            };
            setPreviewData({ posts, site: previewSite, siteSlug: previewSite.slug });
            setPreviewDocument(prepared.document);
        } catch (error: any) {
            alert(`Preview error: ${error.message}`);
        } finally {
            setIsPreviewLoading(false);
        }
    };

    /**
     * Handles saving the layout to the database.
     * Validates JSON schema before sending to the API.
     */
    const handleSaveLayout = async (publishStatus: "draft" | "published") => {
        // Basic validation: Name is required
        if (!layoutName.trim()) {
            alert("Please enter a layout name before saving.");
            return;
        }

        setIsProcessing(true);
        try {
            // Validate if the user entered valid JSON
            let parsedSchema;
            try {
                parsedSchema = JSON.parse(schemaContent);
            } catch (e) {
                throw new Error("Invalid JSON format in the schema editor.");
            }

            // API call to persist the template
            const prepared = prepareLayoutForSave(parsedSchema, {
                name: layoutName,
                type: templateType,
                status: publishStatus,
                origin: "manual",
            });

            await api.createTemplate({
                name: layoutName,
                type: templateType,
                layoutJson: prepared.document,
                status: publishStatus
            });

            const successMessage = publishStatus === 'published' 
                ? 'Layout published successfully!' 
                : 'Layout saved as draft.';
            
            alert(successMessage);
            router.push("/admin/layouts");
            
        } catch (error: any) {
            console.error("Layout Save Error:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 font-[family-name:var(--font-outfit)] pb-10">
            {/* --- Navigation & Actions --- */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/layouts"
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Back to layouts"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Create New Layout</h1>
                        <p className="text-slate-500 text-sm">Define the structure and style of your content</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={openPreview}
                        disabled={isProcessing || isPreviewLoading}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isPreviewLoading ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} />}
                        Preview
                    </button>
                    <button
                        onClick={() => handleSaveLayout("draft")}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSaveLayout("published")}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                        Save & Publish
                    </button>
                </div>
            </div>

            {/* --- Main Configuration Area --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Sidebar: General Settings */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <LayoutIcon size={18} className="text-blue-600" />
                            General Details
                        </h3>

                        <div className="space-y-4">
                            {/* Layout Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Layout Name
                                </label>
                                <input
                                    type="text"
                                    value={layoutName}
                                    onChange={(e) => setLayoutName(e.target.value)}
                                    placeholder="e.g. Modern Blog Template"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                />
                            </div>

                            {/* Template Type Selector */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Template Type
                                </label>
                                <div className="relative">
                                    <FileType size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <select
                                        value={templateType}
                                        onChange={(e) => {
                                            const nextType = e.target.value;
                                            const currentDefault = JSON.stringify(defaultLayoutDocument(templateType), null, 2);
                                            setTemplateType(nextType);
                                            if (schemaContent === currentDefault) {
                                                setSchemaContent(JSON.stringify(defaultLayoutDocument(nextType), null, 2));
                                            }
                                        }}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none bg-white"
                                    >
                                        <option value="Single Post">Single Post</option>
                                        <option value="Blog Archive">Blog Archive</option>
                                        <option value="Home Page">Home Page</option>
                                    </select>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    {templateType === "Single Post"
                                        ? "Best for individual articles and blog entries."
                                        : templateType === "Blog Archive"
                                          ? "Best for listing pages like search results."
                                          : "Best for the public site landing page, including site identity and latest posts."}
                                </p>
                            </div>

                            {templateType === "Home Page" && (
                                <div className="space-y-3 border-t border-slate-100 pt-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">Starter composition</p>
                                        <p className="text-xs text-slate-500 mt-1">Choose a professional structure, then customize its JSON.</p>
                                    </div>
                                    <div className="space-y-2">
                                        {HOME_PAGE_LAYOUT_STARTERS.map((starter) => (
                                            <button
                                                key={starter.id}
                                                type="button"
                                                onClick={() => applyHomeStarter(starter.id)}
                                                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-300 hover:bg-blue-50"
                                            >
                                                <span className="block text-sm font-semibold text-slate-800">{starter.name}</span>
                                                <span className="mt-1 block text-xs leading-5 text-slate-500">{starter.description}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                                        <label className="block text-xs font-semibold text-blue-900 mb-2">Add dynamic site field</label>
                                        <select
                                            value={homeBinding}
                                            onChange={(event) => setHomeBinding(event.target.value as typeof homeBinding)}
                                            className="w-full rounded-md border border-blue-200 bg-white px-2 py-2 text-xs text-slate-700"
                                        >
                                            {HOME_PAGE_BINDINGS.map((binding) => (
                                                <option key={binding.value} value={binding.value}>{binding.label}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={insertHomeBindingBlock}
                                            className="mt-2 w-full rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                        >
                                            Add bound block
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Area: Schema Editor */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <Code size={18} className="text-blue-600" />
                                Layout Schema (JSON)
                            </h3>
                            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                schema.json
                            </span>
                        </div>
                        <div className="flex-1 relative">
                            <textarea
                                value={schemaContent}
                                onChange={(e) => setSchemaContent(e.target.value)}
                                className="w-full h-full p-6 font-mono text-sm text-slate-700 resize-none focus:outline-none bg-slate-50/50"
                                spellCheck={false}
                                placeholder="Paste or write your JSON schema here..."
                            />
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400 italic">
                        * Ensure the JSON structure matches the platform requirements to avoid rendering errors.
                    </p>
                </div>
            </div>

            {previewDocument && (
                <div className="fixed inset-0 z-[100] bg-slate-950/70 p-3 sm:p-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Responsive layout preview">
                    <div className="mx-auto flex h-full max-w-[1500px] flex-col overflow-hidden rounded-2xl bg-slate-100 shadow-2xl">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
                            <div>
                                <p className="font-semibold text-slate-900">{previewDocument.name}</p>
                                <p className="text-xs text-slate-500">Uses the same renderer as the published site</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1" aria-label="Preview device">
                                    {([
                                        { id: "desktop", label: "Desktop", icon: Monitor },
                                        { id: "tablet", label: "Tablet", icon: Tablet },
                                        { id: "mobile", label: "Mobile", icon: Smartphone },
                                    ] as const).map(({ id, label, icon: DeviceIcon }) => (
                                        <button
                                            key={id}
                                            type="button"
                                            title={label}
                                            aria-label={label}
                                            aria-pressed={previewDevice === id}
                                            onClick={() => setPreviewDevice(id)}
                                            className={`rounded-md p-2 ${previewDevice === id ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-white"}`}
                                        >
                                            <DeviceIcon size={17} />
                                        </button>
                                    ))}
                                </div>
                                <button type="button" onClick={() => setPreviewDocument(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close preview">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-3 sm:p-6">
                            <div
                                className="mx-auto min-h-full overflow-hidden bg-white shadow-xl transition-[max-width] duration-300"
                                style={{ maxWidth: previewDevice === "mobile" ? 390 : previewDevice === "tablet" ? 820 : 1280 }}
                            >
                                <PublicPageRenderer
                                    layout={previewDocument}
                                    data={previewData}
                                    siteBasePath={`/s/${previewData.site?.slug || "preview-site"}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
