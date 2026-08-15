import layoutDocumentV1Schema from "@/contracts/layout-document-v1.schema.json";
import {
  assertValidLayoutDocumentV1,
  validateLayoutDocumentV1,
} from "@/contracts/layout-validator-v1.js";
import { normalizeLayoutDocumentV1 } from "@/contracts/layout-normalizer-v1.js";
import { prepareRenderableLayout } from "@/contracts/renderable-layout-v1.js";

export const LAYOUT_SCHEMA_VERSION = "1.0" as const;
export const LAYOUT_KINDS = ["single-post", "blog-archive"] as const;
export const LAYOUT_BLOCK_TYPES = [
  "Heading",
  "Paragraph",
  "Image",
  "Quote",
  "Divider",
  "Button",
  "Container",
  "Columns",
  "Collection List",
  "Featured Carousel",
  "Video",
  "Newsletter",
  "Social Links",
  "Spacer",
  "Code Block",
  "Html",
  "Markdown",
] as const;

export const LAYOUT_BINDING_PATHS = [
  "post.title",
  "post.excerpt",
  "post.content",
  "post.contentHtml",
  "post.contentText",
  "post.coverImage",
  "post.featured_image",
  "post.category",
  "post.slug",
  "post.author.name",
  "post.publishedAt",
  "site.name",
  "site.slug",
  "site.logo",
] as const;

export type LayoutKind = (typeof LAYOUT_KINDS)[number];
export type LayoutBlockType = (typeof LAYOUT_BLOCK_TYPES)[number];
export type LayoutBindingPath = (typeof LAYOUT_BINDING_PATHS)[number];
export type LayoutOrigin = "manual" | "ai" | "imported" | "migrated";
export type LayoutStyleValue = string | number;

export interface LayoutBlockV1 {
  id: string;
  type: LayoutBlockType;
  content: unknown;
  parentId?: string;
  styles?: Record<string, LayoutStyleValue>;
  bindings?: { content?: LayoutBindingPath };
  level?: 1 | 2 | 3;
}

export interface LayoutDocumentV1 {
  schemaVersion: typeof LAYOUT_SCHEMA_VERSION;
  kind: LayoutKind;
  name: string;
  blocks: LayoutBlockV1[];
  metadata?: {
    description?: string;
    designStyle?: string;
    origin?: LayoutOrigin;
  };
}

export {
  assertValidLayoutDocumentV1,
  layoutDocumentV1Schema,
  normalizeLayoutDocumentV1,
  prepareRenderableLayout,
  validateLayoutDocumentV1,
};
