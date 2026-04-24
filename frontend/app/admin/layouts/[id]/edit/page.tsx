"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, UploadCloud, Code, FileType, Layout as LayoutIcon, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function EditLayoutPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [name, setName] = useState("Loading...");
    const [type, setType] = useState("Single Post");
    const [schema, setSchema] = useState("");
    const [status, setStatus] = useState("draft");
    const [version, setVersion] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchTemplate = async () => {
            if (!id) return;
            try {
                const template = await api.getTemplateById(id);
                setName(template.name);
                setType(template.type);
                setStatus(template.status);
                setVersion(template.version || 1);
                setSchema(JSON.stringify(template.layoutJson, null, 2));
            } catch (error) {
                console.error("Failed to fetch template", error);
                alert("Error: Template not found");
                router.push("/admin/layouts");
            }
        };
        fetchTemplate();
    }, [id, router]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const layoutJson = JSON.parse(schema);
            const updated = await api.updateTemplate(id, {
                name,
                type,
                layoutJson,
                status
            });
            setVersion(updated.version); // Update the version number on the UI
            alert("Changes saved! New version created.");
        } catch (error: any) {
            alert("Error saving: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 font-[family-name:var(--font-outfit)]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/layouts"
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            Edit Layout
                            <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">v{version}</span>
                        </h1>
                        <p className="text-slate-500 text-sm">Update your existing layout configuration</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200 mr-2">
                        <CheckCircle2 size={12} />
                        Published
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Settings */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <LayoutIcon size={18} className="text-blue-600" />
                            General Info
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Layout Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Template Type
                                </label>
                                <div className="relative">
                                    <FileType size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none bg-white"
                                    >
                                        <option value="Single Post">Single Post</option>
                                        <option value="Archive">Archive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Schema Editor */}
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
                                value={schema}
                                onChange={(e) => setSchema(e.target.value)}
                                className="w-full h-full p-6 font-mono text-sm text-slate-700 resize-none focus:outline-none bg-slate-50/50"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
