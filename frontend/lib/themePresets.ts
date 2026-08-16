import {
  HOME_LAYOUT_REGISTRY,
  THEME_PREVIEW_ASSETS,
  THEME_REGISTRY,
  getHomeLayoutRegistration,
  getThemeRegistration,
} from "@/contracts/appearance-registry-v1.js";
import {
  normalizeHomeStyle,
  type HomeStyle,
} from "@/lib/appearanceModel";

export type ThemePreset = {
  id: string;
  name: string;
  colours: {
    primary: string;
    background: string;
    foreground: string;
    accent: string;
    card: string;
    cardForeground: string;
    muted: string;
  };
  header: {
    headerBg: string;
    headerFont: string;
    ctaBg: string;
    ctaColor: string;
    ctaText: string;
  };
  footer: {
    footerBg: string;
    footerFont: string;
    footerDescription: string;
  };
  font: string;
  tokens: {
    radius: string;
    shadow: string;
    buttonStyle: "pill" | "square";
    containerWidth: string;
    sectionSpacing: string;
    headerVariant: "light" | "dark";
    footerVariant: "solid";
  };
  /** Compatibility recommendation only; themes do not own layout selection. */
  homeStyle: HomeStyle;
  recommendedHomeStyle: HomeStyle;
};

export const THEME_PRESETS = THEME_REGISTRY as Readonly<
  Record<string, ThemePreset>
>;

export const HOME_LAYOUT_OPTIONS = Object.values(HOME_LAYOUT_REGISTRY).map(
  (layout) => ({
    id: layout.id,
    name: layout.name,
    description: layout.description,
    suitableFor: layout.suitableFor,
    previewAsset: layout.previewAsset,
    recommendedThemeIds: layout.recommendedThemeIds,
  }),
);

export const THEME_OPTIONS = Object.values(THEME_PRESETS).map((theme) => {
  const recommendedLayout = getHomeLayoutRegistration(
    theme.recommendedHomeStyle,
  );
  return {
    id: theme.id,
    name: theme.name,
    description: `A complete visual system recommended with ${recommendedLayout.name}.`,
    preview: (THEME_PREVIEW_ASSETS as any)[theme.id],
    recommendedHomeStyle: theme.recommendedHomeStyle,
  };
});

export type HomeLayoutPalette = {
  colours: ThemePreset["colours"];
  header: Pick<
    ThemePreset["header"],
    "headerBg" | "headerFont" | "ctaBg" | "ctaColor"
  >;
  footer: Pick<ThemePreset["footer"], "footerBg" | "footerFont">;
  font?: string;
};

function paletteFromTheme(theme: ThemePreset): HomeLayoutPalette {
  return {
    colours: theme.colours,
    header: {
      headerBg: theme.header.headerBg,
      headerFont: theme.header.headerFont,
      ctaBg: theme.header.ctaBg,
      ctaColor: theme.header.ctaColor,
    },
    footer: {
      footerBg: theme.footer.footerBg,
      footerFont: theme.footer.footerFont,
    },
    font: theme.font,
  };
}

export const HOME_LAYOUT_PALETTES = Object.fromEntries(
  Object.values(HOME_LAYOUT_REGISTRY).map((layout) => {
    const recommendedTheme = getThemeRegistration(
      layout.recommendedThemeIds[0] || "default",
    ) as ThemePreset;
    return [layout.id, paletteFromTheme(recommendedTheme)];
  }),
) as Record<HomeStyle, HomeLayoutPalette>;

export function getHomeLayoutPalette(
  homeStyle?: HomeStyle | string | null,
): HomeLayoutPalette {
  return HOME_LAYOUT_PALETTES[normalizeHomeStyle(homeStyle) as HomeStyle];
}

export function getThemePreset(themeId?: string | null): ThemePreset {
  return getThemeRegistration(String(themeId || "")) as ThemePreset;
}

/** Merge API branding with preset defaults without coupling theme and layout. */
export function mergeBrandingWithPreset(branding?: {
  themeId?: string;
  colours?: Record<string, unknown>;
  header?: Record<string, unknown>;
  footer?: Record<string, unknown>;
  font?: string | null;
  tokens?: Partial<ThemePreset["tokens"]>;
  homeStyle?: HomeStyle | string | null;
  home?: { homeStyle?: HomeStyle | string; layout?: HomeStyle | string } | null;
} | null) {
  const preset = getThemePreset(branding?.themeId);
  const selectedHomeStyle =
    branding?.homeStyle || branding?.home?.homeStyle || branding?.home?.layout;
  const homeStyle = normalizeHomeStyle(
    selectedHomeStyle || preset.recommendedHomeStyle,
  ) as HomeStyle;

  return {
    themeId: branding?.themeId || preset.id,
    colours: { ...preset.colours, ...(branding?.colours || {}) },
    header: { ...preset.header, ...(branding?.header || {}) },
    footer: { ...preset.footer, ...(branding?.footer || {}) },
    font: branding?.font || preset.font,
    tokens: { ...preset.tokens, ...(branding?.tokens || {}) },
    homeStyle,
    home: branding?.home || null,
  };
}
