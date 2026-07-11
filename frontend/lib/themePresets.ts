/**
 * R2-4 / public themes — default palettes when a theme is activated
 * or when a site has active_theme but no saved colour keys yet.
 */

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
  /** Public home layout hint */
  homeStyle: "classic" | "dark" | "magazine" | "minimal" | "nature";
};

export const THEME_PRESETS: Record<string, ThemePreset> = {
  default: {
    id: "default",
    name: "Default",
    colours: {
      primary: "#2563eb",
      background: "#f8fafc",
      foreground: "#0f172a",
      accent: "#3b82f6",
      card: "#ffffff",
      cardForeground: "#0f172a",
      muted: "#64748b",
    },
    header: {
      headerBg: "#ffffff",
      headerFont: "#0f172a",
      ctaBg: "#2563eb",
      ctaColor: "#ffffff",
      ctaText: "Latest posts",
    },
    footer: {
      footerBg: "#0f172a",
      footerFont: "#94a3b8",
      footerDescription: "Stories and updates from our team.",
    },
    font: "dm-sans",
    homeStyle: "classic",
  },
  "theme-1": {
    id: "theme-1",
    name: "Nature",
    colours: {
      primary: "#166534",
      background: "#f0fdf4",
      foreground: "#14532d",
      accent: "#22c55e",
      card: "#ffffff",
      cardForeground: "#14532d",
      muted: "#4d7c5a",
    },
    header: {
      headerBg: "#14532d",
      headerFont: "#f0fdf4",
      ctaBg: "#22c55e",
      ctaColor: "#052e16",
      ctaText: "Explore",
    },
    footer: {
      footerBg: "#052e16",
      footerFont: "#86efac",
      footerDescription: "Inspired by nature and growth.",
    },
    font: "dm-sans",
    homeStyle: "nature",
  },
  "theme-2": {
    id: "theme-2",
    name: "Mosaic",
    colours: {
      primary: "#ea580c",
      background: "#fff7ed",
      foreground: "#7c2d12",
      accent: "#f97316",
      card: "#ffffff",
      cardForeground: "#9a3412",
      muted: "#c2410c",
    },
    header: {
      headerBg: "#ffffff",
      headerFont: "#9a3412",
      ctaBg: "#ea580c",
      ctaColor: "#ffffff",
      ctaText: "Featured",
    },
    footer: {
      footerBg: "#7c2d12",
      footerFont: "#fed7aa",
      footerDescription: "Bold stories, bright ideas.",
    },
    font: "inter",
    homeStyle: "magazine",
  },
  "theme-3": {
    id: "theme-3",
    name: "Elegant Red",
    colours: {
      primary: "#dc2626",
      background: "#fafafa",
      foreground: "#171717",
      accent: "#ef4444",
      card: "#ffffff",
      cardForeground: "#171717",
      muted: "#737373",
    },
    header: {
      headerBg: "#ffffff",
      headerFont: "#171717",
      ctaBg: "#dc2626",
      ctaColor: "#ffffff",
      ctaText: "Read more",
    },
    footer: {
      footerBg: "#171717",
      footerFont: "#a3a3a3",
      footerDescription: "Elegant editorial for modern readers.",
    },
    font: "georgia",
    homeStyle: "minimal",
  },
  "theme-4": {
    id: "theme-4",
    name: "Soft Blush",
    colours: {
      primary: "#db2777",
      background: "#fdf2f8",
      foreground: "#831843",
      accent: "#f472b6",
      card: "#ffffff",
      cardForeground: "#9d174d",
      muted: "#9d174d",
    },
    header: {
      headerBg: "#ffffff",
      headerFont: "#9d174d",
      ctaBg: "#db2777",
      ctaColor: "#ffffff",
      ctaText: "Discover",
    },
    footer: {
      footerBg: "#831843",
      footerFont: "#fbcfe8",
      footerDescription: "Soft tones for lifestyle & culture.",
    },
    font: "dm-sans",
    homeStyle: "classic",
  },
  "theme-5": {
    id: "theme-5",
    name: "Travel Teal",
    colours: {
      primary: "#0f766e",
      background: "#f0fdfa",
      foreground: "#134e4a",
      accent: "#14b8a6",
      card: "#ffffff",
      cardForeground: "#115e59",
      muted: "#0f766e",
    },
    header: {
      headerBg: "#134e4a",
      headerFont: "#ccfbf1",
      ctaBg: "#14b8a6",
      ctaColor: "#042f2e",
      ctaText: "Stories",
    },
    footer: {
      footerBg: "#042f2e",
      footerFont: "#5eead4",
      footerDescription: "Wanderlust and written journeys.",
    },
    font: "ibm-plex",
    homeStyle: "magazine",
  },
  "theme-6": {
    id: "theme-6",
    name: "Fitness Dark",
    colours: {
      primary: "#22c55e",
      background: "#0a0a0a",
      foreground: "#fafafa",
      accent: "#4ade80",
      card: "#171717",
      cardForeground: "#fafafa",
      muted: "#a3a3a3",
    },
    header: {
      headerBg: "#000000",
      headerFont: "#fafafa",
      ctaBg: "#22c55e",
      ctaColor: "#052e16",
      ctaText: "Train hard",
    },
    footer: {
      footerBg: "#000000",
      footerFont: "#737373",
      footerDescription: "Strength, discipline, results.",
    },
    font: "inter",
    homeStyle: "dark",
  },
  "theme-7": {
    id: "theme-7",
    name: "Portfolio Blue",
    colours: {
      primary: "#1d4ed8",
      background: "#eff6ff",
      foreground: "#1e3a8a",
      accent: "#3b82f6",
      card: "#ffffff",
      cardForeground: "#1e3a8a",
      muted: "#3b82f6",
    },
    header: {
      headerBg: "#ffffff",
      headerFont: "#1e3a8a",
      ctaBg: "#1d4ed8",
      ctaColor: "#ffffff",
      ctaText: "About me",
    },
    footer: {
      footerBg: "#1e3a8a",
      footerFont: "#bfdbfe",
      footerDescription: "Professional portfolio & insights.",
    },
    font: "ibm-plex",
    homeStyle: "minimal",
  },
  "theme-8": {
    id: "theme-8",
    name: "Corporate",
    colours: {
      primary: "#b91c1c",
      background: "#f8fafc",
      foreground: "#0f172a",
      accent: "#dc2626",
      card: "#ffffff",
      cardForeground: "#0f172a",
      muted: "#64748b",
    },
    header: {
      headerBg: "#0f172a",
      headerFont: "#f8fafc",
      ctaBg: "#b91c1c",
      ctaColor: "#ffffff",
      ctaText: "Contact",
    },
    footer: {
      footerBg: "#020617",
      footerFont: "#94a3b8",
      footerDescription: "Consulting insights that scale.",
    },
    font: "inter",
    homeStyle: "classic",
  },
  "theme-9": {
    id: "theme-9",
    name: "Editorial Teal",
    colours: {
      primary: "#0d9488",
      background: "#ffffff",
      foreground: "#134e4a",
      accent: "#2dd4bf",
      card: "#f0fdfa",
      cardForeground: "#115e59",
      muted: "#5eead4",
    },
    header: {
      headerBg: "#ffffff",
      headerFont: "#134e4a",
      ctaBg: "#0d9488",
      ctaColor: "#ffffff",
      ctaText: "Categories",
    },
    footer: {
      footerBg: "#134e4a",
      footerFont: "#99f6e4",
      footerDescription: "Clean editorial for curious minds.",
    },
    font: "georgia",
    homeStyle: "minimal",
  },
  "theme-10": {
    id: "theme-10",
    name: "Magazine Blue",
    colours: {
      primary: "#0369a1",
      background: "#f0f9ff",
      foreground: "#0c4a6e",
      accent: "#0ea5e9",
      card: "#ffffff",
      cardForeground: "#075985",
      muted: "#0284c7",
    },
    header: {
      headerBg: "#0c4a6e",
      headerFont: "#e0f2fe",
      ctaBg: "#0ea5e9",
      ctaColor: "#082f49",
      ctaText: "Magazine",
    },
    footer: {
      footerBg: "#082f49",
      footerFont: "#7dd3fc",
      footerDescription: "News, culture, and long reads.",
    },
    font: "dm-sans",
    homeStyle: "magazine",
  },
  "theme-11": {
    id: "theme-11",
    name: "Modern Dark",
    colours: {
      primary: "#ef4444",
      background: "#09090b",
      foreground: "#fafafa",
      accent: "#f87171",
      card: "#18181b",
      cardForeground: "#fafafa",
      muted: "#a1a1aa",
    },
    header: {
      headerBg: "#09090b",
      headerFont: "#fafafa",
      ctaBg: "#ef4444",
      ctaColor: "#ffffff",
      ctaText: "Get started",
    },
    footer: {
      footerBg: "#000000",
      footerFont: "#71717a",
      footerDescription: "Modern dark experience.",
    },
    font: "inter",
    homeStyle: "dark",
  },
};

export function getThemePreset(themeId?: string | null): ThemePreset {
  if (!themeId) return THEME_PRESETS.default;
  return THEME_PRESETS[themeId] || THEME_PRESETS.default;
}

/** Merge API branding with theme preset so public always has a full palette. */
export function mergeBrandingWithPreset(branding?: {
  themeId?: string;
  colours?: Record<string, any>;
  header?: Record<string, any>;
  footer?: Record<string, any>;
  font?: string | null;
} | null) {
  const preset = getThemePreset(branding?.themeId);
  const colours = { ...preset.colours, ...(branding?.colours || {}) };
  const header = { ...preset.header, ...(branding?.header || {}) };
  const footer = { ...preset.footer, ...(branding?.footer || {}) };
  return {
    themeId: branding?.themeId || preset.id,
    colours,
    header,
    footer,
    font: branding?.font || preset.font,
    homeStyle: preset.homeStyle,
  };
}
