"use client";

import { X } from "lucide-react";
import { resolveMediaUrl } from "@/lib/siteMedia";
import { preparePostHtml } from "@/lib/htmlContent";

export type PostPreviewData = {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  status?: string;
  category?: string;
  categories?: string[];
  thumbnailUrl?: string;
  authorName?: string;
};

/**
 * R3-3 — Admin post preview (does not publish).
 * Renders HTML body properly (not raw &lt;p&gt; tags).
 */
export default function PostPreviewModal({
  open,
  onClose,
  post,
}: {
  open: boolean;
  onClose: () => void;
  post: PostPreviewData;
}) {
  if (!open) return null;

  const image = resolveMediaUrl(post.thumbnailUrl || null);
  const category =
    post.category ||
    (Array.isArray(post.categories) ? post.categories[0] : "") ||
    "Article";

  const bodyHtml = preparePostHtml(post.content);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-100">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur border-b border-slate-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
              Preview · not public
            </p>
            <p className="text-sm font-semibold text-slate-500">
              Status: {post.status || "Draft"}
              {post.slug ? ` · /${post.slug}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <article className="px-6 sm:px-10 py-8">
          <span className="inline-flex text-[11px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-4">
            {category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4">
            {post.title || "Untitled post"}
          </h1>
          {post.authorName && (
            <p className="text-sm text-slate-500 mb-6">By {post.authorName}</p>
          )}
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className="w-full aspect-[16/9] object-cover rounded-2xl mb-8 border border-slate-100"
            />
          )}
          {post.excerpt && (
            <p className="text-lg text-slate-600 italic mb-8 border-l-4 border-blue-200 pl-4">
              {post.excerpt}
            </p>
          )}
          <div
            className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </article>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-6 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800"
          >
            Close preview
          </button>
        </div>
      </div>
    </div>
  );
}
