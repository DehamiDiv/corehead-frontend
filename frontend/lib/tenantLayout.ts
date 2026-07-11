import { api } from "@/lib/api";
import type { BuilderBlock } from "@/components/admin/builder/BuilderContext";
import { resolveMediaUrl } from "@/lib/siteMedia";

export type TenantLayoutKind = "blog-archive" | "single-post";

export type ResolvedTenantLayout = {
  blocks: BuilderBlock[];
  source: "template" | "default";
  templateId?: number;
  templateName?: string;
  templateType?: string;
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
      id: "def-img",
      type: "Image",
      content: "",
      bindings: { content: "post.coverImage" },
    },
    {
      id: "def-title",
      type: "Heading",
      content: "",
      bindings: { content: "post.title" },
      styles: { fontSize: "2.5rem", fontWeight: "800" },
    },
    {
      id: "def-cat",
      type: "Paragraph",
      content: "",
      bindings: { content: "post.category" },
      styles: { color: "#2563eb", textTransform: "uppercase", fontSize: "0.75rem" },
    },
    {
      id: "def-excerpt",
      type: "Paragraph",
      content: "",
      bindings: { content: "post.excerpt" },
      styles: { fontStyle: "italic", color: "#64748b" },
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

/**
 * R2-1: Resolve published layout for a tenant site.
 * Tries API resolve (site-scoped); falls back to safe defaults.
 */
export async function resolveTenantLayout(
  kind: TenantLayoutKind,
  siteId: number,
  categoryId?: string | null
): Promise<ResolvedTenantLayout> {
  const typeParam =
    kind === "blog-archive" ? "Blog Archive" : "Single Post";

  try {
    const tpl = await api.resolveActiveLayout(typeParam, categoryId, siteId);
    if (tpl) {
      const blocks = extractBlocks(tpl.layoutJson);
      if (blocks.length > 0) {
        return {
          blocks,
          source: "template",
          templateId: tpl.id,
          templateName: tpl.name,
          templateType: tpl.type,
        };
      }
    }
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
      const tpl = await api.resolveActiveLayout(t, categoryId, siteId);
      if (tpl) {
        const blocks = extractBlocks(tpl.layoutJson);
        if (blocks.length > 0) {
          return {
            blocks,
            source: "template",
            templateId: tpl.id,
            templateName: tpl.name,
            templateType: tpl.type,
          };
        }
      }
    } catch {
      /* try next */
    }
  }

  return {
    blocks:
      kind === "blog-archive"
        ? defaultArchiveLayout()
        : defaultSinglePostLayout(),
    source: "default",
  };
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
    },
    siteSlug,
  };
}
