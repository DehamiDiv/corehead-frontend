import { api } from "@/lib/api";
import type { BuilderBlock } from "@/components/admin/builder/BuilderContext";
import { resolveMediaUrl } from "@/lib/siteMedia";
import {
  normalizeLayoutDocumentV1,
  prepareRenderableLayout,
  type LayoutDocumentV1,
} from "@/lib/layoutContract";

export type TenantLayoutKind = "blog-archive" | "single-post" | "home-page";
type RequiredTenantLayoutKind = Exclude<TenantLayoutKind, "home-page">;

export type ResolvedTenantLayout = {
  document: LayoutDocumentV1;
  blocks: BuilderBlock[];
  source: "template" | "default";
  templateId?: number;
  templateName?: string;
  templateType?: string;
  issues?: Array<{ code: string; path: string; message: string; blockId?: string }>;
};

/** Default archive layout when no published template exists for the site. */
export function defaultArchiveLayout(): BuilderBlock[] {
  return [
    {
      id: "def-heading",
      type: "Heading",
      content: "Latest Posts",
      styles: { fontSize: "2rem", marginBottom: "1rem" },
    },
    {
      id: "def-collection",
      type: "Collection List",
      content: { limit: 12, category: "" },
    },
  ];
}

/** Default single-post layout when no published template exists. */
export function defaultSinglePostLayout(): BuilderBlock[] {
  return [
    {
      id: "def-cat",
      type: "Paragraph",
      content: "",
      bindings: { content: "post.category" },
      styles: { color: "#2563eb", textTransform: "uppercase", fontSize: "0.75rem" },
    },
    {
      id: "def-title",
      type: "Heading",
      content: "",
      level: 1,
      bindings: { content: "post.title" },
      styles: { fontSize: "2.75rem", fontWeight: "800", lineHeight: "1.15" },
    },
    {
      id: "def-excerpt",
      type: "Paragraph",
      content: "",
      bindings: { content: "post.excerpt" },
      styles: { fontStyle: "italic", color: "#64748b" },
    },
    {
      id: "def-img",
      type: "Image",
      content: "",
      bindings: { content: "post.coverImage" },
      styles: { borderRadius: "1.5rem", marginBottom: "2.5rem" },
    },
    {
      id: "def-body",
      type: "Paragraph",
      content: "",
      bindings: { content: "post.contentHtml" },
    },
  ];
}

function extractBlocks(layoutJson: any): BuilderBlock[] {
  if (!layoutJson) return [];
  if (Array.isArray(layoutJson)) return layoutJson as BuilderBlock[];
  if (Array.isArray(layoutJson.blocks)) return layoutJson.blocks;
  if (Array.isArray(layoutJson.sections)) {
    // legacy schema → map roughly to paragraphs/headings
    return layoutJson.sections.map((s: any, i: number) => ({
      id: s.id || `sec-${i}`,
      type: s.type === "hero-section" ? "Heading" : "Paragraph",
      content: s.props?.title || s.props?.content || "",
      bindings: s.props?.title?.includes("{")
        ? undefined
        : undefined,
    })) as BuilderBlock[];
  }
  return [];
}

function preparePublicDocument(layoutJson: any, kind: TenantLayoutKind, name: string) {
  return prepareRenderableLayout(layoutJson, {
    name,
    kind,
    origin: layoutJson?.metadata?.origin || "migrated",
    semantic: true,
  });
}

function defaultDocument(kind: RequiredTenantLayoutKind): LayoutDocumentV1 {
  const normalized = normalizeLayoutDocumentV1(
    kind === "blog-archive" ? defaultArchiveLayout() : defaultSinglePostLayout(),
    {
      name: kind === "blog-archive" ? "Default Blog Archive" : "Default Single Post",
      kind,
      origin: "manual",
    },
  );
  return normalized.document as unknown as LayoutDocumentV1;
}

