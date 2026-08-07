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
  /**
   * Public home layout — each option is a unique structure:
   * classic | nature | bloom | portals | bento | studio | paper | glass
   * (legacy: dark→studio, magazine→paper, minimal→glass, agents→portals)
   */
  homeStyle:
    | "classic"
    | "nature"
    | "bloom"
    | "portals"
    | "bento"
    | "studio"
    | "paper"
    | "glass"
    /** @deprecated legacy aliases — normalized in mergeBrandingWithPreset */
    | "dark"
    | "magazine"
    | "minimal"
    | "agents";
};

/** Options shown in Appearance → Homepage */
export const HOME_LAYOUT_OPTIONS: Array<{
  id: ThemePreset["homeStyle"];
  name: string;
  description: string;
}> = [
  {
    id: "classic",
    name: "Classic",
    description: "Gradient hero, featured + side rail, pillars, latest grid, bottom CTA.",
  },
  {
    id: "nature",
    name: "Layout 1",
    description: "Magazine cover board — oversized masthead + framed art plate.",
  },
  {
    id: "bloom",
    name: "Layout 2",
    description: "Soft clinic home — calm hero, service cards, gentle journal.",
  },
  {
    id: "portals",
    name: "Layout 3",
    description: "Black product landing — purple neon platforms, dual CTAs.",
  },
  {
    id: "bento",
    name: "Layout 4",
    description: "Asymmetric bento tile grid — modern SaaS / product mosaic.",
  },
  {
    id: "studio",
    name: "Layout 5",
    description: "Full-bleed photo portfolio — gallery hover, serif masthead.",
  },
  {
    id: "paper",
    name: "Layout 6",
    description: "Newspaper broadsheet — masthead, lead story, two columns.",
  },
  {
    id: "glass",
    name: "Layout 7",
    description: "Light glassmorphism — frosted cards, soft mesh, centered hero.",
  },
];

/**
 * Preview swatches for Homepage layout cards only.
 * Layout apply does NOT write these to the site — colours stay in Appearance → Colours.
 */
export type HomeLayoutPalette = {
  colours: ThemePreset["colours"];
  header: Pick<
    ThemePreset["header"],
    "headerBg" | "headerFont" | "ctaBg" | "ctaColor"
  >;
  footer: Pick<ThemePreset["footer"], "footerBg" | "footerFont">;
  font?: string;
};

export const HOME_LAYOUT_PALETTES: Record<
  ThemePreset["homeStyle"],
  HomeLayoutPalette
