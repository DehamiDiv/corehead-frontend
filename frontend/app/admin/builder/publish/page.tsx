"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Check,
  ArrowRight,
  Copy,
  Home,
  LayoutTemplate,
  ExternalLink,
} from "lucide-react";

const SAVE_META_KEY = "corehead_builder_save_meta";

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
 * R4-2: Publish confirmation — real template + site public URL (not hard-coded post).
 */
export default function PublishPage() {
  const [copied, setCopied] = useState(false);
  const [meta, setMeta] = useState<SaveMeta | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SAVE_META_KEY);
      if (raw) setMeta(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const name = meta?.name || "Layout";
  const type = meta?.type || "Template";
  const siteSlug = meta?.siteSlug;
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://corehead.app";

  // Public destinations depend on layout type
  const publicPath = siteSlug
    ? type === "Blog Archive"
      ? `/s/${siteSlug}/blog`
      : `/s/${siteSlug}`
    : null;
  const publicUrl = publicPath ? `${origin}${publicPath}` : null;

  const editorHref = meta?.id
    ? `/admin/builder?id=${encodeURIComponent(String(meta.id))}`
    : "/admin/builder";

  const handleCopy = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <Check className="w-12 h-12" strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Layout published
          </h1>
          <p className="text-lg text-slate-600">
            <span className="font-semibold text-slate-800">&ldquo;{name}&rdquo;</span>
            {type ? (
              <>
                {" "}
                <span className="text-slate-400">({type})</span>
              </>
            ) : null}{" "}
            is now live for{" "}
            {meta?.siteName ? (
              <span className="font-semibold text-slate-800">{meta.siteName}</span>
            ) : (
              "your site"
            )}
            .
          </p>
          {meta?.id != null && (
            <p className="text-sm text-slate-400 font-mono">
              Template ID: {String(meta.id)}
            </p>
          )}
        </div>

        {publicUrl ? (
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 max-w-md mx-auto">
            <div className="flex-1 px-3 py-2 bg-slate-50 rounded-lg text-slate-600 text-sm truncate font-medium text-left">
              {publicUrl}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
              title="Copy link"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
            <a
              href={publicPath!}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Open public site"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 max-w-md mx-auto">
            Select a site in the admin switcher, then publish again to get a
            public URL. Assign this template under{" "}
            <Link href="/admin/template-assignment" className="underline font-semibold">
              Template assignment
            </Link>{" "}
            if it should apply to archive or single-post pages.
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-5 text-left max-w-md mx-auto space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <LayoutTemplate className="w-4 h-4 text-blue-500" />
            Next steps
          </div>
          <ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside">
            <li>
              Ensure this template is assigned (global or category) so public
              pages resolve it.
            </li>
            <li>
              {type === "Blog Archive"
                ? "Archive layouts power /s/{slug}/blog."
                : "Single Post layouts power /s/{slug}/blog/{post}."}
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/admin">
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>
          </Link>
          <Link href="/admin/layouts">
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              All layouts
            </button>
          </Link>
          <Link href={editorHref}>
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              Edit again
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
