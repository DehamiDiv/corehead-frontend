"use client";

import Link from "next/link";
import {
  Save,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Loader2,
  Send,
  Download,
  Upload,
  Trash2,
  ArrowRight,
  Undo,
  Redo,
  FileCode,
} from "lucide-react";
import { useBuilder } from "./BuilderContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentSite } from "@/lib/siteStorage";
import { api } from "@/lib/api";

const SAVE_META_KEY = "corehead_builder_save_meta";

export default function EditorHeader() {
  const {
    saveToBackend,
    deviceMode,
    setDeviceMode,
    templateName,
    templateType,
    setTemplateType,
    templateId,
    loadLayout,
    serializeLayout,
    blocks,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useBuilder();
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

    setShowSaveModal(false);
    setIsSaving(true);

    try {
      const result = await saveToBackend(saveStatus, {
        name: tempName.trim(),
        type: templateType,
      });

      const site = getCurrentSite();
      const id = result?.id ?? templateId;
      sessionStorage.setItem(
        SAVE_META_KEY,
        JSON.stringify({
          id,
          name: result?.name ?? tempName.trim(),
          type: result?.type ?? templateType,
          status: saveStatus,
          savedAt: new Date().toISOString(),
          siteSlug: site?.slug ?? null,
          siteName: site?.name ?? null,
          blockCount: blocks.length,
        }),
      );

      // R4-2: real success pages (not alert stubs)
      if (saveStatus === "published") {
        try {
          await api.assignTemplate(String(id), { isGlobalDefault: true });
        } catch (assignErr) {
          console.error("Failed to automatically assign template:", assignErr);
        }
        router.push("/admin/builder/publish");
      } else {
        router.push("/admin/builder/draft");
      }
    } catch (error: any) {
      alert("Error saving: " + (error?.message || "Unknown error"));
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const json = serializeLayout();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, "_").toLowerCase()}_layout.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportHtml = () => {
    // HTML/CSS Compilation helper
    const htmlString = exportToHtmlAndCss(blocks, templateName);
    const blob = new Blob([htmlString], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, "_").toLowerCase()}_layout.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToHtmlAndCss = (blocksData: any[], title: string) => {
    const cssContent = `
      body {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f8fafc;
        color: #0f172a;
        line-height: 1.5;
      }
      .layout-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 3rem 1.5rem;
      }
      .heading-block { font-size: 2.25rem; font-weight: 800; tracking: -0.025em; color: #0f172a; margin-top: 2rem; margin-bottom: 1rem; }
      .paragraph-block { color: #475569; margin-bottom: 1.5rem; font-size: 1.125rem; line-height: 1.75; }
      .image-block { border-radius: 1.5rem; overflow: hidden; margin: 2rem 0; width: 100%; max-height: 500px; object-fit: cover; }
      .quote-block { border-left: 4px solid #2563eb; padding-left: 1.5rem; font-style: italic; color: #1e293b; margin: 2.5rem 0; font-size: 1.35rem; }
      .divider-block { border: 0; border-top: 1px solid #e2e8f0; margin: 3rem 0; }
      .button-block { display: inline-flex; align-items: center; justify-content: center; padding: 0.875rem 2rem; background-color: #2563eb; color: white; font-weight: 700; text-decoration: none; border-radius: 1rem; transition: all 0.2s; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
      .button-block:hover { background-color: #1d4ed8; transform: translateY(-1px); }
      .container-block { border-radius: 2rem; padding: 2.5rem; background: white; border: 1px solid #e2e8f0; margin: 2rem 0; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03); }
      .columns-block { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; margin: 2rem 0; }
      
      .newsletter-block {
        background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
        color: white;
        padding: 3.5rem;
        border-radius: 2rem;
        text-align: center;
        margin: 3rem 0;
        box-shadow: 0 20px 40px -15px rgba(30,58,138,0.3);
      }
      .newsletter-title { font-size: 2rem; font-weight: 800; margin-bottom: 0.75rem; letter-spacing: -0.025em; }
      .newsletter-desc { color: #94a3b8; font-size: 1.05rem; margin-bottom: 2rem; }
      .newsletter-form { display: flex; gap: 0.75rem; max-width: 500px; margin: 0 auto; }
      .newsletter-input { flex: 1; padding: 0.875rem 1.25rem; border-radius: 1rem; border: 1px solid #334155; background: rgba(15,23,42,0.6); color: white; outline: none; }
      .newsletter-input:focus { border-color: #3b82f6; }
      .newsletter-btn { padding: 0.875rem 1.75rem; background: #2563eb; color: white; border: 0; border-radius: 1rem; font-weight: 700; cursor: pointer; transition: background 0.2s; }
      .newsletter-btn:hover { background: #1d4ed8; }
      
      .collection-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2.5rem; margin: 2.5rem 0; }
      .post-card { background: white; border-radius: 1.5rem; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px -5px rgba(0,0,0,0.02); transition: all 0.3s; }
      .post-card:hover { transform: translateY(-6px); box-shadow: 0 20px 30px -10px rgba(0,0,0,0.06); }
      .post-card-img { width: 100%; height: 220px; object-fit: cover; background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%); }
      .post-card-body { padding: 1.75rem; }
      .post-card-cat { color: #2563eb; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
      .post-card-title { font-size: 1.35rem; font-weight: 800; margin: 0.5rem 0; color: #0f172a; line-height: 1.4; }
      .post-card-desc { color: #64748b; font-size: 0.95rem; line-height: 1.6; }
    `;

    const getStyleAttr = (styles: any) => {
      if (!styles) return "";
      return Object.entries(styles)
        .map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}: ${v}`)
        .join("; ");
    };

    const renderBlockHtml = (block: any): string => {
      const styleStr = getStyleAttr(block.styles);
      const styleAttr = styleStr ? `style="${styleStr}"` : "";

      switch (block.type) {
        case "Heading":
          return `<h2 class="heading-block" ${styleAttr}>${block.content || "Heading Text"}</h2>`;
        case "Paragraph":
          return `<p class="paragraph-block" ${styleAttr}>${block.content || "Paragraph text content..."}</p>`;
        case "Image":
          return `<img class="image-block" src="${block.content || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"}" alt="Layout Image" ${styleAttr} />`;
        case "Quote":
          return `<blockquote class="quote-block" ${styleAttr}>${block.content || "Quote text"}</blockquote>`;
        case "Divider":
          return `<hr class="divider-block" ${styleAttr} />`;
        case "Button":
          return `<a href="#" class="button-block" ${styleAttr}>${block.content || "Click Here"}</a>`;
        case "Newsletter":
          return `
            <div class="newsletter-block" ${styleAttr}>
              <div class="newsletter-title">Subscribe to our newsletter</div>
              <div class="newsletter-desc">Get the latest news and updates directly in your inbox.</div>
              <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Subscribed!');">
                <input class="newsletter-input" type="email" placeholder="Your email address" required />
                <button class="newsletter-btn" type="submit">Subscribe</button>
              </form>
            </div>
          `;
        case "Collection List":
          return `
            <div class="collection-grid" ${styleAttr}>
              <div class="post-card">
                <div class="post-card-img"></div>
                <div class="post-card-body">
                  <span class="post-card-cat">Technology</span>
                  <h3 class="post-card-title">The Future of Generative AI</h3>
                  <p class="post-card-desc">Explore how machine learning models are reshaping design, copywriting, and software engineering...</p>
                </div>
              </div>
              <div class="post-card">
                <div class="post-card-img"></div>
                <div class="post-card-body">
                  <span class="post-card-cat">Design</span>
                  <h3 class="post-card-title">Responsive Grid Best Practices</h3>
                  <p class="post-card-desc">How to build premium, adaptive layouts that respond beautifully to mobile, tablet, and viewports.</p>
                </div>
              </div>
            </div>
          `;
        case "Container":
        case "Columns":
          const children = blocksData.filter(b => b.parentId === block.id);
          const childrenHtml = children.map(b => renderBlockHtml(b)).join("\n");
          const gridStyle = block.type === "Columns" 
            ? `grid-template-columns: repeat(${block.content || 2}, minmax(0, 1fr))` 
            : "";
          return `
            <div class="${block.type === "Columns" ? "columns-block" : "container-block"}" style="${gridStyle}; ${styleStr}">
              ${childrenHtml}
            </div>
          `;
        default:
          return "";
      }
    };

    const rootBlocks = blocksData.filter(b => !b.parentId);
    const bodyHtml = rootBlocks.map(b => renderBlockHtml(b)).join("\n");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - CoreHead Export</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    \${cssContent}
  </style>
