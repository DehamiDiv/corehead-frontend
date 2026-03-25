"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, UploadCloud, Code, FileType, Layout as LayoutIcon } from "lucide-react";

export default function CreateLayoutPage() {
    const [name, setName] = useState("");
    const [type, setType] = useState("Single Post");
    const [schema, setSchema] = useState(JSON.stringify({
        version: "1.0",
        sections: [
            {
                id: "header",
                type: "hero-section",
                props: {
                    title: "{post.title}",
                    image: "{post.coverImage}"
                }
            },
            {
                id: "content",
                type: "rich-text",
                props: {
                    content: "{post.content}"
                }
            }
        ]
    }, null, 2));

    const handleSave = (status: "draft" | "published") => {
        // Simulate save
        console.log("Saving layout:", { name, type, schema, status });
        alert(`Layout ${status === 'published' ? 'published' : 'saved as draft'}! (Demo)`);
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
                        <h1 className="text-2xl font-bold text-slate-800">Create New Layout</h1>
                        <p className="text-slate-500 text-sm">Define the structure and style of your content</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave("draft")}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <Save size={18} />
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave("published")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <UploadCloud size={18} />
                        Save & Publish
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
                                    placeholder="e.g. Summer Campaign Post"
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
                                <p className="text-xs text-slate-500 mt-2">
                                    {type === "Single Post"
                                        ? "Used for individual blog posts and articles."
                                        : "Used for listing pages like categories or search results."}
                                </p>
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