> = {
  classic: {
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
    },
    footer: { footerBg: "#0f172a", footerFont: "#94a3b8" },
    font: "dm-sans",
  },
  nature: {
    colours: {
      primary: "#1a3d2e",
      background: "#f4f1ea",
      foreground: "#1a3d2e",
      accent: "#c5a572",
      card: "#ffffff",
      cardForeground: "#1a3d2e",
      muted: "#5c6b5f",
    },
    header: {
      headerBg: "#1a3d2e",
      headerFont: "#f5f0e6",
      ctaBg: "#f5f0e6",
      ctaColor: "#1a3d2e",
    },
    footer: { footerBg: "#0f2e22", footerFont: "#c5d5c0" },
    font: "georgia",
  },
  bloom: {
    colours: {
      primary: "#7B6B9A",
      background: "#F8F6FA",
      foreground: "#2C2835",
      accent: "#C4A882",
      card: "#ffffff",
      cardForeground: "#2C2835",
      muted: "#8A8496",
    },
    header: {
      headerBg: "#F8F6FA",
      headerFont: "#2C2835",
      ctaBg: "#7B6B9A",
      ctaColor: "#F8F6FA",
    },
    footer: { footerBg: "#2C2835", footerFont: "#D4CFE0" },
    font: "dm-sans",
  },
  portals: {
    colours: {
      primary: "#7c3aed",
      background: "#000000",
      foreground: "#fafafa",
      accent: "#a78bfa",
      card: "#0a0a0a",
      cardForeground: "#fafafa",
      muted: "#a1a1aa",
    },
    header: {
      headerBg: "#000000",
      headerFont: "#fafafa",
      ctaBg: "#7c3aed",
      ctaColor: "#ffffff",
    },
    footer: { footerBg: "#000000", footerFont: "#71717a" },
    font: "inter",
  },
  bento: {
    colours: {
      primary: "#4f46e5",
      background: "#f8fafc",
      foreground: "#0f172a",
      accent: "#818cf8",
      card: "#ffffff",
      cardForeground: "#0f172a",
      muted: "#64748b",
    },
    header: {
      headerBg: "#ffffff",
      headerFont: "#0f172a",
      ctaBg: "#4f46e5",
      ctaColor: "#ffffff",
    },
    footer: { footerBg: "#0f172a", footerFont: "#94a3b8" },
    font: "dm-sans",
  },
  studio: {
    colours: {
      primary: "#e5e5e5",
      background: "#0a0a0a",
      foreground: "#fafafa",
      accent: "#a3a3a3",
      card: "#171717",
      cardForeground: "#fafafa",
      muted: "#a3a3a3",
    },
    header: {
      headerBg: "#0a0a0a",
      headerFont: "#fafafa",
      ctaBg: "#fafafa",
      ctaColor: "#0a0a0a",
    },
    footer: { footerBg: "#000000", footerFont: "#737373" },
    font: "georgia",
  },
  paper: {
    colours: {
      primary: "#b91c1c",
      background: "#f7f4ef",
      foreground: "#1c1917",
      accent: "#78716c",
      card: "#fffcf7",
      cardForeground: "#1c1917",
      muted: "#78716c",
    },
    header: {
      headerBg: "#f7f4ef",
      headerFont: "#1c1917",
      ctaBg: "#1c1917",
      ctaColor: "#f7f4ef",
    },
    footer: { footerBg: "#1c1917", footerFont: "#a8a29e" },
    font: "georgia",
  },
  glass: {
    colours: {
      primary: "#6366f1",
      background: "#eef2ff",
      foreground: "#1e1b4b",
      accent: "#a5b4fc",
      card: "#ffffff",
      cardForeground: "#1e1b4b",
      muted: "#64748b",
    },
    header: {
      headerBg: "rgba(255,255,255,0.7)",
      headerFont: "#1e1b4b",
      ctaBg: "#6366f1",
      ctaColor: "#ffffff",
    },
    footer: { footerBg: "#1e1b4b", footerFont: "#c7d2fe" },
    font: "inter",
  },
  // Legacy aliases → same palette as their replacements
  dark: {
    colours: {
      primary: "#e5e5e5",
      background: "#0a0a0a",
      foreground: "#fafafa",
      accent: "#a3a3a3",
      card: "#171717",
      cardForeground: "#fafafa",
      muted: "#a3a3a3",
    },
    header: {
      headerBg: "#0a0a0a",
      headerFont: "#fafafa",
      ctaBg: "#fafafa",
      ctaColor: "#0a0a0a",
    },
    footer: { footerBg: "#000000", footerFont: "#737373" },
    font: "georgia",
  },
  magazine: {
    colours: {
      primary: "#b91c1c",
      background: "#f7f4ef",
      foreground: "#1c1917",
      accent: "#78716c",
      card: "#fffcf7",
      cardForeground: "#1c1917",
      muted: "#78716c",
    },
    header: {
      headerBg: "#f7f4ef",
      headerFont: "#1c1917",
      ctaBg: "#1c1917",
      ctaColor: "#f7f4ef",
    },
    footer: { footerBg: "#1c1917", footerFont: "#a8a29e" },
    font: "georgia",
  },
  minimal: {
    colours: {
      primary: "#6366f1",
      background: "#eef2ff",
      foreground: "#1e1b4b",
      accent: "#a5b4fc",
      card: "#ffffff",
      cardForeground: "#1e1b4b",
      muted: "#64748b",
    },
    header: {
      headerBg: "rgba(255,255,255,0.7)",
      headerFont: "#1e1b4b",
      ctaBg: "#6366f1",
      ctaColor: "#ffffff",
    },
    footer: { footerBg: "#1e1b4b", footerFont: "#c7d2fe" },
    font: "inter",
  },
  agents: {
    colours: {
      primary: "#7c3aed",
      background: "#000000",
      foreground: "#fafafa",
      accent: "#a78bfa",
      card: "#0a0a0a",
      cardForeground: "#fafafa",
      muted: "#a1a1aa",
    },
    header: {
      headerBg: "#000000",
      headerFont: "#fafafa",
      ctaBg: "#7c3aed",
      ctaColor: "#ffffff",
    },
    footer: { footerBg: "#000000", footerFont: "#71717a" },
    font: "inter",
  },
};

