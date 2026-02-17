"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Save, UploadCloud, Code, FileType, Layout as LayoutIcon, CheckCircle2 } from "lucide-react";

export default function EditLayoutPage() {
    const params = useParams();
    const id = params?.id as string;

    const [name, setName] = useState("Loading...");
    const [type, setType] = useState("Single Post");
    const [schema, setSchema] = useState("");
    const [status, setStatus] = useState("draft");

    useEffect(() => {
        // Simulate fetching data
        if (id) {
            setName(id === "1" ? "Standard Blog Post" : "Masonry Archive Grid");
            setType(id === "1" ? "Single Post" : "Archive");
            setStatus("published");
            setSchema(JSON.stringify({
                version: "1.0",
                id: id,
                sections: [
                    {
                        id: "header",
                        type: "hero-section",
                        props: { title: "{post.title}" }
                    }
                ]
            }, null, 2));
        }
    }, [id]);

    const handleSave = () => {
        alert("Changes saved! (Demo)");
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
                            <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">v2.4</span>
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Save size={18} />
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