function resolvedTemplate(tpl: any, kind: TenantLayoutKind): ResolvedTenantLayout | null {
  if (!tpl?.layoutJson) return null;
  const prepared = preparePublicDocument(tpl.layoutJson, kind, tpl.name || "Layout");
  if (!prepared.valid) {
    console.warn(`Template ${tpl.id ?? "unknown"} is invalid for ${kind}; using fallback.`, prepared.issues);
    return null;
  }
  return {
    document: prepared.document,
    blocks: prepared.document.blocks as BuilderBlock[],
    source: "template",
    templateId: tpl.id,
    templateName: tpl.name,
    templateType: tpl.type,
    issues: prepared.issues as any,
  };
}

/**
 * R2-1: Resolve published layout for a tenant site.
 * Tries API resolve (site-scoped); falls back to safe defaults.
 */
export async function resolveTenantLayout(
  kind: RequiredTenantLayoutKind,
  siteId: number,
  categoryId?: string | null,
  preferredTemplateId?: number | null,
): Promise<ResolvedTenantLayout> {
  const typeParam =
    kind === "blog-archive" ? "Blog Archive" : "Single Post";

  try {
    const tpl = await api.resolveActiveLayout(
      typeParam,
      categoryId,
      siteId,
      preferredTemplateId,
    );
    const resolved = resolvedTemplate(tpl, kind);
    if (resolved) return resolved;
  } catch (err) {
    console.warn("resolveTenantLayout API miss:", err);
  }

  // Second try: alternate type names used in older UI
  const alt =
    kind === "blog-archive"
      ? ["blog-loop", "archive", "blog_archive"]
      : ["single_post", "single-post", "blog"];

  for (const t of alt) {
    try {
      const tpl = await api.resolveActiveLayout(
        t,
        categoryId,
        siteId,
        preferredTemplateId,
      );
      const resolved = resolvedTemplate(tpl, kind);
      if (resolved) return resolved;
    } catch {
      /* try next */
    }
  }

  const document = defaultDocument(kind);
  return {
    document,
    blocks: document.blocks as BuilderBlock[],
    source: "default",
  };
}

/** Resolve only an explicitly assigned published Home Page template. Preset home layouts remain the fallback. */
export async function resolveAssignedHomeLayout(
  siteId: number,
): Promise<ResolvedTenantLayout | null> {
  const typeNames = ["Home Page", "home-page", "homepage", "home_page", "home"];
  for (const typeName of typeNames) {
    try {
      const template = await api.resolveActiveLayout(typeName, null, siteId);
      if (template?.category !== "global_default") continue;
      const resolved = resolvedTemplate(template, "home-page");
      if (resolved) return resolved;
    } catch {
      // No assigned custom home layout for this alias; preserve the Appearance preset fallback.
    }
  }
  return null;
}

/** Normalize post for binding paths used by layouts. */
export function postToBindData(post: any, siteSlug?: string) {
  // Prefer absolute URL for public <img> (backend serves /uploads)
  const rawCover =
    post.coverImage ||
    post.thumbnailUrl ||
    post.featured_image ||
    post.imageUrl ||
    "";
  const cover = resolveMediaUrl(rawCover) || rawCover || "";

  // Keep raw HTML for public renderer; decode entity-encoded paste if needed
  let contentHtml = String(post.content || post.contentHtml || "");
  if (
    typeof contentHtml === "string" &&
    /&lt;\/?[a-z]/i.test(contentHtml) &&
    !/<\/?[a-z][\s\S]*>/i.test(contentHtml)
  ) {
    contentHtml = contentHtml
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&");
  }

  // Strip tags for plain paragraph binding fallback only
  const contentText =
    typeof contentHtml === "string"
      ? contentHtml.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim()
      : "";

  return {
    post: {
      ...post,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      coverImage: cover,
      featured_image: cover,
      // Prefer HTML for body; plain text available as contentText
      content: contentHtml || contentText,
      contentHtml: contentHtml || contentText,
      contentText,
      slug: post.slug,
      author: {
        ...(post.author || {}),
        name: post.author?.name || post.authorName || "Unknown author",
      },
      publishedAt:
        post.publishedAt || post.published_date || post.createdAt || null,
    },
    siteSlug,
  };
}
