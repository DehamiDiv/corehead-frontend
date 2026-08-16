/**
 * Seed default Appearance settings for a brand-new tenant site.
 * Same demo home copy + default theme as existing sites use via Appearance.
 */
import { api } from "@/lib/api";
import { getHomeDemoContent } from "@/lib/homeDemoContent";
import { getThemePreset } from "@/lib/themePresets";
import {
  DEFAULT_THEME_FOOTER_LINKS,
  DEFAULT_THEME_NAV_LINKS,
} from "@/lib/themeNav";

/**
 * Call after createSite + setCurrentSite so X-Site-Id is set.
 * Safe to re-run: skips if home_layout already has content.
 */
export async function seedNewSiteAppearance(siteName: string): Promise<void> {
  const themeId = "default";
  const homeStyle = "classic" as const;
  const preset = getThemePreset(themeId);
  const demo = getHomeDemoContent(homeStyle, siteName);

  try {
    const existing = await api.getSetting("home_layout");
    if (
      existing &&
      typeof existing === "object" &&
      (existing.tagline ||
        existing.eyebrow ||
        existing.featuredTitle ||
        (Array.isArray(existing.pillars) && existing.pillars.length > 0))
    ) {
      // Already configured — do not overwrite owner edits
      return;
    }
  } catch {
    /* continue seed */
  }

  await api.updateSetting("active_theme", { themeId });

  const colours = { ...preset.colours };
  const header = {
    headerBg: preset.header.headerBg,
    headerFont: preset.header.headerFont,
    ctaBg: preset.header.ctaBg,
    ctaColor: preset.header.ctaColor,
    ctaText: preset.header.ctaText || "Blog",
    ctaUrl: "/blog",
    navLinks: DEFAULT_THEME_NAV_LINKS,
    headerLogo: null,
  };
  const footer = {
    footerBg: preset.footer.footerBg,
    footerFont: preset.footer.footerFont,
    footerDescription: demo.tagline,
    copyrightText: `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
    quickLinks: DEFAULT_THEME_FOOTER_LINKS,
    footerLogo: null,
  };
  const font = { font: preset.font || "dm-sans" };

  // Site-level keys (public branding prefers these) + theme pack copies
  await api.updateSetting("site_colours", colours);
  await api.updateSetting(`theme_${themeId}_colours`, colours);
  await api.updateSetting("site_header", header);
  await api.updateSetting(`theme_${themeId}_header`, header);
  await api.updateSetting("site_footer", footer);
  await api.updateSetting(`theme_${themeId}_footer`, footer);
  await api.updateSetting("site_font", font);
  await api.updateSetting(`theme_${themeId}_font`, font);

  await api.updateSetting("home_layout", {
    homeStyle,
    eyebrow: demo.eyebrow,
    tagline: demo.tagline,
    heroImage: null,
    captionLeft: demo.captionLeft || null,
    captionRight: demo.captionRight || null,
    featuredEyebrow: demo.featuredEyebrow,
    featuredTitle: demo.featuredTitle,
    sideRailLabel: demo.sideRailLabel,
    pillarsEyebrow: demo.pillarsEyebrow,
    pillarsTitle: demo.pillarsTitle,
    pillarsBody: demo.pillarsBody,
    pillars: demo.pillars,
    latestEyebrow: demo.latestEyebrow,
    latestTitle: demo.latestTitle,
    ctaEyebrow: demo.ctaEyebrow,
    ctaTitle: demo.ctaTitle,
    ctaBody: demo.ctaBody,
    ctaButton: demo.ctaButton,
  });
}
