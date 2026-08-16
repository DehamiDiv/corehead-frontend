/**
 * Public tenant home copy.
 * Prefer Appearance `home_layout` (branding.home); fall back to layout demo content
 * so the same strings appear in Appearance (pre-filled) and on the public site.
 */

import type { SiteBranding } from "@/lib/siteBranding";
import {
  getHomeDemoContent,
  mergeHomeWithDemo,
  type HomeDemoContent,
} from "@/lib/homeDemoContent";

function trimOrEmpty(v?: string | null): string {
  return v != null ? String(v).trim() : "";
}

function resolvedHome(
  siteName: string,
  branding?: SiteBranding | null
): HomeDemoContent {
  const style =
    branding?.homeStyle ||
    branding?.home?.homeStyle ||
    "classic";
  return mergeHomeWithDemo(
    branding?.home as Parameters<typeof mergeHomeWithDemo>[0],
    style,
    siteName
  );
}

/** Hero tagline — Appearance home.tagline, else demo for layout */
export function siteTagline(
  siteName: string,
  branding?: SiteBranding | null
): string {
  return resolvedHome(siteName, branding).tagline;
}

/** Hero eyebrow — Appearance, else demo */
export function siteEyebrow(
  branding?: SiteBranding | null,
  siteName = "our site"
): string {
  return resolvedHome(siteName, branding).eyebrow;
}

/** Editorial captions — Appearance, else demo */
export function siteHomeCaptions(
  branding?: SiteBranding | null,
  siteName = "our site"
): { left: string; right: string } {
  const h = resolvedHome(siteName, branding);
  return { left: h.captionLeft, right: h.captionRight };
}

export type HomePillarCopy = { title: string; body: string };

export type HomeSectionCopy = {
  featuredEyebrow: string;
  featuredTitle: string;
  sideRailLabel: string;
  pillarsEyebrow: string;
  pillarsTitle: string;
  pillarsBody: string;
  pillars: HomePillarCopy[];
  latestEyebrow: string;
  latestTitle: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  /** Appearance Homepage edit — hero title */
  heroTitle?: string;
  ctaBackgroundImage?: string;
};

export function hasPillarsSection(sections: HomeSectionCopy): boolean {
  return (
    Boolean(sections.pillarsEyebrow) ||
    Boolean(sections.pillarsTitle) ||
    Boolean(sections.pillarsBody) ||
    sections.pillars.length > 0
  );
}

export function hasCtaSection(sections: HomeSectionCopy): boolean {
  return (
    Boolean(sections.ctaEyebrow) ||
    Boolean(sections.ctaTitle) ||
    Boolean(sections.ctaBody) ||
    Boolean(sections.ctaButton)
  );
}

/**
 * Home section copy: saved Appearance fields override demo defaults for the layout.
 */
export function siteHomeSections(
  siteName: string,
  branding?: SiteBranding | null
): HomeSectionCopy {
  const h = resolvedHome(siteName, branding);
  const rawHome = branding?.home as
    | { heroTitle?: string | null; ctaBackgroundImage?: string | null }
    | null
    | undefined;

  return {
    featuredEyebrow: h.featuredEyebrow,
    featuredTitle: h.featuredTitle,
    sideRailLabel: h.sideRailLabel,
    pillarsEyebrow: h.pillarsEyebrow,
    pillarsTitle: h.pillarsTitle,
    pillarsBody: h.pillarsBody,
    pillars: h.pillars,
    latestEyebrow: h.latestEyebrow,
    latestTitle: h.latestTitle,
    ctaEyebrow: h.ctaEyebrow,
    ctaTitle: h.ctaTitle,
    ctaBody: h.ctaBody,
    ctaButton: h.ctaButton,
    heroTitle: trimOrEmpty(rawHome?.heroTitle) || h.ctaTitle,
    ctaBackgroundImage: trimOrEmpty(rawHome?.ctaBackgroundImage) || undefined,
  };
}

/** Re-export for Appearance page */
export { getHomeDemoContent, mergeHomeWithDemo };

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

export function readingTimeMinutes(htmlOrText?: string | null): number {
  if (!htmlOrText) return 1;
  const text = String(htmlOrText)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
}

export function postCategory(post: {
  category?: string | null;
  categories?: unknown;
}): string | null {
  if (typeof post.category === "string" && post.category.trim()) {
    return post.category.trim();
  }
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const first = post.categories[0];
    if (typeof first === "string" && first.trim()) return first.trim();
    if (first && typeof first === "object" && "name" in first) {
      const n = String((first as { name?: string }).name || "").trim();
      return n || null;
    }
  }
  return null;
}
