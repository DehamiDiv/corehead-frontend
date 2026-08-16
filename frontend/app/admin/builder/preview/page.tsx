"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Monitor, Smartphone, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { getCurrentSite, getCurrentSiteId } from "@/lib/siteStorage";
import { PublicPageRenderer } from "@/components/Renderer/PublicPageRenderer";
import { postToBindData } from "@/lib/tenantLayout";
import type { BuilderBlock } from "@/components/admin/builder/BuilderContext";
import {
  normalizeLayoutDocumentV1,
  prepareRenderableLayout,
  type LayoutDocumentV1,
} from "@/lib/layoutContract";

const LAYOUT_KEY = "corehead_builder_layout";
const META_KEY = "corehead_builder_meta";

type BuilderMeta = {
  name?: string;
  type?: "Single Post" | "Blog Archive" | string;
  id?: string | null;
};

type DeviceMode = "desktop" | "mobile";

/**
 * R4-2: Builder preview — same PublicPageRenderer as public /s/{slug} pages,
 * bound to the current site's posts (X-Site-Id / siteId).
 */
export default function BuilderPreviewPage() {
  const [blocks, setBlocks] = useState<BuilderBlock[]>([]);
  const [layoutDocument, setLayoutDocument] = useState<LayoutDocumentV1 | null>(null);
  const [layoutIssues, setLayoutIssues] = useState<string[]>([]);
  const [meta, setMeta] = useState<BuilderMeta>({});
  const [bindData, setBindData] = useState<Record<string, any>>({});
  const [siteBasePath, setSiteBasePath] = useState<string | undefined>();
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [siteLabel, setSiteLabel] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      // 1. Layout from builder canvas (auto-saved localStorage)
      const saved = localStorage.getItem(LAYOUT_KEY);
      let layoutBlocks: BuilderBlock[] = [];
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const normalized = normalizeLayoutDocumentV1(parsed, {
            name: parsed?.name || "Builder Preview",
            kind: parsed?.kind,
            origin: parsed?.metadata?.origin || "manual",
          });
          const doc = normalized.document as unknown as LayoutDocumentV1;
          const structural = prepareRenderableLayout(doc, { semantic: false });
          const semantic = prepareRenderableLayout(doc, { semantic: true });
          layoutBlocks = doc.blocks as BuilderBlock[];
          setLayoutDocument(doc);
          setLayoutIssues([
            ...normalized.warnings.map((w: any) => `normalize: ${w.code}`),
            ...structural.issues.map((i: any) => `${i.path}: ${i.message}`),
            ...semantic.issues
              .filter((issue: any) => !structural.issues.some((item: any) => item.code === issue.code && item.path === issue.path))
              .map((i: any) => `${i.path}: ${i.message}`),
          ]);
          if (!structural.valid) {
            setError("The saved layout has structural validation errors.");
          }
        } catch {
          setError("Could not parse saved layout JSON.");
        }
      }
      if (!cancelled) setBlocks(layoutBlocks);

      // 2. Meta (name / type)
      let layoutMeta: BuilderMeta = { type: "Single Post", name: "Untitled" };
      try {
        const rawMeta = localStorage.getItem(META_KEY);
        if (rawMeta) layoutMeta = { ...layoutMeta, ...JSON.parse(rawMeta) };
      } catch {
        /* ignore */
      }
      if (!cancelled) setMeta(layoutMeta);

      // 3. Site-scoped posts for bindings / collection blocks
      const site = getCurrentSite();
      const siteId = site?.id ?? getCurrentSiteId();
      if (site) {
        setSiteLabel(site.name || site.slug);
        setSiteBasePath(`/s/${site.slug}`);
      } else if (siteId) {
        setSiteBasePath(undefined);
        setSiteLabel(`Site #${siteId}`);
      } else {
        setSiteLabel("No site selected");
      }

      try {
        const posts = await api.getPreviewPosts(12, siteId);
        const list = Array.isArray(posts) ? posts : posts?.posts || [];
        const first = list[0];
        const siteSlug = site?.slug;

        const data: Record<string, any> = {
          posts: list,
          siteSlug,
          site: site
            ? { name: site.name, slug: site.slug, id: site.id }
            : { name: "Preview Site" },
        };

        if (first) {
          Object.assign(data, postToBindData(first, siteSlug));
        } else {
          // Placeholder bind data so Single Post templates still show structure
          data.post = {
            title: "Sample Post Title",
            excerpt: "This is placeholder copy used when your site has no posts yet.",
            category: "Preview",
            coverImage:
              "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
            featured_image:
              "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
            content:
              "Add and publish posts for this site to see real content in preview.",
            contentHtml:
              "<p>Add and publish posts for this site to see real content in preview.</p>",
            slug: "sample-post",
            author: "Author",
            date: new Date().toLocaleDateString(),
          };
        }

        if (!cancelled) setBindData(data);
      } catch (err: any) {
        console.error("Preview posts failed", err);
        if (!cancelled) {
          setError(
            err?.message ||
            "Failed to load site posts. Check that a site is selected.",
          );
          setBindData({
            posts: [],
            post: {
              title: "Preview unavailable",
              excerpt: "Could not load posts for this site.",
              content: "",
              contentHtml: "",
            },
            site: { name: site?.name || "Site" },
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const backHref = meta.id
    ? `/admin/builder?id=${encodeURIComponent(String(meta.id))}`
    : "/admin/builder";

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={backHref}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Back to Editor</span>
          </Link>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              Preview
            </span>
            <span className="ml-2 text-sm text-slate-600 truncate">
              {meta.name || "Layout"}
              {meta.type ? ` · ${meta.type}` : ""}
            </span>
            {siteLabel && (
              <span className="ml-2 text-xs text-slate-400 hidden md:inline">
                · {siteLabel}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${device === "desktop"
              ? "bg-white shadow text-blue-600"
              : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${device === "mobile"
              ? "bg-white shadow text-blue-600"
              : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </button>
        </div>
      </nav>

      <div className="py-8 px-4 flex justify-center">
        <div
          className={`w-full bg-white shadow-xl border border-slate-200/80 overflow-hidden transition-all duration-300 ${device === "mobile"
            ? "max-w-[390px] rounded-[2rem] min-h-[640px]"
            : "max-w-5xl rounded-2xl min-h-[480px]"
            }`}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium">Loading preview…</p>
            </div>
          ) : blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400 px-6 text-center">
              <p className="text-xl font-semibold text-slate-600">Canvas is empty</p>
              <p className="mt-2 text-sm">
                Go back to the editor and add blocks, then open Preview again.
              </p>
              <Link
                href={backHref}
                className="mt-6 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700"
              >
                Open Editor
              </Link>
            </div>
          ) : (
            <main className="px-4 sm:px-8 py-10">
              {error && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {error}
                </div>
              )}
              {layoutIssues.length > 0 && (
                <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                  <p className="font-semibold mb-1">Layout validation notes</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {layoutIssues.map((issue) => <li key={issue}>{issue}</li>)}
                  </ul>
                </div>
              )}
              <PublicPageRenderer
                layout={layoutDocument || blocks}
                data={bindData}
                siteBasePath={siteBasePath}
              />
            </main>
          )}
        </div>
      </div>
    </div>
  );
}
