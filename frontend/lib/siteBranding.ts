/**
 * R2-4 — Map Appearance settings (from site.branding API) to CSS variables + chrome.
 */

import {
  mergeBrandingWithPreset,
  type ThemePreset,
} from "@/lib/themePresets";

export type SiteBranding = {
  themeId?: string;
  colours?: {
    primary?: string;
    background?: string;
    foreground?: string;
    accent?: string;
    card?: string;
    cardForeground?: string;
    muted?: string;
  };
  header?: {
    headerBg?: string | null;
    headerFont?: string | null;
    headerLogo?: string | null;
    navLinks?: Array<{ id?: number; name: string; link: string }> | null;
    ctaText?: string | null;
    ctaUrl?: string | null;
    ctaBg?: string | null;
    ctaColor?: string | null;
  };
  footer?: {
    footerBg?: string | null;
    footerFont?: string | null;
    footerLogo?: string | null;
    footerDescription?: string | null;
    quickLinks?: Array<{ id?: number; name: string; link: string }> | null;
    copyrightText?: string | null;
  };
  font?: string | null;
  /** Public home layout (from Appearance → home_layout or theme preset) */
  homeStyle?: ThemePreset["homeStyle"];
  /**
   * Editable home content (Appearance → Home page layout).
   * Overrides default copy / hero image when set.
   */
  home?: {
    homeStyle?: ThemePreset["homeStyle"];
    /** Hero */
    eyebrow?: string | null;
    tagline?: string | null;
    heroImage?: string | null;
    captionLeft?: string | null;
    captionRight?: string | null;
    /** Featured + side rail */
    featuredEyebrow?: string | null;
    featuredTitle?: string | null;
    sideRailLabel?: string | null;
    /** Value pillars / services */
    pillarsEyebrow?: string | null;
    pillarsTitle?: string | null;
    pillarsBody?: string | null;
    pillars?: Array<{ title?: string | null; body?: string | null }> | null;
    /** Latest / journal grid */
    latestEyebrow?: string | null;
    latestTitle?: string | null;
    /** Bottom CTA */
    ctaEyebrow?: string | null;
    ctaTitle?: string | null;
    ctaBody?: string | null;
    ctaButton?: string | null;
  } | null;
};

const FONT_MAP: Record<string, string> = {
  "dm-sans": '"DM Sans", system-ui, sans-serif',
  "ibm-plex": '"IBM Plex Sans", system-ui, sans-serif',
  inter: "Inter, system-ui, sans-serif",
  georgia: "Georgia, serif",
};

function softColor(hex: string, alpha = 0.12): string {
  // Best-effort: if already rgb/oklch leave; for #hex build soft bg
  if (!hex || !hex.startsWith("#") || (hex.length !== 7 && hex.length !== 4)) {
    return "#eff6ff";
  }
  let r: number, g: number, b: number;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Resolve branding with theme preset fill-ins for public CSS. */
export function resolvePublicBranding(
  branding?: SiteBranding | null
): SiteBranding & { homeStyle: ThemePreset["homeStyle"] } {
  return mergeBrandingWithPreset(branding) as SiteBranding & {
    homeStyle: ThemePreset["homeStyle"];
  };
}

export function brandingToCssVars(branding?: SiteBranding | null): Record<string, string> {
  const full = resolvePublicBranding(branding);
  const c = full.colours || {};
  const primary = c.primary || "#2563eb";
  const bg = c.background || "#f8fafc";
  const fg = c.foreground || "#0f172a";
  const card = c.card || "#ffffff";
  const muted = c.muted || "#64748b";
  const fontKey = full.font || "dm-sans";
  const fontFamily = FONT_MAP[fontKey] || FONT_MAP["dm-sans"];

  const ctaBg = full.header?.ctaBg || c.accent || primary;
  const ctaColor = full.header?.ctaColor || "#ffffff";

  return {
    "--site-primary": primary,
    "--site-primary-soft": softColor(primary, 0.12),
    "--site-bg": bg,
    "--site-surface": card,
    "--site-ink": fg,
    "--site-muted": muted,
    "--site-header-bg": full.header?.headerBg || card,
    "--site-header-fg": full.header?.headerFont || fg,
    "--site-footer-bg": full.footer?.footerBg || card,
    "--site-footer-fg": full.footer?.footerFont || muted,
    "--site-font": fontFamily,
    "--site-accent": c.accent || primary,
    "--site-card-fg": c.cardForeground || fg,
    /** Header / newsletter CTA button colours (Appearance → Header → CTA) */
    "--site-cta-bg": ctaBg,
    "--site-cta-color": ctaColor,
  };
}

/** Google Fonts URL for public shell (null if system font only). */
export function brandingFontStylesheetUrl(
  branding?: SiteBranding | null
): string | null {
  const full = resolvePublicBranding(branding);
  const key = full.font || "dm-sans";
  if (key === "georgia") return null;
  if (key === "ibm-plex") {
    return "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap";
  }
  if (key === "inter") {
    return "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
  }
  return "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap";
}

export function resolveHeaderLogo(
  siteLogo?: string | null,
  branding?: SiteBranding | null
): string | null {
  return branding?.header?.headerLogo || siteLogo || null;
}

export function resolveFooterLogo(
  siteLogo?: string | null,
  branding?: SiteBranding | null
): string | null {
  return branding?.footer?.footerLogo || siteLogo || null;
}
