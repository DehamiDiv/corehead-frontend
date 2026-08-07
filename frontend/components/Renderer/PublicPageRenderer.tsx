"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BuilderBlock, BlockType } from "../admin/builder/BuilderContext";
import { looksLikeHtml, preparePostHtml } from "@/lib/htmlContent";
import { resolveMediaUrl } from "@/lib/siteMedia";
import { api } from "@/lib/api";

/**
 * R2-3: Public Page Renderer — all builder BlockTypes supported.
 * Renders layout JSON from DB with CMS bindings.
 */

interface PublicPageRendererProps {
  layout: BuilderBlock[] | { blocks: BuilderBlock[] };
  data?: Record<string, any>;
  isLoop?: boolean;
  bindings?: Record<string, any>;
  /** e.g. /s/acme-foods — collection / featured post links */
  siteBasePath?: string;
}

function resolvePath(data: any, path: string) {
  const parts = path.replace(/^\{|\}$/g, "").split(".");
  let resolvedData = data;
  for (const key of parts) {
    if (resolvedData && resolvedData[key] !== undefined) {
      resolvedData = resolvedData[key];
    } else {
      return null;
    }
  }
  return resolvedData;
}

function bindData(
  content: any,
  bindings: Record<string, string> | undefined,
  data: any,
) {
  if (bindings?.content) {
    const path = bindings.content;
    let resolved = resolvePath(data, path);
    if (
      (resolved === null || resolved === undefined || resolved === "") &&
      !path.includes(".")
    ) {
      resolved = resolvePath(data, `post.${path}`);
    }
    if (
      (resolved === null || resolved === undefined || resolved === "") &&
      (path === "featured_image" || path.endsWith(".featured_image"))
    ) {
      resolved =
        resolvePath(data, "post.coverImage") ||
        resolvePath(data, "post.featured_image") ||
        resolvePath(data, "post.thumbnailUrl");
    }
    if (resolved !== null && resolved !== undefined && resolved !== "") {
      return resolved;
    }
  }

  if (typeof content === "string" && content.includes("{")) {
    return content.replace(/\{([a-zA-Z0-9_.]+)\}/g, (_, path) => {
      const v = resolvePath(data, path);
      return v != null ? String(v) : "";
    });
  }

  return content;
}

function normalizeBlockType(type: string): string {
  const t = String(type || "").trim();
  const map: Record<string, BlockType | string> = {
    heading: "Heading",
    paragraph: "Paragraph",
    image: "Image",
    quote: "Quote",
    divider: "Divider",
    button: "Button",
    container: "Container",
    columns: "Columns",
    "collection list": "Collection List",
    collection: "Collection List",
    "featured carousel": "Featured Carousel",
    carousel: "Featured Carousel",
    video: "Video",
    newsletter: "Newsletter",
    "social links": "Social Links",
    social: "Social Links",
    spacer: "Spacer",
    "code block": "Code Block",
    code: "Code Block",
    html: "Html",
    markdown: "Markdown",
    "rich-text": "Paragraph",
    "hero-section": "Heading",
  };
  const key = t.toLowerCase();
  return map[key] || t;
}

function mediaUrl(src: any): string {
  if (!src || typeof src !== "string") {
    return "https://placehold.co/800x400?text=No+image";
  }
  // Always resolve /uploads/... to backend origin (Next rewrite alone is easy to break)
  const resolved = resolveMediaUrl(src.trim());
  return resolved || "https://placehold.co/800x400?text=No+image";
}

function postHref(siteBasePath: string | undefined, data: any, post: any) {
  const postBase =
    siteBasePath ||
    (data?.siteSlug ? `/s/${data.siteSlug}` : "") ||
    "";
  if (postBase) {
    return `${postBase}/blog/${post.slug || post.id}`.replace(
      /\/blog\/blog\//,
      "/blog/",
    );
  }
  return `/blog/${post.slug || post.id}`;
}

function colClass(cols: number) {
  if (cols <= 1) return "md:grid-cols-1";
  if (cols === 2) return "md:grid-cols-2";
  if (cols === 3) return "md:grid-cols-3";
  return "md:grid-cols-4";
}

/**
 * Working Newsletter signup form used by the public site renderer.
 * Used on tenant sites (e.g. Verdura) when a Newsletter block is placed via builder.
 */
