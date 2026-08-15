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
    Loader2 
} from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
    defaultLayoutDocument,
    prepareLayoutForSave,
} from "@/lib/templateLayout";

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
    
    const router = useRouter();

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
                                    </select>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    {templateType === "Single Post"
                                        ? "Best for individual articles and blog entries."
                                        : "Best for listing pages like search results."}
                                </p>
                            </div>
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
        </div>
    );
}
