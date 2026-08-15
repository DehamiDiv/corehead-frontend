export const THEME_REGISTRY = {
  default: {
    id: "default",
    name: "Classic Slate",
    colours: {
      primary: "#2563eb",
      background: "#ffffff",
      foreground: "#0f172a",
      accent: "#eff6ff",
      card: "#ffffff",
      cardForeground: "#0f172a",
      muted: "#64748b",
    },
    header: {
      headerBg: "#ffffff",
      headerFont: "inter",
      ctaBg: "#2563eb",
      ctaColor: "#ffffff",
      ctaText: "Get Started",
    },
    footer: {
      footerBg: "#0f172a",
      footerFont: "inter",
      footerDescription: "Modern blog publishing platform.",
    },
    font: "inter",
    tokens: {
      radius: "12px",
      shadow: "0 4px 20px -2px rgba(0,0,0,0.05)",
      buttonStyle: "pill",
      containerWidth: "1200px",
      sectionSpacing: "64px",
      headerVariant: "light",
      footerVariant: "solid",
    },
    homeStyle: "classic",
    recommendedHomeStyle: "classic",
  },
};

export const HOME_LAYOUT_REGISTRY = {
  classic: {
    id: "classic",
    name: "Classic Grid",
    description: "Clean blog layout with hero and grid stories",
    suitableFor: ["General", "Tech", "News"],
    previewAsset: "/demo/classic-preview.png",
    recommendedThemeIds: ["default"],
  },
  nature: {
    id: "nature",
    name: "Nature Editorial",
    description: "Editorial layout with rich hero",
    suitableFor: ["Lifestyle", "Nature"],
    previewAsset: "/demo/nature-preview.png",
    recommendedThemeIds: ["default"],
  },
  paper: {
    id: "paper",
    name: "Paper Broadsheet",
    description: "Newspaper multi-column editorial",
    suitableFor: ["Journalism", "Opinion"],
    previewAsset: "/demo/paper-preview.png",
    recommendedThemeIds: ["default"],
  },
};

export const THEME_PREVIEW_ASSETS = {
  default: "/demo/classic-theme.png",
};

export function getHomeLayoutRegistration(id) {
  return HOME_LAYOUT_REGISTRY[id] || HOME_LAYOUT_REGISTRY.classic;
}

export function getThemeRegistration(id) {
  return THEME_REGISTRY[id] || THEME_REGISTRY.default;
}

export function getThemePreset(id) {
  return getThemeRegistration(id);
}

export default {
  THEME_REGISTRY,
  HOME_LAYOUT_REGISTRY,
  THEME_PREVIEW_ASSETS,
  getHomeLayoutRegistration,
  getThemeRegistration,
  getThemePreset,
};