</head>
<body>
  <div class="layout-container">
    \${bodyHtml}
  </div>
</body>
</html>
    `.trim();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        loadLayout(jsonString);
      } catch {
        alert("Invalid JSON layout file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClear = () => {
    if (
      confirm(
        "Are you sure you want to clear the entire canvas? This cannot be undone.",
      )
    ) {
      loadLayout("[]");
    }
  };

  return (
    <>
      <header className="h-[72px] bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-50 shadow-[0_1px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center justify-center transition-transform hover:scale-[1.02] active:scale-[0.98] mr-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="CoreHead Logo"
              className="h-10 w-auto object-contain"
            />
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

        <div className="hidden lg:flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`p-2 rounded-xl transition-all duration-300 ${
              deviceMode === "desktop"
                ? "bg-white shadow-md text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Desktop view"
          >
            <Monitor size={18} />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("tablet")}
            className={`p-2 rounded-xl transition-all duration-300 ${
              deviceMode === "tablet"
                ? "bg-white shadow-md text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Tablet view"
          >
            <Tablet size={18} />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`p-2 rounded-xl transition-all duration-300 ${
              deviceMode === "mobile"
                ? "bg-white shadow-md text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            title="Mobile view"
          >
            <Smartphone size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isSaving && <Loader2 className="animate-spin text-blue-500" size={18} />}

          {/* Undo/Redo Buttons */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 mr-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
            >
              <Undo size={18} />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
            >
              <Redo size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 mr-2">
            <button
              type="button"
              onClick={handleClear}
              title="Clear Canvas"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
            <label className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer">
              <Upload size={18} />
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </label>
            <button
              type="button"
              onClick={handleExport}
              title="Export JSON"
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
            >
              <Download size={18} />
            </button>
            <button
              type="button"
              onClick={handleExportHtml}
              title="Export HTML/CSS"
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
            >
              <FileCode size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleSaveClick("draft")}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[14px] font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Save size={16} className="text-blue-500" />
            Save
          </button>

          <Link href="/admin/builder/preview">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[14px] font-bold hover:bg-blue-100 transition-all active:scale-95"
            >
              <Eye size={16} />
              Preview
            </button>
          </Link>

          <button
            type="button"
            onClick={() => handleSaveClick("published")}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-[14px] font-black hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50"
          >
            <Send size={16} />
            Publish
          </button>
        </div>
      </header>

      {showSaveModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowSaveModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">
                  Save <span className="text-blue-600">Layout</span>
                </h3>
                <p className="text-slate-500 text-sm font-semibold">
                  {saveStatus === "published"
                    ? "Publish this layout for your site"
                    : "Save as a draft template"}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Save className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Layout Name
                </label>
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
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Layout Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["Single Post", "Blog Archive", "Home Page"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
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
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-4 px-4 bg-slate-50 text-slate-500 rounded-2xl text-[14px] font-black hover:bg-slate-100 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
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
