"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Eye, Palette, Sparkles, RefreshCw, X, Settings2, Send, Plus, Upload, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import Theme1Preview from "@/components/admin/Theme1Preview";
import { getThemePreset } from "@/lib/themePresets";
import {
  DEFAULT_THEME_NAV_LINKS,
  DEFAULT_THEME_FOOTER_LINKS,
} from "@/lib/themeNav";
import { useSite } from "@/components/admin/SiteContext";
import Link from "next/link";

/** One-by-one theme setup order (matches presets) */
const THEMES = [
  { id: "default", name: "Default", description: "Clean blue & white — safe starting theme.", preview: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80" },
  { id: "theme-1", name: "Theme 1 · Nature", description: "Green nature palette for growth / eco sites.", preview: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80" },
  { id: "theme-2", name: "Theme 2 · Mosaic", description: "Bold orange accents for energetic blogs.", preview: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80" },
  { id: "theme-3", name: "Theme 3 · Elegant Red", description: "Editorial red on white.", preview: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80" },
  { id: "theme-4", name: "Theme 4 · Soft Blush", description: "Pink lifestyle palette.", preview: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80" },
  { id: "theme-5", name: "Theme 5 · Travel Teal", description: "Dark teal travel / stories look.", preview: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" },
  { id: "theme-6", name: "Theme 6 · Fitness Dark", description: "Dark theme with green accents.", preview: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
  { id: "theme-7", name: "Theme 7 · Portfolio Blue", description: "Professional blue portfolio (tech default).", preview: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
  { id: "theme-8", name: "Theme 8 · Corporate", description: "Dark header + red CTA corporate.", preview: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=800&q=80" },
  { id: "theme-9", name: "Theme 9 · Editorial Teal", description: "Clean teal editorial.", preview: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&q=80" },
  { id: "theme-10", name: "Theme 10 · Magazine Blue", description: "Blue magazine layout.", preview: "https://images.unsplash.com/photo-1504280336224-b5dd8491d90c?w=800&q=80" },
  { id: "theme-11", name: "Theme 11 · Modern Dark", description: "Near-black + red modern dark.", preview: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80" },
];

export default function AppearancePage() {
  const { currentSite } = useSite();
  const [activeTheme, setActiveTheme] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [setupThemeId, setSetupThemeId] = useState<string | null>(null);
  /** Themes fully written for this site (one-by-one setup progress) */
  const [setupDone, setSetupDone] = useState<Record<string, boolean>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);

  // Customizer State
  const [activeTab, setActiveTab] = useState("header");
  const [headerBg, setHeaderBg] = useState("#ffffff");
  const [headerFont, setHeaderFont] = useState("#000000");
  const [headerLogo, setHeaderLogo] = useState("https://seeklogo.com/images/C/corehead-logo-0A288E3E34-seeklogo.com.png");
  const [headerAlt, setHeaderAlt] = useState("header-logo");
  const [navLinks, setNavLinks] = useState(DEFAULT_THEME_NAV_LINKS);
  const [newNavName, setNewNavName] = useState("");
  const [newNavLink, setNewNavLink] = useState("");
  const [ctaText, setCtaText] = useState("Sign-In");
  const [ctaUrl, setCtaUrl] = useState("/");
  const [ctaBg, setCtaBg] = useState("#156cab");
  const [ctaColor, setCtaColor] = useState("#ffffff");
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingFooterLogo, setIsUploadingFooterLogo] = useState(false);
  const footerLogoFileInputRef = useRef<HTMLInputElement>(null);

  // Footer State
  const [footerBg, setFooterBg] = useState("#10172e");
  const [footerFont, setFooterFont] = useState("#ffffff");
  const [footerLogo, setFooterLogo] = useState("https://seeklogo.com/images/C/corehead-logo-0A288E3E34-seeklogo.com.png");
  const [footerAlt, setFooterAlt] = useState("footer-logo");
  const [footerDescription, setFooterDescription] = useState("Blogs by CoreHead");
  const [quickLinks, setQuickLinks] = useState(DEFAULT_THEME_FOOTER_LINKS);
  const [newQuickName, setNewQuickName] = useState("");
  const [newQuickLink, setNewQuickLink] = useState("");
  const [socialLinks, setSocialLinks] = useState([
    { id: 1, platform: "Facebook", url: "/" },
    { id: 2, platform: "Twitter", url: "/" },
    { id: 3, platform: "Instagram", url: "/" },
  ]);
  const [newSocialPlatform, setNewSocialPlatform] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [copyrightText, setCopyrightText] = useState("© 2026 CoreHead by SeekaHost Technologies Ltd. All rights reserved");
  const [isSavingFooter, setIsSavingFooter] = useState(false);
  const [selectedFont, setSelectedFont] = useState("dm-sans");
  const [isSavingFonts, setIsSavingFonts] = useState(false);

  // Colours State
  const [colourPrimary, setColourPrimary] = useState("#025e03");
  const [colourBackground, setColourBackground] = useState("#ffffff");
  const [colourForeground, setColourForeground] = useState("#000000");
  const [colourAccent, setColourAccent] = useState("#0cc00c");
  const [colourCard, setColourCard] = useState("#ffffff");
  const [colourCardForeground, setColourCardForeground] = useState("#151515");
  const [colourDarkForeground, setColourDarkForeground] = useState("#ffffff");
  const [isSavingColours, setIsSavingColours] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const savedTheme = await api.getSetting("active_theme");
        if (savedTheme && savedTheme.themeId) {
          setActiveTheme(savedTheme.themeId);
        }
        // Mark which themes already have colours saved (setup progress)
        const done: Record<string, boolean> = {};
        await Promise.all(
          THEMES.map(async (t) => {
            try {
              const c = await api.getSetting(`theme_${t.id}_colours`);
              done[t.id] = !!(c && c.primary);
            } catch {
              done[t.id] = false;
            }
          }),
        );
        setSetupDone(done);
      } catch (error) {
        console.error("Failed to fetch theme:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTheme();
  }, [currentSite?.id]);

  /**
   * Fully write one theme pack (colours + header + footer + font) for this site.
   * force=true overwrites previous customizations for that theme.
   */
  const writeThemePack = async (
    themeId: string,
    options?: { makeActive?: boolean; force?: boolean },
  ) => {
    const preset = getThemePreset(themeId);
    const force = options?.force !== false; // default force for one-by-one setup
    const makeActive = options?.makeActive === true;

    if (makeActive) {
      await api.updateSetting("active_theme", { themeId });
    }

    const existingColours = force
      ? null
      : await api.getSetting(`theme_${themeId}_colours`);
    if (force || !existingColours?.primary) {
      await api.updateSetting(`theme_${themeId}_colours`, { ...preset.colours });
    }

    const existingHeader = force
      ? null
      : await api.getSetting(`theme_${themeId}_header`);
    if (force || !existingHeader?.headerBg) {
      await api.updateSetting(`theme_${themeId}_header`, {
        headerBg: preset.header.headerBg,
        headerFont: preset.header.headerFont,
        ctaBg: preset.header.ctaBg,
        ctaColor: preset.header.ctaColor,
        ctaText: preset.header.ctaText,
        ctaUrl: "/blog",
        navLinks: DEFAULT_THEME_NAV_LINKS,
        headerLogo: existingHeader?.headerLogo || headerLogo || currentSite?.logo || null,
      });
    }

    const existingFooter = force
      ? null
      : await api.getSetting(`theme_${themeId}_footer`);
    if (force || !existingFooter?.footerBg) {
      await api.updateSetting(`theme_${themeId}_footer`, {
        footerBg: preset.footer.footerBg,
        footerFont: preset.footer.footerFont,
        footerDescription:
          preset.footer.footerDescription ||
          `Stories and updates from ${currentSite?.name || "our site"}.`,
        copyrightText: `© ${new Date().getFullYear()} ${currentSite?.name || "Site"}. All rights reserved.`,
        quickLinks: DEFAULT_THEME_FOOTER_LINKS,
        footerLogo: existingFooter?.footerLogo || footerLogo || currentSite?.logo || null,
      });
    }

    const existingFont = force
      ? null
      : await api.getSetting(`theme_${themeId}_font`);
    if (force || !existingFont?.font) {
      await api.updateSetting(`theme_${themeId}_font`, { font: preset.font });
    }

    setSetupDone((prev) => ({ ...prev, [themeId]: true }));
    return preset;
  };

  // Fetch header & footer settings when activeTheme changes
  useEffect(() => {
    const fetchThemeSettings = async () => {
      if (isLoading) return;
      try {
        const headerData = await api.getSetting(`theme_${activeTheme}_header`);
        if (headerData) {
          setHeaderBg(headerData.headerBg || (activeTheme === "theme-1" ? "#000000" : "#ffffff"));
          setHeaderFont(headerData.headerFont || (activeTheme === "theme-1" ? "#ffffff" : "#000000"));
          setHeaderLogo(headerData.headerLogo || "https://seeklogo.com/images/C/corehead-logo-0A288E3E34-seeklogo.com.png");
          setHeaderAlt(headerData.headerAlt || "header-logo");
          setNavLinks(
            headerData.navLinks?.length
              ? headerData.navLinks
              : DEFAULT_THEME_NAV_LINKS,
          );
          setCtaText(headerData.ctaText || "Sign-In");
          setCtaUrl(headerData.ctaUrl || "/");
          setCtaBg(headerData.ctaBg || "#156cab");
          setCtaColor(headerData.ctaColor || "#ffffff");
        } else {
          setHeaderBg(activeTheme === "theme-1" ? "#000000" : "#ffffff");
          setHeaderFont(activeTheme === "theme-1" ? "#ffffff" : "#000000");
          setHeaderLogo("https://seeklogo.com/images/C/corehead-logo-0A288E3E34-seeklogo.com.png");
          setHeaderAlt("header-logo");
          setNavLinks(DEFAULT_THEME_NAV_LINKS);
          setCtaText("Latest posts");
          setCtaUrl("/blog");
          setCtaBg("#156cab");
          setCtaColor("#ffffff");
        }

        const footerData = await api.getSetting(`theme_${activeTheme}_footer`);
        if (footerData) {
          setFooterBg(footerData.footerBg || "#10172e");
          setFooterFont(footerData.footerFont || "#ffffff");
          setFooterLogo(footerData.footerLogo || "https://seeklogo.com/images/C/corehead-logo-0A288E3E34-seeklogo.com.png");
          setFooterAlt(footerData.footerAlt || "footer-logo");
          setFooterDescription(footerData.footerDescription || "Blogs by CoreHead");
          setQuickLinks(
            footerData.quickLinks?.length
              ? footerData.quickLinks
              : DEFAULT_THEME_FOOTER_LINKS,
          );
          setSocialLinks(footerData.socialLinks || [
            { id: 1, platform: "Facebook", url: "/" },
            { id: 2, platform: "Twitter", url: "/" },
            { id: 3, platform: "Instagram", url: "/" },
          ]);
          setCopyrightText(footerData.copyrightText || "© 2026 CoreHead by SeekaHost Technologies Ltd. All rights reserved");
        }

        const colourData = await api.getSetting(`theme_${activeTheme}_colours`);
        if (colourData) {
          setColourPrimary(colourData.primary || "#025e03");
          setColourBackground(colourData.background || "#ffffff");
          setColourForeground(colourData.foreground || "#000000");
          setColourAccent(colourData.accent || "#0cc00c");
          setColourCard(colourData.card || "#ffffff");
          setColourCardForeground(colourData.cardForeground || "#151515");
          setColourDarkForeground(colourData.darkForeground || "#ffffff");
        }

        const fontData = await api.getSetting(`theme_${activeTheme}_font`);
        if (fontData && fontData.font) {
          setSelectedFont(fontData.font);
        } else {
          setSelectedFont("dm-sans");
        }
      } catch (error) {
        console.error("Failed to load theme settings:", error);
      }
    };
    
    fetchThemeSettings();
  }, [activeTheme, isLoading]);

  const saveFontSettings = async () => {
    setIsSavingFonts(true);
    try {
      await api.updateSetting(`theme_${activeTheme}_font`, { font: selectedFont });
      alert("Font settings saved successfully!");
    } catch (error) {
      console.error("Failed to save font settings:", error);
      alert("Failed to save font settings.");
    } finally {
      setIsSavingFonts(false);
    }
  };

  const saveColourSettings = async () => {
    setIsSavingColours(true);
    try {
      await api.updateSetting(`theme_${activeTheme}_colours`, {
        primary: colourPrimary,
        background: colourBackground,
        foreground: colourForeground,
        accent: colourAccent,
        card: colourCard,
        cardForeground: colourCardForeground,
        darkForeground: colourDarkForeground,
      });
      alert("Colour settings saved successfully!");
    } catch (error) {
      console.error("Failed to save colour settings:", error);
      alert("Failed to save colour settings.");
    } finally {
      setIsSavingColours(false);
    }
  };

  /**
   * R2-4: One-by-one — fully set up this theme pack AND make it active on public site.
   */
  const handleActivateTheme = async (themeId: string) => {
    setActivating(true);
    setSetupThemeId(themeId);
    try {
      const preset = await writeThemePack(themeId, {
        makeActive: true,
        force: true,
      });
      setActiveTheme(themeId);
      // Reload customizer fields for this theme
      setHeaderBg(preset.header.headerBg);
      setHeaderFont(preset.header.headerFont);
      setCtaBg(preset.header.ctaBg);
      setCtaColor(preset.header.ctaColor);
      setCtaText(preset.header.ctaText);
      setFooterBg(preset.footer.footerBg);
      setFooterFont(preset.footer.footerFont);
      setFooterDescription(preset.footer.footerDescription);
      setColourPrimary(preset.colours.primary);
      setColourBackground(preset.colours.background);
      setColourForeground(preset.colours.foreground);
      setColourAccent(preset.colours.accent);
      setColourCard(preset.colours.card);
      setColourCardForeground(preset.colours.cardForeground);
      setSelectedFont(preset.font);

      alert(
        `✓ ${preset.name} set up & live${
          currentSite?.slug ? ` on /s/${currentSite.slug}` : ""
        }.\nOpen public site and hard-refresh (Ctrl+Shift+R).`,
      );
    } catch (error) {
      console.error("Failed to update theme:", error);
      alert("Failed to set up theme. Is a site selected?");
    } finally {
      setActivating(false);
      setSetupThemeId(null);
    }
  };

  /** Set up theme pack without switching active (prepare offline). */
  const handleSetupOnly = async (themeId: string) => {
    setSetupThemeId(themeId);
    try {
      const preset = await writeThemePack(themeId, {
        makeActive: false,
        force: true,
      });
      alert(`✓ ${preset.name} pack saved. Click Activate when you want it live.`);
    } catch (error) {
      console.error(error);
      alert("Failed to set up theme pack.");
    } finally {
      setSetupThemeId(null);
    }
  };

  /** Run all themes one-by-one in order (setup packs); leave current active as last activated optional */
  const handleSetupAllOneByOne = async () => {
    if (
      !confirm(
        `Set up all ${THEMES.length} theme packs for ${currentSite?.name || "this site"}? This overwrites each theme’s saved colours/header/footer.`,
      )
    ) {
      return;
    }
    setActivating(true);
    try {
      for (const t of THEMES) {
        setSetupThemeId(t.id);
        await writeThemePack(t.id, { makeActive: false, force: true });
      }
      // Keep currently active theme fully applied & live
      await writeThemePack(activeTheme, { makeActive: true, force: true });
      alert(
        `All ${THEMES.length} themes set up for ${currentSite?.name || "site"}. Active remains: ${activeTheme}`,
      );
    } catch (e) {
      console.error(e);
      alert("Setup stopped with an error. Check console / site context.");
    } finally {
      setActivating(false);
      setSetupThemeId(null);
    }
  };

  const saveHeaderSettings = async () => {
    setIsSavingHeader(true);
    try {
      const headerSettings = {
        headerBg,
        headerFont,
        headerLogo,
        headerAlt,
        navLinks,
        ctaText,
        ctaUrl,
        ctaBg,
        ctaColor
      };
      await api.updateSetting(`theme_${activeTheme}_header`, headerSettings);
      alert("Header settings updated successfully!");
    } catch (error) {
      console.error("Failed to save header settings:", error);
      alert("Failed to save header settings.");
    } finally {
      setIsSavingHeader(false);
    }
  };

  const addNavLink = () => {
    if (newNavName.trim() && newNavLink.trim()) {
      setNavLinks([...navLinks, { id: Date.now(), name: newNavName, link: newNavLink }]);
      setNewNavName("");
      setNewNavLink("");
    }
  };

  const removeNavLink = (id: number) => {
    setNavLinks(navLinks.filter(n => n.id !== id));
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo file size must be less than 2MB");
      return;
    }
    setIsUploadingLogo(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const uploaded = await api.uploadMedia({
            name: file.name,
            type: file.type,
            size: String(file.size),
            base64Data,
          });
          const rawUrl = uploaded.media?.url || uploaded.url || "";
          const fullUrl = rawUrl.startsWith("/") ? `http://localhost:5000${rawUrl}` : rawUrl;
          setHeaderLogo(fullUrl);
        } catch {
          // Fallback: use local object URL for preview only
          setHeaderLogo(URL.createObjectURL(file));
        }
        setIsUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingLogo(false);
    }
    // Reset input so same file can be re-uploaded
    e.target.value = "";
  };

  const handleFooterLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Footer logo file size must be less than 2MB");
      return;
    }
    setIsUploadingFooterLogo(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const uploaded = await api.uploadMedia({
            name: file.name,
            type: file.type,
            size: String(file.size),
            base64Data,
          });
          const rawUrl = uploaded.media?.url || uploaded.url || "";
          const fullUrl = rawUrl.startsWith("/") ? `http://localhost:5000${rawUrl}` : rawUrl;
          setFooterLogo(fullUrl);
        } catch {
          // Fallback: use local object URL for preview only
          setFooterLogo(URL.createObjectURL(file));
        }
        setIsUploadingFooterLogo(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingFooterLogo(false);
    }
    // Reset input so same file can be re-uploaded
    e.target.value = "";
  };

  const addQuickLink = () => {
    if (newQuickName.trim() && newQuickLink.trim()) {
      setQuickLinks([...quickLinks, { id: Date.now(), name: newQuickName, link: newQuickLink }]);
      setNewQuickName("");
      setNewQuickLink("");
    }
  };

  const removeQuickLink = (id: number) => {
    setQuickLinks(quickLinks.filter(n => n.id !== id));
  };

  const addSocialLink = () => {
    if (newSocialPlatform.trim() && newSocialUrl.trim()) {
      setSocialLinks([...socialLinks, { id: Date.now(), platform: newSocialPlatform, url: newSocialUrl }]);
      setNewSocialPlatform("");
      setNewSocialUrl("");
    }
  };

  const removeSocialLink = (id: number) => {
    setSocialLinks(socialLinks.filter(n => n.id !== id));
  };

  const saveFooterSettings = async () => {
    setIsSavingFooter(true);
    try {
      const footerSettings = {
        footerBg, footerFont, footerLogo, footerAlt, footerDescription, quickLinks, socialLinks, copyrightText
      };
      await api.updateSetting(`theme_${activeTheme}_footer`, footerSettings);
      alert("Footer settings updated successfully!");
    } catch (error) {
      console.error("Failed to save footer settings:", error);
      alert("Failed to save footer settings.");
    } finally {
      setIsSavingFooter(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading Themes...</div>;
  }

  const activeThemeName = THEMES.find(t => t.id === activeTheme)?.name || "Default";

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20 px-4 sm:px-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
            R2-4 · Public themes
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Appearance</h1>
          <p className="text-gray-500 mt-1">
            Themes apply to your public site shell (header, colours, footer, fonts).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {currentSite?.slug && (
            <Link
              href={`/s/${currentSite.slug}`}
              target="_blank"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View public site
            </Link>
          )}
          <button
            type="button"
            onClick={() => handleActivateTheme(activeTheme)}
            disabled={activating}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
          >
            {activating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 text-gray-400" />
            )}
            Re-apply theme
          </button>
        </div>
      </div>

      {/* Currently Active Banner */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4 group">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <Palette className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live on public site</p>
            <h2 className="text-xl font-black text-gray-900 mt-0.5">
              {activeThemeName}
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              {currentSite
                ? `Site: ${currentSite.name} · /s/${currentSite.slug}`
                : "Select a site to scope appearance settings"}
            </p>
            <p className="text-xs text-blue-600 font-bold mt-2">
              Setup progress: {Object.values(setupDone).filter(Boolean).length} / {THEMES.length} themes
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSetupAllOneByOne}
            disabled={activating || !currentSite}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Setup all (one-by-one)
          </button>
           <span className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100">
             <CheckCircle2 className="w-4 h-4" />
             Active
           </span>
        </div>
      </div>

      <p className="text-sm text-slate-500 font-medium">
        <strong className="text-slate-800">One by one:</strong> open a theme →{" "}
        <strong>Setup pack</strong> (save colours/header/footer) →{" "}
        <strong>Activate &amp; go live</strong> → check public site → next theme.
      </p>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {THEMES.map((theme, index) => {
          const isActive = theme.id === activeTheme;
          const isSetup = !!setupDone[theme.id];
          const isBusy = setupThemeId === theme.id;
          const preset = getThemePreset(theme.id);
          return (
            <div 
              key={theme.id}
              className={cn(
                "group relative bg-white rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500",
                isActive ? "border-blue-600 shadow-2xl shadow-blue-100" : isSetup ? "border-emerald-200 shadow-xl shadow-emerald-50" : "border-transparent shadow-xl shadow-gray-200/40 hover:border-blue-200"
              )}
            >
              {/* Preview Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img 
                  src={theme.preview} 
                  alt={theme.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button 
                    onClick={() => {
                      if (!isActive) handleActivateTheme(theme.id);
                      document.getElementById('theme-customizer')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                  >
                    <Settings2 className="w-4 h-4" />
                    Edit
                  </button>
                  {!isActive && (
                    <button 
                      onClick={() => !activating && handleActivateTheme(theme.id)}
                      disabled={activating}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all transform translate-y-4 group-hover:translate-y-0 delay-75 duration-500 shadow-lg shadow-blue-900/20"
                    >
                      <Sparkles className="w-4 h-4" />
                      Activate
                    </button>
                  )}
                </div>

                {/* Top Left Preview Icon */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewThemeId(theme.id);
                    if (theme.id !== "theme-1") setPreviewImage(theme.preview);
                  }}
                  className="absolute top-4 left-4 z-10 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors shadow-lg"
                  title="Preview Theme"
                >
                  <Eye className="w-4 h-4" />
                </button>
                
                <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1">
                  {isActive && (
                    <div className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg" title="Live">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  {isSetup && !isActive && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase">
                      Set up
                    </span>
                  )}
                </div>
                <span className="absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded-lg bg-black/50 text-white text-[10px] font-bold">
                  {index + 1} / {THEMES.length}
                </span>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ background: preset.colours.primary }}
                    title="Primary"
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ background: preset.header.headerBg }}
                    title="Header"
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ background: preset.footer.footerBg }}
                    title="Footer"
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-gray-900">{theme.name}</h3>
                  {isActive && (
                    <span className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-5">
                  {theme.description}
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={!!setupThemeId || activating}
                    onClick={() => handleSetupOnly(theme.id)}
                    className="w-full h-10 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isBusy ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isSetup ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : null}
                    {isBusy ? "Setting up…" : isSetup ? "Re-setup pack" : "1 · Setup pack"}
                  </button>
                  <button
                    type="button"
                    disabled={!!setupThemeId || activating}
                    onClick={() => handleActivateTheme(theme.id)}
                    className={cn(
                      "w-full h-10 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2",
                      isActive
                        ? "bg-slate-900 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700",
                    )}
                  >
                    {isBusy && isActive ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {isActive ? "Re-apply & go live" : "2 · Activate & go live"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Theme Customizer Section */}
      <div id="theme-customizer" className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mt-12 scroll-mt-24">
        <div className="p-8 border-b border-gray-50 flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Settings2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Customize: {activeThemeName}</h2>
              <p className="text-sm text-gray-500 mt-1">Configure colours, header, footer, and homepage for this theme</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-blue-100">
             Configured
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-6 border-b border-gray-100 flex gap-4">
          {["Header", "Footer", "Colours", "Fonts", "Homepage"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={cn(
                "px-6 py-3 rounded-t-2xl text-sm font-bold transition-all border border-b-0",
                activeTab === tab.toLowerCase() 
                  ? "bg-white text-gray-900 border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] translate-y-[1px]" 
                  : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8 bg-white min-h-[500px]">
          {activeTab === "header" && (
            <div className="space-y-10">
              
              {/* Header Styling */}
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900">Header Styling</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Configure the appearance of your website header</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Background Color</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={headerBg} 
                        onChange={(e) => setHeaderBg(e.target.value)}
                        className="w-14 h-12 rounded-xl cursor-pointer border border-gray-200"
                      />
                      <input 
                        type="text" 
                        value={headerBg} 
                        onChange={(e) => setHeaderBg(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Font Color</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={headerFont} 
                        onChange={(e) => setHeaderFont(e.target.value)}
                        className="w-14 h-12 rounded-xl cursor-pointer border border-gray-200"
                      />
                      <input 
                        type="text" 
                        value={headerFont} 
                        onChange={(e) => setHeaderFont(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm mt-4">
                  <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Interactive Header Preview</span>
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                    </div>
                  </div>
                  <nav 
                    className="flex items-center justify-between px-6 py-4 transition-colors"
                    style={{ backgroundColor: headerBg, color: headerFont }}
                  >
                    {/* Logo Area */}
                    <div className="flex items-center gap-2">
                      {headerLogo ? (
                        <img src={headerLogo} alt="Logo" className="h-6 object-contain" />
                      ) : (
                        <>
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                            <span className="text-[#0e5c38] text-[10px] font-black">C</span>
                          </div>
                          <span className="font-extrabold text-white text-xs tracking-wide">CoreHead</span>
                        </>
                      )}
                    </div>
                    
                    {/* Nav Links */}
                    <div className="flex items-center gap-4 text-[10px] font-bold">
                      {navLinks.map((item) => (
                        <span key={item.id} className="opacity-80 hover:opacity-100 cursor-pointer">
                          {item.name}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button 
                      className="text-[10px] px-3.5 py-1 rounded-full font-bold transition-all shadow-sm"
                      style={{ backgroundColor: ctaBg, color: ctaColor }}
                    >
                      {ctaText}
                    </button>
                  </nav>
                </div>
              </div>

              {/* Header Logo */}
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900">Header Logo</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Upload your website logo for the header</p>
                
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-sm font-bold text-gray-900">Logo Image</label>
                  <span className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Uploaded
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Upload your logo image (PNG or SVG recommended, max 1MB)</p>

                <div 
                  className="border-2 border-dashed border-gray-200 bg-black rounded-2xl p-8 mb-6 relative flex justify-center items-center cursor-pointer hover:border-blue-400 transition-colors group"
                  onClick={() => !isUploadingLogo && logoFileInputRef.current?.click()}
                >
                  {isUploadingLogo ? (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                      <p className="text-white text-xs font-bold">Uploading...</p>
                    </div>
                  ) : headerLogo ? (
                    <>
                      <img src={headerLogo} alt="Logo" className="h-16 object-contain" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setHeaderLogo(""); }}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:bg-blue-50 transition-colors">
                        <Upload className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <p className="text-sm font-bold text-blue-400 group-hover:text-blue-300">Click to upload logo</p>
                      <p className="text-[10px] text-gray-500 mt-1">PNG, SVG, JPG — max 2MB</p>
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={logoFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoFileChange}
                />

                <label className="text-sm font-bold text-gray-900 block mb-2">Alt Text</label>
                <input 
                  type="text" 
                  value={headerAlt} 
                  onChange={(e) => setHeaderAlt(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                />
              </div>

              {/* Navigation Links */}
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900">Navigation Links</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Add navigation links for your website header</p>

                <label className="text-sm font-bold text-gray-900 block mb-4">Add Navigation Item</label>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Page Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Home, About, Blog"
                      value={newNavName} 
                      onChange={(e) => setNewNavName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Page Link</label>
                    <input 
                      type="text" 
                      placeholder="e.g., /, /about, /blog"
                      value={newNavLink} 
                      onChange={(e) => setNewNavLink(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button 
                  onClick={addNavLink}
                  className="w-full py-3 bg-[#93ade9] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors mb-6"
                >
                  <Plus className="w-4 h-4" />
                  Add Navigation Link
                </button>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
                  {navLinks.map(nav => (
                    <div key={nav.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <Send className="w-4 h-4 text-gray-400 -rotate-45" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{nav.name}</p>
                          <p className="text-xs text-gray-500">{nav.link}</p>
                        </div>
                      </div>
                      <button onClick={() => removeNavLink(nav.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="border border-gray-100 rounded-3xl p-8 relative">
                <h3 className="text-lg font-bold text-gray-900">Call-to-Action Button</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Configure the CTA button in your header</p>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Button Text</label>
                    <input 
                      type="text" 
                      value={ctaText} 
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Button URL</label>
                    <input 
                      type="text" 
                      value={ctaUrl} 
                      onChange={(e) => setCtaUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-sm font-bold text-gray-900 block mb-2">Background Color</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={ctaBg} 
                          onChange={(e) => setCtaBg(e.target.value)}
                          className="w-14 h-12 rounded-xl cursor-pointer border border-gray-200"
                        />
                        <input 
                          type="text" 
                          value={ctaBg} 
                          onChange={(e) => setCtaBg(e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-900 block mb-2">Text Color</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={ctaColor} 
                          onChange={(e) => setCtaColor(e.target.value)}
                          className="w-14 h-12 rounded-xl cursor-pointer border border-gray-200"
                        />
                        <input 
                          type="text" 
                          value={ctaColor} 
                          onChange={(e) => setCtaColor(e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-4">
                    <span className="text-xs font-bold text-gray-400 self-start">Button Preview:</span>
                    <button 
                      className="px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-transform hover:-translate-y-0.5"
                      style={{ backgroundColor: ctaBg, color: ctaColor }}
                    >
                      {ctaText}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4">
                <button 
                  onClick={saveHeaderSettings}
                  disabled={isSavingHeader}
                  className={cn(
                    "px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all",
                    isSavingHeader ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                  )}
                >
                  {isSavingHeader ? "Updating..." : "Update Header"}
                </button>
              </div>

            </div>
          )}
          
          {activeTab === "footer" && (
            <div className="space-y-10">
              
              {/* Footer Styling */}
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900">Footer Styling</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Configure the appearance of your website footer</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Background Color</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={footerBg} 
                        onChange={(e) => setFooterBg(e.target.value)}
                        className="w-14 h-12 rounded-xl cursor-pointer border border-gray-200"
                      />
                      <input 
                        type="text" 
                        value={footerBg} 
                        onChange={(e) => setFooterBg(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-2">Font Color</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={footerFont} 
                        onChange={(e) => setFooterFont(e.target.value)}
                        className="w-14 h-12 rounded-xl cursor-pointer border border-gray-200"
                      />
                      <input 
                        type="text" 
                        value={footerFont} 
                        onChange={(e) => setFooterFont(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-2xl p-6 text-center" style={{ backgroundColor: footerBg, color: footerFont }}>
                  <p className="font-bold text-sm">Footer Preview</p>
                </div>
              </div>

              {/* Footer Logo */}
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900">Footer Logo</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Upload your logo for the footer section</p>
                
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-sm font-bold text-gray-900">Logo Image</label>
                  <span className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Uploaded
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Upload your logo image for footer (PNG or SVG recommended, max 1MB)</p>

                <div 
                  className="border border-gray-100 bg-[#0c1322] rounded-2xl p-8 mb-6 relative flex justify-center items-center cursor-pointer hover:border-blue-400 transition-colors group"
                  onClick={() => !isUploadingFooterLogo && footerLogoFileInputRef.current?.click()}
                >
                  {isUploadingFooterLogo ? (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                      <p className="text-white text-xs font-bold">Uploading...</p>
                    </div>
                  ) : footerLogo ? (
                    <>
                      <img src={footerLogo} alt="Logo" className="h-16 object-contain" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setFooterLogo(""); }}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-white/50">
                      <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-50/10 transition-colors">
                        <Upload className="w-5 h-5 text-white/50 group-hover:text-blue-300 transition-colors" />
                      </div>
                      <p className="text-sm font-bold text-white/50 group-hover:text-blue-300 transition-colors">Click to upload logo</p>
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={footerLogoFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFooterLogoFileChange}
                />

                <label className="text-sm font-bold text-gray-900 block mb-2">Alt Text</label>
                <input 
                  type="text" 
                  value={footerAlt} 
                  onChange={(e) => setFooterAlt(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                />
              </div>

              {/* Footer Text */}
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900">Footer Text</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Add descriptive text for your footer</p>

                <label className="text-sm font-bold text-gray-900 block mb-2">Footer Description</label>
                <textarea 
                  rows={4}
                  value={footerDescription} 
                  onChange={(e) => setFooterDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 resize-y"
                ></textarea>
              </div>

              {/* Quick Links */}
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900">Quick Links</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Add quick navigation links to your footer</p>

                <label className="text-sm font-bold text-gray-900 block mb-4">Add Quick Link</label>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Link Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Home, Privacy Policy"
                      value={newQuickName} 
                      onChange={(e) => setNewQuickName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Link Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g., /, /privacy"
                      value={newQuickLink} 
                      onChange={(e) => setNewQuickLink(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button 
                  onClick={addQuickLink}
                  className="w-full py-3 bg-[#93ade9] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors mb-6"
                >
                  <Plus className="w-4 h-4" />
                  Add Quick Link
                </button>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
                  {quickLinks.map(nav => (
                    <div key={nav.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{nav.name}</p>
                          <p className="text-xs text-gray-500">{nav.link}</p>
                        </div>
                      </div>
                      <button onClick={() => removeQuickLink(nav.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900">Social Media Links</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Add your social media profiles</p>

                <label className="text-sm font-bold text-gray-900 block mb-4">Add Social Media</label>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Platform Name</label>
                    <select 
                      value={newSocialPlatform} 
                      onChange={(e) => setNewSocialPlatform(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    >
                      <option value="">Select a platform</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Twitter">Twitter</option>
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="YouTube">YouTube</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Profile URL</label>
                    <input 
                      type="text" 
                      placeholder="https://twitter.com/username"
                      value={newSocialUrl} 
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button 
                  onClick={addSocialLink}
                  className="w-full py-3 bg-[#93ade9] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors mb-6"
                >
                  <Plus className="w-4 h-4" />
                  Add Social Media
                </button>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
                  {socialLinks.map(nav => (
                    <div key={nav.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{nav.platform}</p>
                          <p className="text-xs text-gray-500">{nav.url}</p>
                        </div>
                      </div>
                      <button onClick={() => removeSocialLink(nav.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Copyright Notice */}
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-lg font-bold text-gray-900">Copyright Notice</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6">Add a copyright notice for your website</p>

                <label className="text-sm font-bold text-gray-900 block mb-2">Copyright Text</label>
                <input 
                  type="text" 
                  value={copyrightText} 
                  onChange={(e) => setCopyrightText(e.target.value)}
                  className="w-full px-4 py-3 mb-6 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500"
                />

                <div className="border border-gray-100 rounded-lg p-4 text-center" style={{ backgroundColor: footerBg, color: footerFont }}>
                  <p className="text-sm">{copyrightText}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4">
                <button 
                  onClick={saveFooterSettings}
                  disabled={isSavingFooter}
                  className={cn(
                    "px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all",
                    isSavingFooter ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                  )}
                >
                  {isSavingFooter ? "Updating..." : "Update Footer"}
                </button>
              </div>

            </div>
          )}
          
          {activeTab === "fonts" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Primary Font</h3>
              </div>
              
              <div className="space-y-6">
                {/* DM Sans */}
                <div 
                  onClick={() => setSelectedFont("dm-sans")}
                  className={cn(
                    "p-8 rounded-3xl border-2 transition-all cursor-pointer bg-white relative flex flex-col gap-2",
                    selectedFont === "dm-sans" ? "border-blue-600 ring-2 ring-blue-600/10" : "border-gray-200 hover:border-gray-300"
                  )}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="font-option"
                      checked={selectedFont === "dm-sans"}
                      onChange={() => setSelectedFont("dm-sans")}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-900">DM Sans</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-lg text-gray-800 font-medium">The quick brown fox jumps over the lazy dog</p>
                    <p className="text-lg text-gray-800 font-medium uppercase">THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG</p>
                    <p className="text-lg text-gray-800 font-medium">0123456789</p>
                  </div>
                </div>

                {/* IBM Plex Sans */}
                <div 
                  onClick={() => setSelectedFont("ibm-plex-sans")}
                  className={cn(
                    "p-8 rounded-3xl border-2 transition-all cursor-pointer bg-white relative flex flex-col gap-2",
                    selectedFont === "ibm-plex-sans" ? "border-blue-600 ring-2 ring-blue-600/10" : "border-gray-200 hover:border-gray-300"
                  )}
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="font-option"
                      checked={selectedFont === "ibm-plex-sans"}
                      onChange={() => setSelectedFont("ibm-plex-sans")}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-900">IBM Plex Sans</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-lg text-gray-800 font-medium">The quick brown fox jumps over the lazy dog</p>
                    <p className="text-lg text-gray-800 font-medium uppercase">THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG</p>
                    <p className="text-lg text-gray-800 font-medium">0123456789</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-4">
                <button 
                  onClick={saveFontSettings}
                  disabled={isSavingFonts}
                  className={cn(
                    "px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all hover:bg-blue-700",
                    isSavingFonts ? "opacity-70 cursor-not-allowed" : ""
                  )}
                >
                  {isSavingFonts ? "Saving..." : "Save Fonts"}
                </button>
              </div>
            </div>
          )}
          
          {activeTab === "colours" && (
            <div className="space-y-6">
              <div className="border border-gray-100 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Theme Colours</h3>
                <p className="text-sm text-gray-500 mb-8">Configure the <span className="text-blue-500">colour palette</span> for your website</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Primary */}
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-1">Primary</label>
                    <p className="text-xs text-blue-500 mb-3">Main theme colour used for buttons and links</p>
                    <div className="flex gap-3">
                      <input type="color" value={colourPrimary} onChange={(e) => setColourPrimary(e.target.value)} className="w-14 h-11 rounded-xl cursor-pointer border border-gray-200 flex-shrink-0" />
                      <input type="text" value={colourPrimary} onChange={(e) => setColourPrimary(e.target.value)} className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  {/* Background */}
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-1">Background</label>
                    <p className="text-xs text-gray-400 mb-3">Main page background colour</p>
                    <div className="flex gap-3">
                      <input type="color" value={colourBackground} onChange={(e) => setColourBackground(e.target.value)} className="w-14 h-11 rounded-xl cursor-pointer border border-gray-200 flex-shrink-0" />
                      <input type="text" value={colourBackground} onChange={(e) => setColourBackground(e.target.value)} className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  {/* Foreground */}
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-1">Foreground</label>
                    <p className="text-xs text-gray-400 mb-3">Main text colour</p>
                    <div className="flex gap-3">
                      <input type="color" value={colourForeground} onChange={(e) => setColourForeground(e.target.value)} className="w-14 h-11 rounded-xl cursor-pointer border border-gray-200 flex-shrink-0" />
                      <input type="text" value={colourForeground} onChange={(e) => setColourForeground(e.target.value)} className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  {/* Accent */}
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-1">Accent</label>
                    <p className="text-xs text-blue-500 mb-3">Highlight and hover text colour</p>
                    <div className="flex gap-3">
                      <input type="color" value={colourAccent} onChange={(e) => setColourAccent(e.target.value)} className="w-14 h-11 rounded-xl cursor-pointer border border-gray-200 flex-shrink-0" />
                      <input type="text" value={colourAccent} onChange={(e) => setColourAccent(e.target.value)} className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  {/* Card */}
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-1">Card</label>
                    <p className="text-xs text-gray-400 mb-3">Card background colour</p>
                    <div className="flex gap-3">
                      <input type="color" value={colourCard} onChange={(e) => setColourCard(e.target.value)} className="w-14 h-11 rounded-xl cursor-pointer border border-gray-200 flex-shrink-0" />
                      <input type="text" value={colourCard} onChange={(e) => setColourCard(e.target.value)} className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  {/* Card Foreground */}
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-1">Card Foreground</label>
                    <p className="text-xs text-gray-400 mb-3">Card text colour</p>
                    <div className="flex gap-3">
                      <input type="color" value={colourCardForeground} onChange={(e) => setColourCardForeground(e.target.value)} className="w-14 h-11 rounded-xl cursor-pointer border border-gray-200 flex-shrink-0" />
                      <input type="text" value={colourCardForeground} onChange={(e) => setColourCardForeground(e.target.value)} className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500" />
                    </div>
                  </div>

                  {/* Dark Foreground */}
                  <div>
                    <label className="text-sm font-bold text-gray-900 block mb-1">Dark Foreground</label>
                    <p className="text-xs text-blue-500 mb-3">Light text colour over dark background</p>
                    <div className="flex gap-3">
                      <input type="color" value={colourDarkForeground} onChange={(e) => setColourDarkForeground(e.target.value)} className="w-14 h-11 rounded-xl cursor-pointer border border-gray-200 flex-shrink-0" />
                      <input type="text" value={colourDarkForeground} onChange={(e) => setColourDarkForeground(e.target.value)} className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save */}
              <div className="flex justify-end">
                <button
                  onClick={saveColourSettings}
                  disabled={isSavingColours}
                  className={cn(
                    "px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all",
                    isSavingColours ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                  )}
                >
                  {isSavingColours ? "Saving..." : "Save Colours"}
                </button>
              </div>
            </div>
          )}

          {activeTab !== "header" && activeTab !== "footer" && activeTab !== "fonts" && activeTab !== "colours" && (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                <Settings2 className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">{activeTab} Settings</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Configuration options for the {activeTab} will be available in the next update.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal — Theme 1 gets a live rendered preview */}
      {previewThemeId === "theme-1" && (
        <Theme1Preview 
          onClose={() => { setPreviewThemeId(null); setPreviewImage(null); }} 
          logoUrl={headerLogo}
          navLinks={navLinks}
          headerBg={headerBg}
          headerFont={headerFont}
          fontFamily={selectedFont}
          footerLogoUrl={footerLogo}
          footerBg={footerBg}
          footerFont={footerFont}
        />
      )}

      {/* Preview Modal — all other themes show image */}
      {previewImage && previewThemeId !== "theme-1" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => { setPreviewImage(null); setPreviewThemeId(null); }}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-10 backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full">
              <img 
                src={previewImage} 
                alt="Theme Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between text-gray-500">
        <div>
          <p className="text-sm">Copyright © 2026 SeekaHost Technologies Ltd. All Rights Reserved.</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Company Number: 16026964 | VAT Number: 485829729</p>
        </div>
        <div className="text-sm font-medium">v1.0.0</div>
      </div>
    </div>
  );
}