function NewsletterForm({
  content,
  styleString,
  siteSlug,
  siteId,
  siteName: propSiteName,
}: {
  content: any;
  styleString?: React.CSSProperties;
  siteSlug?: string;
  siteId?: number | string;
  siteName?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const title =
    (typeof content === "object" && content?.title) ||
    "Subscribe to our newsletter";
  const buttonText =
    (typeof content === "object" && content?.buttonText) || "Subscribe";
  const placeholder =
    (typeof content === "object" && content?.placeholder) || "Enter your email";
  const description =
    (typeof content === "object" && content?.description) ||
    "Stay updated with our latest news and articles delivered straight to your inbox.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setStatus("error");
      setMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMsg("");

    try {
      const siteName = propSiteName;
      await api.subscribeToNewsletter(trimmed, siteSlug, siteId, siteName);

      setStatus("success");
      setMsg("Thank you! Check your inbox to confirm your subscription.");
      setEmail("");
    } catch (err) {
      // Should rarely hit because api method is resilient
      setStatus("error");
      setMsg("Could not subscribe right now. Please try again in a moment.");
    }
  };

  if (status === "success") {
    return (
      <div
        style={styleString}
        className="my-8 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white"
      >
        <div className="max-w-md mx-auto">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-3xl">
            ✓
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3">You're in!</h3>
          <p className="text-slate-300">{msg}</p>
          <button
            onClick={() => {
              setStatus("idle");
              setMsg("");
            }}
            className="mt-6 text-sm underline opacity-70 hover:opacity-100"
          >
            Subscribe another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={styleString}
      className="my-8 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white"
    >
      <h3 className="text-2xl md:text-3xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">{description}</p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          disabled={status === "loading"}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none text-white placeholder:text-white/50 focus:border-[var(--site-cta-bg,var(--site-primary,#2563eb))] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="font-bold px-8 py-3 rounded-xl transition-all hover:opacity-90 active:scale-[0.985] disabled:opacity-60"
          style={{
            background: "var(--site-cta-bg, var(--site-primary, #2563eb))",
            color: "var(--site-cta-color, #ffffff)",
          }}
        >
          {status === "loading" ? "Subscribing..." : buttonText}
        </button>
      </form>

      {status === "error" && msg && (
        <p className="mt-3 text-sm text-red-400">{msg}</p>
      )}
    </div>
  );
}

export function PublicPageRenderer({
  layout,
  data = {},
  isLoop,
  bindings,
  siteBasePath,
}: PublicPageRendererProps) {
  const blocksArray = Array.isArray(layout)
    ? layout
    : (layout as any)?.blocks || [];

  const renderBlock = (block: BuilderBlock) => {
    const styleString = block.styles || {};
    const type = normalizeBlockType(block.type);
    const content = bindData(block.content, block.bindings, data);

    switch (type) {
      case "Heading": {
        const level = Number((block as any).level || content?.level || 2);
        const text =
          typeof content === "object" && content?.text != null
            ? content.text
            : content;
        const className = "font-bold mb-4 text-slate-900";
        if (level === 1)
          return (
            <h1 key={block.id} style={styleString} className={className + " text-4xl"}>
              {text}
            </h1>
          );
        if (level === 3)
          return (
            <h3 key={block.id} style={styleString} className={className + " text-xl"}>
              {text}
            </h3>
          );
        return (
          <h2 key={block.id} style={styleString} className={className + " text-2xl"}>
            {text}
          </h2>
        );
      }

      case "Paragraph": {
        const binding = block.bindings?.content || "";
        const isBodyBinding =
          binding.includes("contentHtml") ||
          binding === "post.content" ||
          binding === "content" ||
          binding === "contentHtml";

        // Prefer full HTML body for post content bindings
        let rawHtml = "";
        if (isBodyBinding) {
          rawHtml =
            data?.post?.contentHtml ||
            data?.post?.content ||
            String(content || "");
        } else if (looksLikeHtml(content)) {
          rawHtml = String(content || "");
        }

        if (rawHtml && (isBodyBinding || looksLikeHtml(rawHtml))) {
          return (
            <div
              key={block.id}
              style={styleString}
              className="mb-4 text-gray-700 leading-relaxed prose prose-slate max-w-none prose-headings:font-bold"
              dangerouslySetInnerHTML={{
                __html: preparePostHtml(rawHtml),
              }}
            />
          );
        }

        return (
          <p
            key={block.id}
            style={styleString}
            className="mb-4 text-gray-700 leading-relaxed"
          >
            {typeof content === "object" ? content?.text || "" : content}
          </p>
        );
      }

      case "Image": {
        const src = mediaUrl(
          typeof content === "string"
            ? content
            : content?.src || content?.url || "",
        );
        const alt =
          (typeof content === "object" && content?.alt) ||
          data?.post?.title ||
          "Image";
        return (
          <div
            key={block.id}
            style={styleString}
            className="relative w-full aspect-video my-4 rounded-lg overflow-hidden bg-slate-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        );
      }

      case "Quote":
        return (
          <blockquote
            key={block.id}
            style={styleString}
            className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50 rounded-r-lg"
          >
            {typeof content === "object" ? content?.text || "" : content}
          </blockquote>
        );

      case "Divider":
        return (
          <hr
            key={block.id}
            style={styleString}
            className="my-6 border-gray-200"
          />
        );

      case "Button": {
        const url =
          (typeof content === "object" && (content?.url || content?.href)) ||
          (typeof content === "string" ? content : "#") ||
          "#";
        const text =
          (typeof content === "object" && (content?.text || content?.label)) ||
          "Click Here";
        const isInternal = typeof url === "string" && url.startsWith("/");
        return (
          <div key={block.id} style={styleString} className="my-4">
            {isInternal ? (
              <Link
                href={url}
                className="inline-flex px-6 py-2 rounded-md font-medium transition-opacity hover:opacity-90"
                style={{
                  background:
                    "var(--site-cta-bg, var(--site-primary, #2563eb))",
                  color: "var(--site-cta-color, #ffffff)",
                }}
              >
                {text}
              </Link>
            ) : (
              <a
                href={url}
                className="inline-flex px-6 py-2 rounded-md font-medium transition-opacity hover:opacity-90"
                style={{
                  background:
                    "var(--site-cta-bg, var(--site-primary, #2563eb))",
                  color: "var(--site-cta-color, #ffffff)",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {text}
              </a>
            )}
          </div>
        );
      }

      case "Container":
        return (
          <div
            key={block.id}
            style={styleString}
            className="my-2 w-full"
          >
            {renderChildren(block.id)}
          </div>
        );

      case "Columns": {
        const cols = Math.min(
          4,
          Math.max(1, Number(content?.columns || content || 2) || 2),
        );
        return (
          <div
            key={block.id}
            style={styleString}
            className={`grid grid-cols-1 ${colClass(cols)} gap-6 my-6`}
          >
            {renderChildren(block.id)}
          </div>
        );
      }

      case "Collection List": {
        const limit = content?.limit || 6;
        const posts = Array.isArray(data?.posts)
          ? data.posts.slice(0, limit)
          : [];

        return (
          <div
            key={block.id}
            style={styleString}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8"
          >
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <Link
                  href={postHref(siteBasePath, data, post)}
                  key={post.id}
                  className="group block border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition bg-white flex flex-col h-full"
                >
                  <div className="relative w-full h-48 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mediaUrl(
                        post.thumbnailUrl ||
                          post.imageUrl ||
                          post.coverImage ||
                          post.featured_image,
                      )}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={post.title || "Post"}
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <span
                      className="text-xs font-semibold mb-2 uppercase tracking-wider"
                      style={{ color: "var(--site-primary, #166534)" }}
                    >
                      {post.category ||
                        (Array.isArray(post.categories)
                          ? post.categories[0]
                          : post.categories) ||
                        "Article"}
                    </span>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-auto">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center p-8 border border-dashed border-gray-300 rounded-lg text-gray-500">
                No blog posts available in this collection loop.
              </div>
            )}
          </div>
        );
      }

      case "Featured Carousel": {
        const carouselPosts = Array.isArray(data?.posts) ? data.posts : [];
        const featuredPost = carouselPosts[0];
        const href = featuredPost
          ? postHref(siteBasePath, data, featuredPost)
          : "#";
        return (
          <div
            key={block.id}
            style={styleString}
            className="my-8 relative rounded-3xl overflow-hidden bg-slate-900 aspect-[21/9]"
          >
            {featuredPost ? (
              <Link href={href} className="absolute inset-0 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(
                    featuredPost.imageUrl ||
                      featuredPost.thumbnailUrl ||
                      featuredPost.coverImage ||
                      featuredPost.featured_image,
                  )}
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                  alt={featuredPost.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 md:p-12">
                  <span
                    className="font-bold uppercase tracking-widest text-sm mb-4"
                    style={{ color: "var(--site-primary, #2563eb)" }}
                  >
                    Featured Article
                  </span>
                  <h2 className="text-white text-2xl md:text-4xl font-extrabold max-w-2xl mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-white/70 max-w-xl line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No featured articles available.
              </div>
            )}
          </div>
        );
      }

      case "Video": {
        let videoSrc = "";
        if (typeof content === "string") {
          videoSrc = content.replace("watch?v=", "embed/");
        } else if (content?.url) {
          videoSrc = String(content.url).replace("watch?v=", "embed/");
        }
        return (
          <div
            key={block.id}
            style={styleString}
            className="my-8 aspect-video rounded-2xl overflow-hidden bg-slate-100"
          >
            {videoSrc ? (
              <iframe
                className="w-full h-full border-0"
                src={videoSrc}
                title="Video"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                No video URL
              </div>
            )}
          </div>
        );
      }

      case "Newsletter": {
        const siteSlugFromData = data?.siteSlug || data?.site?.slug;
        const siteIdFromData = data?.site?.id || data?.siteId;
        const siteNameFromData = data?.site?.name || data?.siteName;
        return (
          <NewsletterForm
            key={block.id}
            content={content}
            styleString={styleString}
            siteSlug={siteSlugFromData}
            siteId={siteIdFromData}
            siteName={siteNameFromData}
          />
        );
      }

      case "Spacer": {
        const h =
          typeof content === "number" || typeof content === "string"
            ? content
            : content?.height || "40px";
        return (
          <div
            key={block.id}
            style={{ height: typeof h === "number" ? `${h}px` : h }}
            aria-hidden
          />
        );
      }

      case "Code Block":
        return (
          <div
            key={block.id}
            className="my-6 bg-slate-900 rounded-xl p-6 overflow-x-auto border border-slate-800"
            style={styleString}
          >
            <pre className="text-blue-300 font-mono text-sm">
              <code>
                {(typeof content === "object" && content?.code) ||
                  (typeof content === "string" ? content : "")}
              </code>
            </pre>
          </div>
        );

      case "Social Links": {
        const links =
          (typeof content === "object" && Array.isArray(content?.links)
            ? content.links
            : null) ||
          ["Facebook", "Twitter", "Instagram"].map((name) => ({
            name,
            url: "#",
          }));
        return (
          <div
            key={block.id}
            className="my-8 flex flex-wrap justify-center gap-6"
            style={styleString}
          >
            {links.map((s: any, i: number) => (
              <a
                key={s.name || i}
                href={s.url || s.href || "#"}
                className="text-slate-400 hover:text-blue-500 font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.name || s.label || "Link"}
              </a>
            ))}
          </div>
        );
      }

      case "Html":
      case "HTML":
        return (
          <div
            key={block.id}
            style={styleString}
            className="my-4 prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{
              __html: String(
                typeof content === "string"
                  ? content
                  : content?.html || content?.code || "",
              ),
            }}
          />
        );

      case "Markdown":
        return (
          <div
            key={block.id}
            style={styleString}
            className="my-4 prose prose-slate max-w-none"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {String(
                typeof content === "string"
                  ? content
                  : content?.markdown || content?.text || "",
              )}
            </ReactMarkdown>
          </div>
        );

      default:
        // Unknown block: show nothing in production UI, avoid crash
        if (process.env.NODE_ENV === "development") {
          return (
            <div
              key={block.id}
              className="my-2 p-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded"
            >
              Unsupported block type: {String(block.type)}
            </div>
          );
        }
        return null;
    }
  };

  const renderChildren = (parentId?: string) => {
    const levelBlocks = blocksArray.filter((b: any) =>
      parentId
        ? b.parentId === parentId
        : !b.parentId,
    );
    // Root: also include blocks whose parent is missing from tree (flat layouts)
    if (!parentId) {
      const ids = new Set(blocksArray.map((b: any) => b.id));
      const roots = blocksArray.filter(
        (b: any) => !b.parentId || !ids.has(b.parentId),
      );
      // Prefer explicit roots without parentId; if all have parentId, use filtered
      const list =
        blocksArray.some((b: any) => !b.parentId) ? levelBlocks : roots;
      return list.map((block: any) => renderBlock(block));
    }
    return levelBlocks.map((block: any) => renderBlock(block));
  };

  return (
    <div className="public-renderer-wrapper w-full">{renderChildren()}</div>
  );
}
