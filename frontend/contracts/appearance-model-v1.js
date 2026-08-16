export const HOME_LAYOUT_IDS = ["classic", "nature", "paper", "glass", "bloom", "studio", "bento", "portals"];
export const LEGACY_HOME_LAYOUT_ALIASES = {};
export const APPEARANCE_SETTING_OWNERSHIP = {};

export function normalizeHomeStyle(style) {
  if (!style || typeof style !== "string") return "classic";
  const s = style.toLowerCase().trim();
  return HOME_LAYOUT_IDS.includes(s) ? s : "classic";
}

export function extractHomeStyle(branding) {
  return normalizeHomeStyle(branding?.homeStyle || branding?.home?.homeStyle || branding?.home?.layout);
}

export function preserveHomeLayoutForThemeChange(branding, themeId) {
  return { ...branding, themeId };
}

export function selectHomeLayout(branding, homeStyle) {
  return { ...branding, homeStyle: normalizeHomeStyle(homeStyle) };
}

export function selectTheme(branding, themeId) {
  return { ...branding, themeId };
}

export default {
  HOME_LAYOUT_IDS,
  LEGACY_HOME_LAYOUT_ALIASES,
  APPEARANCE_SETTING_OWNERSHIP,
  normalizeHomeStyle,
  extractHomeStyle,
  preserveHomeLayoutForThemeChange,
  selectHomeLayout,
  selectTheme,
};