export function getHomeLayoutPalette(
  homeStyle?: ThemePreset["homeStyle"] | null
): HomeLayoutPalette {
  if (homeStyle && HOME_LAYOUT_PALETTES[homeStyle]) {
    return HOME_LAYOUT_PALETTES[homeStyle];
  }
  return HOME_LAYOUT_PALETTES.classic;
}

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
    homeStyle: "bento",
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
    homeStyle: "paper",
  },
  "theme-4": {
    id: "theme-4",
    name: "Soft Bloom",
    colours: {
      /**
       * Calm meditation palette (no green):
       * soft lavender primary, warm mist background, dusty amethyst accent.
       */
      primary: "#7B6B9A",
      background: "#F8F6FA",
      foreground: "#2C2835",
      accent: "#C4A882",
      card: "#FFFFFF",
      cardForeground: "#2C2835",
      muted: "#8A8496",
    },
    header: {
      headerBg: "#F8F6FA",
      headerFont: "#2C2835",
      ctaBg: "#7B6B9A",
      ctaColor: "#F8F6FA",
      ctaText: "Start reading",
    },
    footer: {
      footerBg: "#2C2835",
      footerFont: "#D4CFE0",
      footerDescription:
        "A calm space for wellness, reflection, and stories that help you breathe.",
    },
    font: "dm-sans",
    homeStyle: "bloom",
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
    homeStyle: "classic",
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
    homeStyle: "studio",
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
    homeStyle: "studio",
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
    homeStyle: "paper",
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
    homeStyle: "paper",
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
    homeStyle: "glass",
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
  homeStyle?: ThemePreset["homeStyle"] | "editorial" | null;
} | null) {
  const preset = getThemePreset(branding?.themeId);
  // Colours / header / footer come from Appearance → Colours & Header (not forced by layout)
  const colours = { ...preset.colours, ...(branding?.colours || {}) };
  const header = { ...preset.header, ...(branding?.header || {}) };
  const footer = { ...preset.footer, ...(branding?.footer || {}) };
  // Prefer site home_layout (top-level or nested home) over theme preset default
  const fromSite =
    (branding?.homeStyle as ThemePreset["homeStyle"] | "editorial" | string | undefined) ||
    (branding as any)?.home?.homeStyle ||
    (branding as any)?.home?.layout ||
    null;
  let homeStyle = (fromSite ||
    preset.homeStyle) as ThemePreset["homeStyle"] | "editorial";
  // Normalize legacy / duplicate layout ids → unique designs
  if (homeStyle === ("editorial" as any)) homeStyle = "nature";
  if (homeStyle === "agents") homeStyle = "portals";
  if (homeStyle === "dark") homeStyle = "studio";
  if (homeStyle === "magazine") homeStyle = "paper";
  if (homeStyle === "minimal") homeStyle = "glass";
  return {
    themeId: branding?.themeId || preset.id,
    colours,
    header,
    footer,
    font: branding?.font || preset.font,
    homeStyle,
    home: (branding as any)?.home || null,
  };
}
