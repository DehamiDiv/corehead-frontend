"use client";

import Link from "next/link";
import { Save, Eye, Monitor, Tablet, Smartphone, Loader2, Send, Download, Upload, Trash2 } from "lucide-react";
import { useBuilder } from "./BuilderContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditorHeader() {
  const { saveToBackend, deviceMode, setDeviceMode, templateName, loadLayout, serializeLayout } = useBuilder();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async (status: string) => {
    setIsSaving(true);
    try {
      // Connect to real PostgreSQL DB using API
      await saveToBackend(status);
      alert(status === "published" ? "Layout published successfully!" : "Layout saved as draft successfully!");
    } catch (error: any) {
      alert("Error saving: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const json = serializeLayout();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, '_').toLowerCase()}_layout.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        loadLayout(jsonString);
      } catch (error) {
        alert("Invalid JSON layout file.");
      }
    };
    reader.readAsText(file);
    // process file input reset
    e.target.value = "";
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the entire canvas? This cannot be undone.")) {
      loadLayout("[]");
    }
  };

  return (
    <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left side: Logo and Title */}
      <div className="flex items-center gap-3">
        <Link href="/admin" className="flex items-center justify-center w-8 h-8 bg-slate-900 rounded-full text-white">
          <span className="font-bold text-sm">C</span>
        </Link>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold text-slate-900 leading-tight">
            {templateName}
          </span>
          <span className="text-[11px] font-medium text-slate-500 leading-tight">
            Previewing last saved version
          </span>
        </div>
      </div>

      {/* Middle: Device Toggles */}
      <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setDeviceMode("desktop")}
          className={`p-1.5 rounded-md transition-colors ${
            deviceMode === "desktop" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
          }`}
          title="Desktop view"
        >
          <Monitor size={16} />
        </button>
        <button
          onClick={() => setDeviceMode("tablet")}
          className={`p-1.5 rounded-md transition-colors ${
            deviceMode === "tablet" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
          }`}
          title="Tablet view"
        >
          <Tablet size={16} />
        </button>
        <button
          onClick={() => setDeviceMode("mobile")}
          className={`p-1.5 rounded-md transition-colors ${
            deviceMode === "mobile" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
          }`}
          title="Mobile view"
        >
          <Smartphone size={16} />
        </button>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2.5">
        {isSaving && <Loader2 className="animate-spin text-slate-400" size={16} />}

        {/* Clear Button */}
        <button 
          onClick={handleClear}
          title="Clear Canvas"
          className="flex items-center gap-2 px-2.5 py-1.5 bg-red-50 border border-red-100 text-red-600 rounded-lg text-[13px] font-semibold hover:bg-red-100 transition-colors mr-2"
        >
          <Trash2 size={14} />
        </button>
        
        {/* Import JSON Button */}
        <label className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-slate-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
          <Upload size={14} />
          Import
          <input type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>

        {/* Export JSON Button */}
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-slate-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50 transition-colors"
        >
          <Download size={14} />
          Export
        </button>

        {/* Save Button */}
        <button 
          onClick={() => handleSave("draft")}
          disabled={isSaving}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-slate-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Save size={14} />
          Save
        </button>

        {/* Preview Button */}
        <Link href="/admin/builder/preview">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-slate-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50 transition-colors">
            <Eye size={14} />
            Preview
          </button>
        </Link>
        
        {/* Publish Button */}
        <button 
          onClick={() => handleSave("published")}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[13px] font-bold hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
        >
          <Send size={14} className="mr-0.5" />
          Publish
        </button>
      </div>
    </header>
  );
}
