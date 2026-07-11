"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  ArrowLeft,
  Calendar,
  Clock,
  LayoutTemplate,
  FileEdit,
} from "lucide-react";

const SAVE_META_KEY = "corehead_builder_save_meta";
const LAYOUT_KEY = "corehead_builder_layout";

type SaveMeta = {
  id?: string | number | null;
  name?: string;
  type?: string;
  status?: string;
  savedAt?: string;
  siteSlug?: string | null;
  siteName?: string | null;
  blockCount?: number;
};

/**
 * R4-2: Draft save confirmation — shows real template meta from last save.
 */
export default function SaveDraftPage() {
  const [meta, setMeta] = useState<SaveMeta | null>(null);
  const [layoutPreview, setLayoutPreview] = useState("[]");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SAVE_META_KEY);
      if (raw) setMeta(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    try {
      setLayoutPreview(localStorage.getItem(LAYOUT_KEY) || "[]");
    } catch {
      setLayoutPreview("[]");
    }
  }, []);

  const name = meta?.name || "Untitled layout";
  const type = meta?.type || "Layout";
  const savedAt = meta?.savedAt
    ? new Date(meta.savedAt).toLocaleString()
    : "Just now";
  const editorHref = meta?.id
    ? `/admin/builder?id=${encodeURIComponent(String(meta.id))}`
    : "/admin/builder";

  let prettyJson = layoutPreview;
  try {
    prettyJson = JSON.stringify(JSON.parse(layoutPreview), null, 2);
  } catch {
    /* keep raw */
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            Draft saved successfully
          </h1>
          <p className="text-slate-500 text-lg">
            <span className="font-semibold text-slate-700">&ldquo;{name}&rdquo;</span>{" "}
            is stored as a draft template
            {meta?.siteName ? (
              <>
                {" "}
                for <span className="font-medium">{meta.siteName}</span>
              </>
            ) : null}
            . It is not live on the public site until you publish.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-blue-500" />
              Template details
            </h2>
            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200">
              Draft
            </span>
          </div>

          <div className="p-6 space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Name
                </p>
                <p className="font-semibold text-slate-800">{name}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Type
                </p>
                <p className="font-semibold text-slate-800">{type}</p>
              </div>
              {meta?.id != null && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Template ID
                  </p>
                  <p className="font-mono text-slate-700">{String(meta.id)}</p>
                </div>
              )}
              {meta?.blockCount != null && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Blocks
                  </p>
                  <p className="font-semibold text-slate-800">{meta.blockCount}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-700">
                Layout JSON (local canvas)
              </h3>
              <span className="text-xs text-slate-400">Canvas snapshot</span>
            </div>
            <pre className="bg-slate-800 text-slate-300 p-4 rounded-lg text-xs overflow-x-auto max-h-48">
              {prettyJson}
            </pre>
          </div>

          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Status: draft
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Last saved: {savedAt}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <Link
            href={editorHref}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/layouts">
              <button
                type="button"
                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm"
              >
                All layouts
              </button>
            </Link>
            <Link href={editorHref}>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
              >
                <FileEdit className="w-4 h-4" />
                Continue editing
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
