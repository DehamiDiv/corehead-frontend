/**
 * Market-facing copy helpers for public tenant sites.
 * Prefer branding fields; fall back to polished generic magazine language.
 */

import type { SiteBranding } from "@/lib/siteBranding";

export function siteTagline(
  siteName: string,
  branding?: SiteBranding | null
): string {
  const fromFooter = branding?.footer?.footerDescription?.trim();
  if (fromFooter) return fromFooter;

  if (branding?.homeStyle === "nature") {
    return "Nature is essential. Stories of gardens, wildlife, eco living, and the wild outdoors — for people who care about the planet.";
  }
  if (branding?.homeStyle === "magazine") {
    return "Long reads, sharp features, and stories that stay with you.";
  }
  if (branding?.homeStyle === "dark") {
    return "Bold ideas, clear writing, and stories built for curious minds.";
  }
  return `Discover articles, guides, and stories from ${siteName}.`;
}

export function siteEyebrow(branding?: SiteBranding | null): string {
  switch (branding?.homeStyle) {
    case "nature":
      return "Nature · Lifestyle · Planet";
    case "magazine":
      return "Independent magazine";
    case "dark":
      return "Editorial";
    case "minimal":
      return "Journal";
    default:
      return "Stories & insights";
  }
}

export function formatPostDate(value?: string | Date | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function postCategory(post: {
  category?: string | null;
  categories?: Array<string | { name?: string }> | string | null;
}): string | null {
  if (typeof post.category === "string" && post.category.trim()) {
    return post.category.trim();
  }
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const first = post.categories[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && first.name) return first.name;
  }
  return null;
}

export function readingTimeMinutes(content?: string | null): number {
  if (!content) return 3;
  const text = String(content).replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.min(25, Math.round(words / 200)));
}
