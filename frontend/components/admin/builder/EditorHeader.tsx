"use client";

import Link from "next/link";
import { Save, Eye, Monitor, Tablet, Smartphone, Loader2, Send, Download, Upload, Trash2, ArrowRight } from "lucide-react";
import { useBuilder } from "./BuilderContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditorHeader() {
  const { saveToBackend, deviceMode, setDeviceMode, templateName, setTemplateName, templateType, setTemplateType, loadLayout, serializeLayout, setActiveSidebar } = useBuilder();
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [tempName, setTempName] = useState(templateName);
  const [saveStatus, setSaveStatus] = useState("draft");
  const router = useRouter();

  const handleSaveClick = (status: string) => {
    setSaveStatus(status);
    setTempName(templateName === "New Layout" ? "" : templateName);
    setShowSaveModal(true);
  };

  const handleConfirmSave = async () => {
    if (!tempName || tempName.trim() === "") {
      alert("Please enter a name for your layout.");
      return;
    }

    setTemplateName(tempName);
    setShowSaveModal(false);
    setIsSaving(true);
    
    try {
      await saveToBackend(saveStatus);
      alert(saveStatus === "published" ? "Layout published successfully!" : "Layout saved as draft successfully!");
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
    <>
      <header className="h-[72px] bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-50 shadow-[0_1px_10px_rgba(0,0,0,0.02)]">
        {/* Left side: Logo and Title */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white shadow-lg shadow-slate-200 group transition-all hover:scale-105 active:scale-95">
            <span className="font-black text-lg italic">C</span>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-black text-slate-900 leading-tight tracking-tight">
                {templateName}
              </span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-blue-100">
                Editing
              </span>
            </div>
            <span className="text-[12px] font-bold text-slate-400 leading-tight mt-0.5">
              Auto-saving enabled
            </span>
          </div>
        </div>

        {/* Middle: Device Toggles */}
        <div className="hidden lg:flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`p-2 rounded-xl transition-all duration-300 ${
              deviceMode === "desktop" ? "bg-white shadow-md text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
            title="Desktop view"
          >
            <Monitor size={18} />
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`p-2 rounded-xl transition-all duration-300 ${
              deviceMode === "tablet" ? "bg-white shadow-md text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
            title="Tablet view"
          >
            <Tablet size={18} />
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`p-2 rounded-xl transition-all duration-300 ${
              deviceMode === "mobile" ? "bg-white shadow-md text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
            title="Mobile view"
          >
            <Smartphone size={18} />
          </button>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-3">
          {isSaving && <Loader2 className="animate-spin text-blue-500" size={18} />}

          {/* Action Group: Tools */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 mr-2">
            <button 
              onClick={handleClear}
              title="Clear Canvas"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={18} />
            </button>
            <label className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer">
              <Upload size={18} />
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <button 
              onClick={handleExport}
              title="Export Layout"
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              <Download size={18} />
            </button>
          </div>
          
          {/* Save Button */}
          <button 
            onClick={() => handleSaveClick("draft")}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[14px] font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Save size={16} className="text-blue-500" />
            Save
          </button>

          {/* Preview Button */}
          <Link href="/admin/builder/preview">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[14px] font-bold hover:bg-blue-100 transition-all active:scale-95">
              <Eye size={16} />
              Preview
            </button>
          </Link>
          
          {/* Publish Button */}
          <button 
            onClick={() => handleSaveClick("published")}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-[14px] font-black hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50"
          >
            <Send size={16} />
            Publish
          </button>
        </div>
      </header>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowSaveModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">
                  Save <span className="text-blue-600">Layout</span>
                </h3>
                <p className="text-slate-500 text-sm font-semibold">Ready to preserve your creation?</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Save className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest px-1">Layout Name</label>
                <input 
                  type="text"
                  value={tempName}
                  autoFocus
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="e.g. Modern Blog Hero Section"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-400 transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest px-1">Layout Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["Single Post", "Blog Archive"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTemplateType(type)}
                      className={`py-3 px-4 rounded-xl text-[13px] font-black transition-all border ${
                        templateType === type 
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                          : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <button 
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-4 px-4 bg-slate-50 text-slate-500 rounded-2xl text-[14px] font-black hover:bg-slate-100 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSave}
                className="flex-[2] py-4 px-4 bg-slate-900 text-white rounded-2xl text-[14px] font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                {saveStatus === "published" ? "Publish Now" : "Save as Draft"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
