"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Eye, Sparkles, RefreshCw, X, Settings2, Send, Plus, Upload, Loader2, ExternalLink, Pencil, Image as ImageIcon, Camera, Share2, Briefcase, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import Theme1Preview from "@/components/admin/Theme1Preview";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import AppearanceThemeGallery from "@/components/admin/appearance/AppearanceThemeGallery";
import AppearanceHomeLayoutGallery from "@/components/admin/appearance/AppearanceHomeLayoutGallery";
import AppearanceContentLayoutGallery from "@/components/admin/appearance/AppearanceContentLayoutGallery";
import {
  getThemePreset,
  getHomeLayoutPalette,
  HOME_LAYOUT_OPTIONS,
  THEME_OPTIONS,
  type ThemePreset,
} from "@/lib/themePresets";
import { resolveAdminMediaUrl } from "@/lib/apiOrigin";
import {
  extractUploadedMediaUrl,
  normalizeMediaPath,
  usableLogoUrl,
} from "@/lib/siteMedia";
import {
  getHomeDemoContent,
  mergeHomeWithDemo,
  type HomeDemoContent,
} from "@/lib/homeDemoContent";
import {
  DEFAULT_THEME_NAV_LINKS,
  DEFAULT_THEME_FOOTER_LINKS,
} from "@/lib/themeNav";
import { useSite } from "@/components/admin/SiteContext";
import Link from "next/link";
import { preserveHomeLayoutForThemeChange } from "@/lib/appearanceModel";
import { toast } from "@/lib/toast";

/**
 * Theme gallery — same 12 packs as dev.corehead.app Appearance.
 * Preview images show the intended homepage look for each pack.
 */
const LEGACY_THEME_GALLERY = [
  {
    id: "default",
    name: "Default",
    description:
      "Clean white layout with featured post slider, category tabs…",
    preview:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80",
  },
  {
    id: "theme-1",
    name: "Theme 1",
    description:
      "Nature-inspired green hero with full-width banner, search…",
    preview:
      "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=900&q=80",
  },
  {
    id: "theme-2",
    name: "Theme 2",
    description:
      "Bold mosaic hero grid with orange accents, featured article…",
    preview:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80",
  },
  {
    id: "theme-3",
    name: "Theme 3",
    description:
      "Elegant white layout with red accents, emoji welcome bann…",
    preview:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80",
  },
  {
    id: "theme-4",
    name: "Theme 4",
    description:
      "Soft pink and beige theme with triple card slider, category…",
    preview:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=80",
  },
  {
    id: "theme-5",
    name: "Theme 5",
    description:
      "Travel blog style with dark teal hero, search bar and featur…",
    preview:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=80",
  },
  {
    id: "theme-6",
    name: "Theme 6",
    description:
      "Dark fitness theme with bold green diagonal accents, hero…",
    preview:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",
  },
  {
    id: "theme-7",
    name: "Theme 7",
    description:
      "Professional portfolio style with blue accents, personal intr…",
    preview:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80",
  },
  {
    id: "theme-8",
    name: "Theme 8",
    description:
      "Corporate consulting layout with red CTA buttons, hero…",
    preview:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
  },
  {
    id: "theme-9",
    name: "Theme 9",
    description:
      "Clean white editorial layout with teal accents, category…",
    preview:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=900&q=80",
  },
  {
    id: "theme-10",
    name: "Theme 10",
    description:
      "Blue magazine-style layout with featured post slider, social…",
    preview:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80",
  },
  {
    id: "theme-11",
    name: "Theme 11",
    description:
      "Modern dark theme with red accents, floating navigation a…",
    preview:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900&q=80",
  },
];

// Task 2: the visible gallery consumes the shared, named theme registry.
const THEMES = THEME_OPTIONS;

export default function AppearancePage() {
  const { currentSite, currentSiteId } = useSite();
  const siteName = currentSite?.name || "our site";
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
  const [headerHeight, setHeaderHeight] = useState(72);
  const [headerMobileHeight, setHeaderMobileHeight] = useState(64);
  // Empty until loaded — never default tenant sites to CoreHead placeholder
  const [headerLogo, setHeaderLogo] = useState("");
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
  const [footerPadding, setFooterPadding] = useState(56);
  const [footerMobilePadding, setFooterMobilePadding] = useState(40);
  const [footerLogo, setFooterLogo] = useState("");
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
  /** Public home layout (site-level) — classic | nature | dark | magazine | minimal */
  const [homeLayout, setHomeLayout] = useState<ThemePreset["homeStyle"]>("classic");
  const [isSavingHomeLayout, setIsSavingHomeLayout] = useState(false);
  const [homeLayoutMsg, setHomeLayoutMsg] = useState<string | null>(null);
  // Editable home content (saved with home_layout)
  const [homeEyebrow, setHomeEyebrow] = useState("");
  const [homeTagline, setHomeTagline] = useState("");
  /** Hero title (Layout edit window — "Welcome to Our Website") */
  const [homeHeroTitle, setHomeHeroTitle] = useState("");
  const [homeHeroImage, setHomeHeroImage] = useState("");
  const [homeCaptionLeft, setHomeCaptionLeft] = useState("");
  const [homeCaptionRight, setHomeCaptionRight] = useState("");
  // Featured + side rail
  const [homeFeaturedEyebrow, setHomeFeaturedEyebrow] = useState("");
  const [homeFeaturedTitle, setHomeFeaturedTitle] = useState("");
  const [homeSideRailLabel, setHomeSideRailLabel] = useState("");
  // Pillars section
  const [homePillarsEyebrow, setHomePillarsEyebrow] = useState("");
  const [homePillarsTitle, setHomePillarsTitle] = useState("");
  const [homePillarsBody, setHomePillarsBody] = useState("");
  const [homePillars, setHomePillars] = useState<
    Array<{ title: string; body: string }>
  >([
    { title: "", body: "" },
    { title: "", body: "" },
    { title: "", body: "" },
  ]);
  // Latest grid
  const [homeLatestEyebrow, setHomeLatestEyebrow] = useState("");
  const [homeLatestTitle, setHomeLatestTitle] = useState("");
  // Bottom CTA
  const [homeCtaEyebrow, setHomeCtaEyebrow] = useState("");
  const [homeCtaTitle, setHomeCtaTitle] = useState("");
  const [homeCtaBody, setHomeCtaBody] = useState("");
  const [homeCtaButton, setHomeCtaButton] = useState("");
  const [homeCtaBgImage, setHomeCtaBgImage] = useState("");
  // Layout 6 · Paper portfolio pack
  const [homeSocialLinks, setHomeSocialLinks] = useState<
    Array<{ id: number; platform: string; url: string }>
  >([]);
  const [homeNewSocialPlatform, setHomeNewSocialPlatform] = useState("");
  const [homeNewSocialUrl, setHomeNewSocialUrl] = useState("");
  const [homeContactEmail, setHomeContactEmail] = useState("support@gmail.com");
  const [homeContactPhone, setHomeContactPhone] = useState("+11 4551451");
  const [homeContactAddress, setHomeContactAddress] = useState("12, London");
  const [homeAboutTitle, setHomeAboutTitle] = useState(
    "I take your finance to next level",
  );
  const [homeAboutDescription, setHomeAboutDescription] = useState(
    "With a strong focus on strategy and clarity…",
  );
  const [homeAboutImage, setHomeAboutImage] = useState("");
  const [homeServices, setHomeServices] = useState<
    Array<{ id: number; icon: string; title: string; description: string }>
  >([]);
  const [newServiceIcon, setNewServiceIcon] = useState("");
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("This is a service.");
  const [homeVideoUrl, setHomeVideoUrl] = useState("");
  const [homeVideoThumb, setHomeVideoThumb] = useState("");
  const [homeTestimonials, setHomeTestimonials] = useState<
    Array<{
      id: number;
      image: string;
      name: string;
      role: string;
      review: string;
    }>
  >([]);
  const [newTestImage, setNewTestImage] = useState("");
  const [newTestName, setNewTestName] = useState("Christian");
  const [newTestRole, setNewTestRole] = useState("Director");
  const [newTestReview, setNewTestReview] = useState("This service is good");
  const [homeClients, setHomeClients] = useState<
    Array<{ id: number; logo: string; name: string }>
  >([]);
  const [newClientLogo, setNewClientLogo] = useState("");
  const [newClientName, setNewClientName] = useState("Google");
  const [isUploadingHomeHero, setIsUploadingHomeHero] = useState(false);
  const [isUploadingCtaBg, setIsUploadingCtaBg] = useState(false);
  const [isUploadingLayout6, setIsUploadingLayout6] = useState(false);
  const homeHeroInputRef = useRef<HTMLInputElement>(null);
  const homeCtaBgInputRef = useRef<HTMLInputElement>(null);
  const layout6FileRef = useRef<HTMLInputElement>(null);
  const [layout6UploadTarget, setLayout6UploadTarget] = useState<
    "about" | "service" | "video" | "testimonial" | "client" | null
  >(null);
  const [homeMediaTarget, setHomeMediaTarget] = useState<
    "hero" | "cta" | "about" | "service" | "video" | "testimonial" | "client" | null
  >(null);
  /** Edit window for home layout (theme-style modal) */
  const [homeEditOpen, setHomeEditOpen] = useState(false);
  const [editingHomeLayout, setEditingHomeLayout] = useState<ThemePreset["homeStyle"] | null>(null);

  /** Fill form fields from demo defaults (layout-specific). force=true overwrites all. */
  const applyHomeDemoToForm = (
    style: ThemePreset["homeStyle"],
    options?: { force?: boolean; base?: Partial<HomeDemoContent> | null },
  ) => {
    const merged = mergeHomeWithDemo(
      options?.force ? null : options?.base ?? null,
      style,
      siteName,
    );
    const demo = options?.force
      ? getHomeDemoContent(style, siteName)
      : merged;

    setHomeEyebrow(demo.eyebrow);
    setHomeTagline(demo.tagline);
    // Hero Title field: eyebrow breadcrumb style, or ctaTitle, or tagline
    setHomeHeroTitle(
      demo.eyebrow || demo.ctaTitle || demo.tagline || `Welcome to ${siteName}`,
    );
    setHomeCaptionLeft(demo.captionLeft);
    setHomeCaptionRight(demo.captionRight);
    setHomeFeaturedEyebrow(demo.featuredEyebrow);
    setHomeFeaturedTitle(demo.featuredTitle);
    setHomeSideRailLabel(demo.sideRailLabel);
    setHomePillarsEyebrow(demo.pillarsEyebrow);
    setHomePillarsTitle(demo.pillarsTitle);
    setHomePillarsBody(demo.pillarsBody);
    const slotCount = demo.pillars.length >= 4 ? 4 : 3;
    setHomePillars(
      Array.from({ length: slotCount }, (_, i) => ({
        title: demo.pillars[i]?.title || "",
        body: demo.pillars[i]?.body || "",
      })),
    );
    setHomeLatestEyebrow(demo.latestEyebrow);
    setHomeLatestTitle(demo.latestTitle);
    setHomeCtaEyebrow(demo.ctaEyebrow);
    setHomeCtaTitle(demo.ctaTitle);
    setHomeCtaBody(demo.ctaBody);
    setHomeCtaButton(demo.ctaButton);
  };

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
        // Site-level public home layout + editable fields
        try {
          const home = await api.getSetting("home_layout");
          const style = home?.homeStyle || home?.layout;
          if (
            style &&
            HOME_LAYOUT_OPTIONS.some((o) => o.id === style)
          ) {
            setHomeLayout(style);
          } else if (savedTheme?.themeId) {
            setHomeLayout(getThemePreset(savedTheme.themeId).homeStyle);
          }
          // Pre-fill form: saved home_layout wins; empty slots get layout demo copy
          const styleForDemo =
            (style && HOME_LAYOUT_OPTIONS.some((o) => o.id === style)
              ? style
              : null) ||
            (savedTheme?.themeId
              ? getThemePreset(savedTheme.themeId).homeStyle
              : "classic");
          setHomeHeroImage(
            (home && typeof home === "object" && home.heroImage) || "",
          );
          applyHomeDemoToForm(styleForDemo as ThemePreset["homeStyle"], {
            force: false,
            base: home && typeof home === "object" ? home : null,
          });
        } catch {
          /* fill classic demo so form is never blank */
          applyHomeDemoToForm("classic", { force: true });
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
   * force=true overwrites palette / chrome colours from the preset (keeps logos + nav).
   * Theme activation preserves the independently selected homepage layout.
   */
  const writeThemePack = async (
    themeId: string,
    options?: { makeActive?: boolean; force?: boolean },
  ) => {
    const preset = getThemePreset(themeId);
    const force = options?.force !== false; // default force for one-by-one setup
    const makeActive = options?.makeActive === true;

    if (makeActive) {
      const existingHome = await api.getSetting("home_layout");
      const preservedHome = preserveHomeLayoutForThemeChange(
        existingHome,
        homeLayout,
      );
      if (preservedHome.changed) {
        await api.updateSetting("home_layout", preservedHome.value);
      }
      await api.updateSetting("active_theme", { themeId });
    }

    const existingColours =
      (await api.getSetting("site_colours")) ||
      (await api.getSetting(`theme_${themeId}_colours`));
    if (force || !existingColours?.primary) {
      const colours = { ...preset.colours };
      await api.updateSetting("site_colours", colours);
      await api.updateSetting(`theme_${themeId}_colours`, colours);
    }

    // Always load existing header so force can keep logo/nav while applying palette
    const existingHeader =
      (await api.getSetting("site_header")) ||
      (await api.getSetting(`theme_${themeId}_header`));
    if (force || !existingHeader?.headerBg) {
      const siteSlug = currentSite?.slug;
      const blogUrl = siteSlug ? `/s/${siteSlug}/blog` : "/blog";
      const headerPayload = {
        ...(existingHeader && typeof existingHeader === "object" ? existingHeader : {}),
        headerBg: preset.header.headerBg,
        headerFont: preset.header.headerFont,
        ctaBg: preset.header.ctaBg,
        ctaColor: preset.header.ctaColor,
        ctaText: preset.header.ctaText || existingHeader?.ctaText || "Explore",
        ctaUrl: existingHeader?.ctaUrl || blogUrl,
        navLinks:
          existingHeader?.navLinks?.length > 0
            ? existingHeader.navLinks
            : DEFAULT_THEME_NAV_LINKS,
        headerLogo:
          usableLogoUrl(existingHeader?.headerLogo) ||
          usableLogoUrl(currentSite?.logo) ||
          usableLogoUrl(headerLogo) ||
          null,
        headerAlt: existingHeader?.headerAlt || headerAlt || "header-logo",
      };
      await api.updateSetting("site_header", headerPayload);
      await api.updateSetting(`theme_${themeId}_header`, headerPayload);
    }

    const existingFooter =
      (await api.getSetting("site_footer")) ||
      (await api.getSetting(`theme_${themeId}_footer`));
    if (force || !existingFooter?.footerBg) {
      const footerPayload = {
        ...(existingFooter && typeof existingFooter === "object" ? existingFooter : {}),
        footerBg: preset.footer.footerBg,
        footerFont: preset.footer.footerFont,
        footerDescription:
          preset.footer.footerDescription ||
          existingFooter?.footerDescription ||
          `Stories and updates from ${currentSite?.name || "our site"}.`,
        copyrightText:
          existingFooter?.copyrightText ||
          `© ${new Date().getFullYear()} ${currentSite?.name || "Site"}. All rights reserved.`,
        quickLinks:
          existingFooter?.quickLinks?.length > 0
            ? existingFooter.quickLinks
            : DEFAULT_THEME_FOOTER_LINKS,
        socialLinks: existingFooter?.socialLinks || undefined,
        footerLogo:
          usableLogoUrl(existingFooter?.footerLogo) ||
          usableLogoUrl(currentSite?.logo) ||
          usableLogoUrl(footerLogo) ||
          null,
        footerAlt: existingFooter?.footerAlt || footerAlt || "footer-logo",
      };
      await api.updateSetting("site_footer", footerPayload);
      await api.updateSetting(`theme_${themeId}_footer`, footerPayload);
    }

    const existingFont =
      (await api.getSetting("site_font")) ||
      (await api.getSetting(`theme_${themeId}_font`));
    if (force || !existingFont?.font) {
      const fontPayload = { font: preset.font };
      await api.updateSetting("site_font", fontPayload);
      await api.updateSetting(`theme_${themeId}_font`, fontPayload);
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
          setHeaderHeight(Number(headerData.headerHeight) || 72);
          setHeaderMobileHeight(Number(headerData.headerMobileHeight) || 64);
          setHeaderLogo(
            usableLogoUrl(headerData.headerLogo) ||
              usableLogoUrl(currentSite?.logo) ||
              ""
          );
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
          setHeaderHeight(72);
          setHeaderMobileHeight(64);
          setHeaderLogo(usableLogoUrl(currentSite?.logo) || "");
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
          setFooterPadding(Number(footerData.footerPadding) || 56);
          setFooterMobilePadding(Number(footerData.footerMobilePadding) || 40);
          setFooterLogo(
            usableLogoUrl(footerData.footerLogo) ||
              usableLogoUrl(currentSite?.logo) ||
              ""
          );
          setFooterAlt(footerData.footerAlt || "footer-logo");
          setFooterDescription(
            footerData.footerDescription ||
              `Stories and updates from ${currentSite?.name || "our site"}.`
          );
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
        } else {
          setFooterBg("#10172e");
          setFooterFont("#ffffff");
          setFooterPadding(56);
          setFooterMobilePadding(40);
        }

        const colourData =
          (await api.getSetting("site_colours")) ||
          (await api.getSetting(`theme_${activeTheme}_colours`));
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
  }, [activeTheme, isLoading, currentSite?.logo, currentSite?.name]);

  const saveFontSettings = async () => {
    setIsSavingFonts(true);
    try {
      const themeId = activeTheme || "default";
      const fontPayload = { font: selectedFont };
      await api.updateSetting("site_font", fontPayload);
      await api.updateSetting(`theme_${themeId}_font`, fontPayload);
      toast.success("Font settings saved successfully!");
    } catch (error) {
      console.error("Failed to save font settings:", error);
      toast.error("Failed to save font settings.");
    } finally {
      setIsSavingFonts(false);
    }
  };

  const saveColourSettings = async () => {
    if (!currentSite) {
      toast.warning("Select a site first (site switcher). Colours are saved per site.");
      return;
    }
    setIsSavingColours(true);
    try {
      const themeId = activeTheme || "default";
      // Keep public branding pointed at this theme pack
      await api.updateSetting("active_theme", { themeId });

      // Preserve layout-pack muted if user only edits primary fields in the form
      const existingColours =
        (await api.getSetting("site_colours")) ||
        (await api.getSetting(`theme_${themeId}_colours`)) ||
        {};
      const colourPayload = {
        primary: colourPrimary,
        background: colourBackground,
        foreground: colourForeground,
        accent: colourAccent,
        card: colourCard,
        cardForeground: colourCardForeground,
        darkForeground: colourDarkForeground,
        muted:
          (existingColours &&
            typeof existingColours === "object" &&
            existingColours.muted) ||
          colourForeground,
      };

      // Site-level palette (public prefers this) + theme pack copy
      await api.updateSetting("site_colours", colourPayload);
      await api.updateSetting(`theme_${themeId}_colours`, colourPayload);

      // Sync CTA chrome so buttons match Primary (header pack + site_header)
      try {
        const existingHeader =
          (await api.getSetting("site_header")) ||
          (await api.getSetting(`theme_${themeId}_header`)) ||
          {};
        const headerPayload = {
          ...(existingHeader && typeof existingHeader === "object"
            ? existingHeader
            : {}),
          ctaBg: colourPrimary,
          ctaColor: colourDarkForeground || "#ffffff",
        };
        await api.updateSetting("site_header", headerPayload);
        await api.updateSetting(`theme_${themeId}_header`, headerPayload);
        setCtaBg(colourPrimary);
        setCtaColor(colourDarkForeground || "#ffffff");
      } catch (headerErr) {
        console.warn("Colours saved; header CTA sync skipped:", headerErr);
      }

      toast.success(
        "Colours saved and applied to the public site.\nHard-refresh the site (Ctrl+Shift+R) to see them.",
      );
    } catch (error) {
      console.error("Failed to save colour settings:", error);
      toast.error(
        "Failed to save colour settings. Is a site selected and the API running?",
      );
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
      // Apply full Soft Bloom / theme pack into customizer UI (colours + header + footer)
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
      setColourDarkForeground(
        preset.colours.background?.startsWith("#0") ||
          preset.colours.background?.startsWith("#1") ||
          preset.colours.background?.startsWith("#2")
          ? preset.colours.foreground
          : "#ffffff"
      );
      setSelectedFont(preset.font);
      // Theme selection deliberately leaves the homepage layout unchanged.

      // Re-read saved pack so UI matches DB (nav/logo preserved)
      try {
        const [h, f, c] = await Promise.all([
          api.getSetting(`theme_${themeId}_header`),
          api.getSetting(`theme_${themeId}_footer`),
          api.getSetting(`theme_${themeId}_colours`),
        ]);
        if (h?.headerLogo) setHeaderLogo(h.headerLogo);
        if (h?.navLinks?.length) setNavLinks(h.navLinks);
        if (h?.ctaUrl) setCtaUrl(h.ctaUrl);
        if (f?.footerLogo) setFooterLogo(f.footerLogo);
        if (f?.quickLinks?.length) setQuickLinks(f.quickLinks);
        if (f?.copyrightText) setCopyrightText(f.copyrightText);
        if (c?.primary) {
          setColourPrimary(c.primary);
          setColourBackground(c.background || preset.colours.background);
          setColourForeground(c.foreground || preset.colours.foreground);
          setColourAccent(c.accent || preset.colours.accent);
          setColourCard(c.card || preset.colours.card);
          setColourCardForeground(
            c.cardForeground || preset.colours.cardForeground
          );
        }
      } catch {
        /* ignore */
      }

      toast.success(
        `${preset.name || themeId} applied — homepage layout unchanged${
          currentSite?.slug ? ` on /s/${currentSite.slug}` : ""
        }.\nHard-refresh the public site (Ctrl+Shift+R).`,
      );
    } catch (error) {
      console.error("Failed to update theme:", error);
      toast.error("Failed to set up theme. Is a site selected?");
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
      toast.success(`${preset.name} pack saved. Click Activate when you want it live.`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to set up theme pack.");
    } finally {
      setSetupThemeId(null);
    }
  };

  const saveHeaderSettings = async () => {
    setIsSavingHeader(true);
    try {
      // Store relative /uploads path so public site rewrite can serve it
      const logoPath = normalizeMediaPath(headerLogo) || usableLogoUrl(headerLogo) || headerLogo || null;
      const headerSettings = {
        headerBg,
        headerFont,
        headerHeight,
        headerMobileHeight,
        headerLogo: logoPath,
        headerAlt,
        navLinks,
        ctaText,
        ctaUrl,
        ctaBg,
        ctaColor
      };
      const themeId = activeTheme || "default";
      await api.updateSetting("site_header", headerSettings);
      await api.updateSetting(`theme_${themeId}_header`, headerSettings);
      // Keep site.logo in sync so public shell resolves logo even without theme header key
      if (currentSiteId && logoPath && !logoPath.startsWith("blob:")) {
        try {
          await api.updateSite(currentSiteId, { logo: logoPath });
        } catch (syncErr) {
          console.warn("Header saved but site.logo sync failed:", syncErr);
        }
      }
      if (logoPath) setHeaderLogo(logoPath);
      toast.success("Header settings updated successfully!");
    } catch (error) {
      console.error("Failed to save header settings:", error);
      toast.error("Failed to save header settings.");
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
      toast.warning("Logo file size must be less than 2MB");
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
          const rawUrl = extractUploadedMediaUrl(uploaded) || "";
          // Keep relative /uploads for storage; resolve only for display if needed
          const stored = normalizeMediaPath(rawUrl) || rawUrl;
          const fullUrl = resolveAdminMediaUrl(stored) || stored;
          setHeaderLogo(stored || fullUrl);
        } catch {
          // Fallback: local preview only — must re-upload before save for public site
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
      toast.warning("Footer logo file size must be less than 2MB");
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
          const rawUrl = extractUploadedMediaUrl(uploaded) || "";
          const stored = normalizeMediaPath(rawUrl) || rawUrl;
          setFooterLogo(stored);
        } catch {
          // Fallback: local preview only — re-upload before save for public site
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

  const saveHomeLayout = async (
    next?: ThemePreset["homeStyle"],
    options?: { silent?: boolean },
  ) => {
    const value = next || homeLayout;
    setIsSavingHomeLayout(true);
    setHomeLayoutMsg(null);
    try {
      setHomeLayout(value);
      // If form is still empty, persist layout demo so public + Appearance stay aligned
      let eyebrow = homeEyebrow.trim();
      let tagline = homeTagline.trim();
      let featuredEyebrow = homeFeaturedEyebrow.trim();
      let featuredTitle = homeFeaturedTitle.trim();
      let sideRailLabel = homeSideRailLabel.trim();
      let pillarsEyebrow = homePillarsEyebrow.trim();
      let pillarsTitle = homePillarsTitle.trim();
      let pillarsBody = homePillarsBody.trim();
      let pillarsRows = homePillars.map((p) => ({
        title: p.title.trim(),
        body: p.body.trim(),
      }));
      let latestEyebrow = homeLatestEyebrow.trim();
      let latestTitle = homeLatestTitle.trim();
      let ctaEyebrow = homeCtaEyebrow.trim();
      let ctaTitle = homeCtaTitle.trim();
      let ctaBody = homeCtaBody.trim();
      let ctaButton = homeCtaButton.trim();
      let captionLeft = homeCaptionLeft.trim();
      let captionRight = homeCaptionRight.trim();

      const formEmpty =
        !eyebrow &&
        !tagline &&
        !featuredTitle &&
        !pillarsTitle &&
        !pillarsRows.some((p) => p.title || p.body) &&
        !ctaTitle;

      if (formEmpty) {
        const demo = getHomeDemoContent(value, siteName);
        eyebrow = demo.eyebrow;
        tagline = demo.tagline;
        captionLeft = demo.captionLeft;
        captionRight = demo.captionRight;
        featuredEyebrow = demo.featuredEyebrow;
        featuredTitle = demo.featuredTitle;
        sideRailLabel = demo.sideRailLabel;
        pillarsEyebrow = demo.pillarsEyebrow;
        pillarsTitle = demo.pillarsTitle;
        pillarsBody = demo.pillarsBody;
        pillarsRows = demo.pillars.map((p) => ({
          title: p.title,
          body: p.body,
        }));
        latestEyebrow = demo.latestEyebrow;
        latestTitle = demo.latestTitle;
        ctaEyebrow = demo.ctaEyebrow;
        ctaTitle = demo.ctaTitle;
        ctaBody = demo.ctaBody;
        ctaButton = demo.ctaButton;
        applyHomeDemoToForm(value, { force: true });
      }

      const pillarsPayload = pillarsRows
        .map((p) => ({
          title: p.title || null,
          body: p.body || null,
        }))
        .filter((p) => p.title || p.body);

      const heroTitleVal = homeHeroTitle.trim() || null;
      await api.updateSetting("home_layout", {
        homeStyle: value,
        // Layout 2 hero title also stored as eyebrow for public layouts that use it
        eyebrow: heroTitleVal || eyebrow || null,
        tagline: tagline || null,
        heroTitle: heroTitleVal,
        heroImage: homeHeroImage.trim() || null,
        captionLeft: captionLeft || null,
        captionRight: captionRight || null,
        featuredEyebrow: featuredEyebrow || null,
        featuredTitle: featuredTitle || null,
        sideRailLabel: sideRailLabel || null,
        pillarsEyebrow: pillarsEyebrow || null,
        pillarsTitle: pillarsTitle || null,
        pillarsBody: pillarsBody || null,
        pillars: pillarsPayload.length > 0 ? pillarsPayload : null,
        latestEyebrow: latestEyebrow || null,
        latestTitle: latestTitle || null,
        ctaEyebrow: ctaEyebrow || null,
        ctaTitle: ctaTitle || null,
        ctaBody: ctaBody || null,
        ctaButton: ctaButton || null,
        ctaBackgroundImage: homeCtaBgImage.trim() || null,
        // Layout 6 · Paper portfolio
        socialLinks: homeSocialLinks.length
          ? homeSocialLinks.map((s) => ({
              id: s.id,
              platform: s.platform,
              url: s.url,
            }))
          : null,
        contactEmail: homeContactEmail.trim() || null,
        contactPhone: homeContactPhone.trim() || null,
        contactAddress: homeContactAddress.trim() || null,
        aboutTitle: homeAboutTitle.trim() || null,
        aboutDescription: homeAboutDescription.trim() || null,
        aboutImage: homeAboutImage.trim() || null,
        services: homeServices.length
          ? homeServices.map((s) => ({
              id: s.id,
              icon: s.icon || null,
              title: s.title,
              description: s.description,
            }))
          : null,
        videoUrl: homeVideoUrl.trim() || null,
        videoThumbnail: homeVideoThumb.trim() || null,
        testimonials: homeTestimonials.length
          ? homeTestimonials.map((t) => ({
              id: t.id,
              image: t.image || null,
              name: t.name,
              role: t.role,
              review: t.review,
            }))
          : null,
        clients: homeClients.length
          ? homeClients.map((c) => ({
              id: c.id,
              logo: c.logo || null,
              name: c.name,
            }))
          : null,
      });
      const label =
        HOME_LAYOUT_OPTIONS.find((o) => o.id === value)?.name || value;
      const msg = `Saved: ${label}. Home copy is now editable anytime in this form.`;
      setHomeLayoutMsg(msg);
      if (!options?.silent) {
        toast.success(msg);
      }
    } catch (error) {
      console.error("Failed to save home layout:", error);
      setHomeLayoutMsg("Failed to save. Select a site and try again.");
      if (!options?.silent) {
        toast.error("Failed to save home layout. Select a site and try again.");
      }
      // Always rethrow so applyLayout / callers know save failed
      throw error;
    } finally {
      setIsSavingHomeLayout(false);
    }
  };

  const uploadHomeImage = async (
    file: File,
    target: "hero" | "cta",
  ): Promise<void> => {
    if (!file.type.startsWith("image/")) {
      toast.warning("Please choose an image file (PNG, JPG or WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.warning("Image must be max 5MB.");
      return;
    }
    if (target === "hero") setIsUploadingHomeHero(true);
    else setIsUploadingCtaBg(true);
    try {
      const reader = new FileReader();
      const base64Data: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
      const uploaded = await api.uploadMedia({
        name: file.name,
        type: file.type,
        size: String(file.size),
        base64Data,
      });
      const raw = extractUploadedMediaUrl(uploaded) || "";
      const url = normalizeMediaPath(raw) || raw;
      if (!url) throw new Error("No URL returned from upload");
      if (target === "hero") setHomeHeroImage(url);
      else setHomeCtaBgImage(url);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Image upload failed.");
    } finally {
      if (target === "hero") setIsUploadingHomeHero(false);
      else setIsUploadingCtaBg(false);
    }
  };

  const handleHomeHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadHomeImage(file, "hero");
    e.target.value = "";
  };

  const handleCtaBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadHomeImage(file, "cta");
    e.target.value = "";
  };

  const uploadLayout6Image = async (
    file: File,
    target: "about" | "service" | "video" | "testimonial" | "client",
  ) => {
    if (!file.type.startsWith("image/")) {
      toast.warning("Please choose an image file (PNG, JPG or WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.warning("Image must be max 5MB.");
      return;
    }
    setIsUploadingLayout6(true);
    try {
      const reader = new FileReader();
      const base64Data: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
      const uploaded = await api.uploadMedia({
        name: file.name,
        type: file.type,
        size: String(file.size),
        base64Data,
      });
      const raw = extractUploadedMediaUrl(uploaded) || "";
      const url = normalizeMediaPath(raw) || raw;
      if (!url) throw new Error("No URL returned from upload");
      if (target === "about") setHomeAboutImage(url);
      if (target === "service") setNewServiceIcon(url);
      if (target === "video") setHomeVideoThumb(url);
      if (target === "testimonial") setNewTestImage(url);
      if (target === "client") setNewClientLogo(url);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Image upload failed.");
    } finally {
      setIsUploadingLayout6(false);
      setLayout6UploadTarget(null);
    }
  };

  const handleLayout6File = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = layout6UploadTarget;
    if (file && target) await uploadLayout6Image(file, target);
    e.target.value = "";
  };

  const pickLayout6Upload = (
    target: "about" | "service" | "video" | "testimonial" | "client",
  ) => {
    setLayout6UploadTarget(target);
    requestAnimationFrame(() => layout6FileRef.current?.click());
  };

  const saveFooterSettings = async () => {
    setIsSavingFooter(true);
    try {
      const logoPath =
        normalizeMediaPath(footerLogo) ||
        usableLogoUrl(footerLogo) ||
        footerLogo ||
        null;
      const footerSettings = {
        footerBg,
        footerFont,
        footerPadding,
        footerMobilePadding,
        footerLogo: logoPath,
        footerAlt,
        footerDescription,
        quickLinks,
        socialLinks,
        copyrightText,
      };
      const themeId = activeTheme || "default";
      await api.updateSetting("site_footer", footerSettings);
      await api.updateSetting(`theme_${themeId}_footer`, footerSettings);
      if (logoPath) setFooterLogo(logoPath);
      toast.success("Footer settings updated successfully!");
    } catch (error) {
      console.error("Failed to save footer settings:", error);
      toast.error("Failed to save footer settings.");
    } finally {
      setIsSavingFooter(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading Themes...</div>;
  }

  const activeThemeName = THEMES.find(t => t.id === activeTheme)?.name || "Default";
  const activeLayoutName =
    HOME_LAYOUT_OPTIONS.find((o) => o.id === homeLayout)?.name || homeLayout;

  const openHomeContentEditor = async (layoutId?: ThemePreset["homeStyle"]) => {
    const optId = layoutId || homeLayout || "classic";
    setEditingHomeLayout(optId);
    setHomeLayout(optId);
    try {
      const home = await api.getSetting("home_layout");
      setHomeHeroImage((home && home.heroImage) || "");
      setHomeCtaBgImage((home && home.ctaBackgroundImage) || "");
      applyHomeDemoToForm(optId, {
        force: false,
        base: home && typeof home === "object" ? home : null,
      });
      // Prefer saved heroTitle / eyebrow (breadcrumb), then ctaTitle
      if (home?.heroTitle) setHomeHeroTitle(String(home.heroTitle));
      else if (home?.eyebrow) setHomeHeroTitle(String(home.eyebrow));
      else if (home?.ctaTitle) setHomeHeroTitle(String(home.ctaTitle));
      if (home?.tagline) setHomeTagline(String(home.tagline));
      if (home?.ctaTitle) setHomeCtaTitle(String(home.ctaTitle));
      if (home?.ctaBody) setHomeCtaBody(String(home.ctaBody));
      // Layout 6 portfolio fields
      if (Array.isArray(home?.socialLinks)) {
        setHomeSocialLinks(
          home.socialLinks.map((s: any, i: number) => ({
            id: Number(s.id) || Date.now() + i,
            platform: String(s.platform || ""),
            url: String(s.url || ""),
          })),
        );
      } else {
        setHomeSocialLinks([]);
      }
      if (home?.contactEmail != null)
        setHomeContactEmail(String(home.contactEmail));
      else if (optId === "paper") setHomeContactEmail("support@gmail.com");
      if (home?.contactPhone != null)
        setHomeContactPhone(String(home.contactPhone));
      else if (optId === "paper") setHomeContactPhone("+11 4551451");
      if (home?.contactAddress != null)
        setHomeContactAddress(String(home.contactAddress));
      else if (optId === "paper") setHomeContactAddress("12, London");
      if (home?.aboutTitle != null) setHomeAboutTitle(String(home.aboutTitle));
      else if (optId === "paper")
        setHomeAboutTitle("I take your finance to next level");
      if (home?.aboutDescription != null)
        setHomeAboutDescription(String(home.aboutDescription));
      else if (optId === "paper")
        setHomeAboutDescription("With a strong focus on strategy and clarity…");
      setHomeAboutImage(home?.aboutImage ? String(home.aboutImage) : "");
      if (Array.isArray(home?.services)) {
        setHomeServices(
          home.services.map((s: any, i: number) => ({
            id: Number(s.id) || Date.now() + i,
            icon: String(s.icon || ""),
            title: String(s.title || ""),
            description: String(s.description || ""),
          })),
        );
      } else setHomeServices([]);
      setHomeVideoUrl(home?.videoUrl ? String(home.videoUrl) : "");
      setHomeVideoThumb(home?.videoThumbnail ? String(home.videoThumbnail) : "");
      if (Array.isArray(home?.testimonials)) {
        setHomeTestimonials(
          home.testimonials.map((t: any, i: number) => ({
            id: Number(t.id) || Date.now() + i,
            image: String(t.image || ""),
            name: String(t.name || ""),
            role: String(t.role || ""),
            review: String(t.review || ""),
          })),
        );
      } else setHomeTestimonials([]);
      if (Array.isArray(home?.clients)) {
        setHomeClients(
          home.clients.map((c: any, i: number) => ({
            id: Number(c.id) || Date.now() + i,
            logo: String(c.logo || ""),
            name: String(c.name || ""),
          })),
        );
      } else setHomeClients([]);
      // Portfolio defaults for Layout 6 hero
      if (optId === "paper") {
        if (!home?.heroTitle && !home?.eyebrow)
          setHomeHeroTitle("Adam Buschemi a Finance Consultant");
        if (!home?.tagline)
          setHomeTagline(
            "Dedicated to delivering personalized financial advice that aligns with your goals…",
          );
      }
      const hasCustom =
        home &&
        (home.heroTitle ||
          home.tagline ||
          home.eyebrow ||
          home.ctaTitle ||
          home.aboutTitle ||
          home.featuredTitle ||
          home.pillarsTitle ||
          (Array.isArray(home.pillars) &&
            home.pillars.some((p: any) => p?.title || p?.body)));
      if (!hasCustom && optId !== "paper") {
        applyHomeDemoToForm(optId, { force: true });
      }
    } catch {
      applyHomeDemoToForm(optId, { force: true });
      if (optId === "paper") {
        setHomeHeroTitle("Adam Buschemi a Finance Consultant");
        setHomeTagline(
          "Dedicated to delivering personalized financial advice that aligns with your goals…",
        );
        setHomeContactEmail("support@gmail.com");
        setHomeContactPhone("+11 4551451");
        setHomeContactAddress("12, London");
        setHomeAboutTitle("I take your finance to next level");
        setHomeAboutDescription("With a strong focus on strategy and clarity…");
      }
    }
    setHomeEditOpen(true);
  };

  /**
   * Apply a home layout live — structure + copy only.
   * Colours stay from Appearance → Colours / Theme (never overwritten here).
   */
  const applyLayout = async (opt: (typeof HOME_LAYOUT_OPTIONS)[number]) => {
    if (!currentSite) {
      toast.warning("Select a site first.");
      return;
    }
    setIsSavingHomeLayout(true);
    setHomeLayout(opt.id);
    setHomeLayoutMsg(null);
    try {
      // Persist homeStyle + layout demo copy only (keep existing hero/cta images)
      const existing = await api.getSetting("home_layout");
      const base =
        existing && typeof existing === "object" && !Array.isArray(existing)
          ? (existing as Record<string, unknown>)
          : {};
      const demo = getHomeDemoContent(opt.id, siteName);
      const payload = {
        ...base,
        homeStyle: opt.id,
        eyebrow: demo.eyebrow,
        tagline: demo.tagline,
        heroTitle: demo.eyebrow || demo.ctaTitle || null,
        heroImage: (base.heroImage as string) || null,
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
        ctaBackgroundImage: (base.ctaBackgroundImage as string) || null,
      };
      await api.updateSetting("home_layout", payload);

      // Verify read-back so we never show success when save missed site context
      const verify = await api.getSetting("home_layout");
      const savedStyle =
        (verify && typeof verify === "object" && (verify.homeStyle || verify.layout)) ||
        null;
      if (savedStyle !== opt.id) {
        throw new Error(
          `Layout did not save (got “${savedStyle || "empty"}”). Make sure a site is selected and try again.`,
        );
      }

      // Sync edit form to what is now live
      applyHomeDemoToForm(opt.id, { force: true, base: payload as any });
      setHomeHeroImage((payload.heroImage as string) || "");
      setHomeCtaBgImage((payload.ctaBackgroundImage as string) || "");

      const livePath = currentSite.slug ? `/s/${currentSite.slug}` : null;
      setHomeLayoutMsg(
        livePath
          ? `“${opt.name}” layout is live on ${livePath}. Colours stay from the Colours tab. Hard-refresh (Ctrl+Shift+R).`
          : `“${opt.name}” layout is live. Colours stay from the Colours tab. Hard-refresh (Ctrl+Shift+R).`,
      );
    } catch (e) {
      console.error(e);
      const msg =
        e instanceof Error
          ? e.message
          : "Failed to apply layout. Is a site selected?";
      setHomeLayoutMsg(msg);
      toast.error(msg);
    } finally {
      setIsSavingHomeLayout(false);
    }
  };

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-20 px-4 sm:px-6 relative">
      {/* Page header — matches product Appearance shell */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Appearance
          </h1>
          <p className="text-gray-500 mt-1">
            Customize the look and feel of your blog — themes, home layout, and
            chrome.
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

      {/* Live status */}
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Theme
          </span>
          <span className="font-bold text-slate-900 truncate">
            {activeThemeName}
          </span>
        </div>
        <div className="hidden sm:block h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Home layout
          </span>
          <span className="font-bold text-slate-900 truncate">
            {activeLayoutName}
          </span>
        </div>
        <div className="sm:ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => openHomeContentEditor()}
            className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit home copy
          </button>
          {currentSite?.slug ? (
            <Link
              href={`/s/${currentSite.slug}`}
              target="_blank"
              className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </Link>
          ) : null}
        </div>
      </div>

      {/* Home layout Edit window — Hero + CTA (dev.corehead.app style) */}
      {homeEditOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => !isSavingHomeLayout && setHomeEditOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="home-edit-title"
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-white">
              <div>
                <h3 id="home-edit-title" className="text-lg font-bold text-slate-900">
                  {HOME_LAYOUT_OPTIONS.find((o) => o.id === (editingHomeLayout || homeLayout))
                    ?.name || "Homepage"}
                </h3>
                <p className="text-sm text-slate-500">
                  Configure the homepage content for this layout
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHomeEditOpen(false)}
                disabled={isSavingHomeLayout}
                className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {(() => {
                const editStyle = editingHomeLayout || homeLayout;
                const isHeroOnly =
                  editStyle === "bloom" || editStyle === "nature";
                const isCtaOnly = editStyle === "bento"; // Layout 4
                const isPaper = editStyle === "paper"; // Layout 6 portfolio

                const inputCls =
                  "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500";
                const cardCls =
                  "rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 space-y-5 shadow-sm";
                const addBtnCls =
                  "w-full h-11 rounded-xl bg-blue-400 hover:bg-blue-500 text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors";
                const emptyBoxCls =
                  "rounded-xl border border-dashed border-slate-200 bg-slate-50 min-h-[100px] flex flex-col items-center justify-center gap-2 text-slate-400 text-sm";

                return (
                  <>
              {/* ── Layout 6 · Paper full portfolio form ───── */}
              {isPaper && (
                <>
                  <section className={cardCls}>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Hero Section</h4>
                      <p className="text-sm text-slate-500 mt-1">
                        Configure the main hero section of your homepage
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Hero Title</label>
                      <input
                        type="text"
                        value={homeHeroTitle}
                        onChange={(e) => {
                          setHomeHeroTitle(e.target.value);
                          setHomeEyebrow(e.target.value);
                        }}
                        placeholder="Adam Buschemi a Finance Consultant"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Hero Subtitle</label>
                      <textarea
                        rows={3}
                        value={homeTagline}
                        onChange={(e) => setHomeTagline(e.target.value)}
                        placeholder="Dedicated to delivering personalized financial advice that aligns with your goals…"
                        className={cn(inputCls, "resize-none")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1">Hero Image</label>
                      <p className="text-sm text-slate-500 mb-3">
                        Upload an image for hero section (Side Image – max 5MB)
                      </p>
                      <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 min-h-[160px] flex flex-col items-center justify-center gap-3 p-6">
                        {homeHeroImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={resolveAdminMediaUrl(homeHeroImage) || homeHeroImage} alt="Hero" className="max-h-36 w-auto object-contain rounded-lg" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                            <Upload className="w-5 h-5 text-blue-500" />
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <input ref={homeHeroInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleHomeHeroUpload} />
                          <button type="button" disabled={isUploadingHomeHero || !currentSite} onClick={() => homeHeroInputRef.current?.click()} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold shadow-sm disabled:opacity-50">
                            {isUploadingHomeHero ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                            Upload Image
                          </button>
                          <button type="button" disabled={!currentSite} onClick={() => setHomeMediaTarget("hero")} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold shadow-sm disabled:opacity-50">
                            <ImageIcon className="w-4 h-4" /> Media Library
                          </button>
                        </div>
                        <p className="text-xs text-slate-400">PNG, JPG or WebP (max 5MB)</p>
                        {homeHeroImage ? (
                          <button type="button" onClick={() => setHomeHeroImage("")} className="text-xs font-semibold text-red-500 hover:underline">Remove image</button>
                        ) : null}
                      </div>
                    </div>
                  </section>

                  <section className={cardCls}>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Social Media Links</h4>
                      <p className="text-sm text-slate-500 mt-1">Add social media profiles for the homepage</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-3">Add Social Media</p>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Platform Name</label>
                      <select
                        value={homeNewSocialPlatform}
                        onChange={(e) => setHomeNewSocialPlatform(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Select a platform</option>
                        {["Facebook", "Twitter", "Instagram", "LinkedIn", "YouTube", "TikTok"].map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Profile URL</label>
                      <input
                        type="url"
                        value={homeNewSocialUrl}
                        onChange={(e) => setHomeNewSocialUrl(e.target.value)}
                        placeholder="https://twitter.com/username"
                        className={inputCls}
                      />
                    </div>
                    <button
                      type="button"
                      className={addBtnCls}
                      onClick={() => {
                        if (!homeNewSocialPlatform || !homeNewSocialUrl.trim()) {
                          toast.warning("Select a platform and enter a profile URL.");
                          return;
                        }
                        setHomeSocialLinks((prev) => [
                          ...prev,
                          {
                            id: Date.now(),
                            platform: homeNewSocialPlatform,
                            url: homeNewSocialUrl.trim(),
                          },
                        ]);
                        setHomeNewSocialPlatform("");
                        setHomeNewSocialUrl("");
                      }}
                    >
                      <Plus className="w-4 h-4" /> Add Social Media
                    </button>
                    {homeSocialLinks.length === 0 ? (
                      <div className={emptyBoxCls}>
                        <Share2 className="w-8 h-8 opacity-40" />
                        <span>No social media links added yet</span>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {homeSocialLinks.map((s) => (
                          <li key={s.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 px-4 py-3 text-sm">
                            <span className="font-semibold text-slate-800">{s.platform}</span>
                            <span className="text-slate-500 truncate flex-1 text-right">{s.url}</span>
                            <button type="button" className="text-red-500 text-xs font-bold" onClick={() => setHomeSocialLinks((p) => p.filter((x) => x.id !== s.id))}>Remove</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <section className={cardCls}>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Contact Information</h4>
                      <p className="text-sm text-slate-500 mt-1">Add contact details for the homepage</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                      <input type="email" value={homeContactEmail} onChange={(e) => setHomeContactEmail(e.target.value)} placeholder="support@gmail.com" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                      <input type="text" value={homeContactPhone} onChange={(e) => setHomeContactPhone(e.target.value)} placeholder="+11 4551451" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Company Address</label>
                      <input type="text" value={homeContactAddress} onChange={(e) => setHomeContactAddress(e.target.value)} placeholder="12, London" className={inputCls} />
                    </div>
                  </section>

                  <section className={cardCls}>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">About Us Section</h4>
                      <p className="text-sm text-slate-500 mt-1">Configure the about us section of your homepage</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">About Us Title</label>
                      <input type="text" value={homeAboutTitle} onChange={(e) => setHomeAboutTitle(e.target.value)} placeholder="I take your finance to next level" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">About Us Description</label>
                      <textarea rows={3} value={homeAboutDescription} onChange={(e) => setHomeAboutDescription(e.target.value)} placeholder="With a strong focus on strategy and clarity…" className={cn(inputCls, "resize-none")} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1">About Us Image</label>
                      <p className="text-sm text-slate-500 mb-3">Upload an image for the about us section (max 5MB)</p>
                      <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 min-h-[140px] flex flex-col items-center justify-center gap-3 p-6">
                        {homeAboutImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={resolveAdminMediaUrl(homeAboutImage) || homeAboutImage} alt="About" className="max-h-32 w-auto object-contain rounded-lg" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center"><Upload className="w-5 h-5 text-blue-500" /></div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <button type="button" disabled={isUploadingLayout6 || !currentSite} onClick={() => pickLayout6Upload("about")} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold shadow-sm disabled:opacity-50">
                            <Camera className="w-4 h-4" /> Upload Image
                          </button>
                          <button type="button" disabled={!currentSite} onClick={() => setHomeMediaTarget("about")} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold shadow-sm disabled:opacity-50">
                            <ImageIcon className="w-4 h-4" /> Media Library
                          </button>
                        </div>
                        <p className="text-xs text-slate-400">PNG, JPG or WebP (max 5MB)</p>
                      </div>
                    </div>
                  </section>

                  <section className={cardCls}>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Services</h4>
                      <p className="text-sm text-slate-500 mt-1">Add services to showcase on the homepage</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Add Service</p>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Service Icon</label>
                      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50">
                        <button type="button" disabled={!currentSite} onClick={() => pickLayout6Upload("service")} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold shadow-sm">
                          <Camera className="w-4 h-4" /> Upload Icon
                        </button>
                        <button type="button" disabled={!currentSite} onClick={() => setHomeMediaTarget("service")} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold shadow-sm">
                          <ImageIcon className="w-4 h-4" /> Media Library
                        </button>
                        {newServiceIcon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={resolveAdminMediaUrl(newServiceIcon) || newServiceIcon} alt="" className="h-10 w-10 object-contain rounded-lg border" />
                        ) : null}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Title</label>
                      <input type="text" value={newServiceTitle} onChange={(e) => setNewServiceTitle(e.target.value)} placeholder="e.g., Audit" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
                      <textarea rows={2} value={newServiceDesc} onChange={(e) => setNewServiceDesc(e.target.value)} placeholder="This is a service." className={cn(inputCls, "resize-none")} />
                    </div>
                    <button
                      type="button"
                      className={addBtnCls}
                      onClick={() => {
                        if (!newServiceTitle.trim()) {
                          toast.warning("Enter a service title.");
                          return;
                        }
                        setHomeServices((p) => [
                          ...p,
                          {
                            id: Date.now(),
                            icon: newServiceIcon,
                            title: newServiceTitle.trim(),
                            description: newServiceDesc.trim(),
                          },
                        ]);
                        setNewServiceIcon("");
                        setNewServiceTitle("");
                        setNewServiceDesc("This is a service.");
                      }}
                    >
                      <Plus className="w-4 h-4" /> Add Service
                    </button>
                    {homeServices.length === 0 ? (
                      <div className={emptyBoxCls}>
                        <Briefcase className="w-8 h-8 opacity-40" />
                        <span>No services added yet</span>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {homeServices.map((s) => (
                          <li key={s.id} className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3 text-sm">
                            {s.icon ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={resolveAdminMediaUrl(s.icon) || s.icon} alt="" className="h-8 w-8 object-contain" />
                            ) : null}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900">{s.title}</p>
                              <p className="text-slate-500 truncate">{s.description}</p>
                            </div>
                            <button type="button" className="text-red-500 text-xs font-bold" onClick={() => setHomeServices((p) => p.filter((x) => x.id !== s.id))}>Remove</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <section className={cardCls}>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Introduction Video</h4>
                      <p className="text-sm text-slate-500 mt-1">Add an introduction video and its thumbnail image</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Video URL</label>
                      <input type="url" value={homeVideoUrl} onChange={(e) => setHomeVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" className={inputCls} />
                      <p className="text-xs text-slate-400 mt-1">Paste a YouTube or video embed URL</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-1">Video Thumbnail Image</label>
                      <p className="text-sm text-slate-500 mb-3">Upload a thumbnail for the video (max 5MB)</p>
                      <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 min-h-[140px] flex flex-col items-center justify-center gap-3 p-6">
                        {homeVideoThumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={resolveAdminMediaUrl(homeVideoThumb) || homeVideoThumb} alt="Thumb" className="max-h-32 w-auto object-contain rounded-lg" />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center"><Upload className="w-5 h-5 text-blue-500" /></div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <button type="button" disabled={!currentSite} onClick={() => pickLayout6Upload("video")} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold shadow-sm">
                            <Camera className="w-4 h-4" /> Upload Thumbnail
                          </button>
                          <button type="button" disabled={!currentSite} onClick={() => setHomeMediaTarget("video")} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold shadow-sm">
                            <ImageIcon className="w-4 h-4" /> Media Library
                          </button>
                        </div>
                        <p className="text-xs text-slate-400">PNG, JPG or WebP (max 5MB)</p>
                      </div>
                    </div>
                  </section>

                  <section className={cardCls}>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Testimonials</h4>
                      <p className="text-sm text-slate-500 mt-1">Add client testimonials to showcase on the homepage</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Add Testimonial</p>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Reviewer Image</label>
                      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50">
                        <button type="button" onClick={() => pickLayout6Upload("testimonial")} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold shadow-sm">
                          <Camera className="w-4 h-4" /> Upload Image
                        </button>
                        <button type="button" onClick={() => setHomeMediaTarget("testimonial")} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold shadow-sm">
                          <ImageIcon className="w-4 h-4" /> Media Library
                        </button>
                        {newTestImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={resolveAdminMediaUrl(newTestImage) || newTestImage} alt="" className="h-10 w-10 rounded-full object-cover" />
                        ) : null}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Name</label>
                        <input type="text" value={newTestName} onChange={(e) => setNewTestName(e.target.value)} placeholder="Christian" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">Role</label>
                        <input type="text" value={newTestRole} onChange={(e) => setNewTestRole(e.target.value)} placeholder="Director" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Review</label>
                      <textarea rows={2} value={newTestReview} onChange={(e) => setNewTestReview(e.target.value)} placeholder="This service is good" className={cn(inputCls, "resize-none")} />
                    </div>
                    <button
                      type="button"
                      className={addBtnCls}
                      onClick={() => {
                        if (!newTestName.trim() || !newTestReview.trim()) {
                          toast.warning("Enter name and review.");
                          return;
                        }
                        setHomeTestimonials((p) => [
                          ...p,
                          {
                            id: Date.now(),
                            image: newTestImage,
                            name: newTestName.trim(),
                            role: newTestRole.trim(),
                            review: newTestReview.trim(),
                          },
                        ]);
                        setNewTestImage("");
                        setNewTestName("Christian");
                        setNewTestRole("Director");
                        setNewTestReview("This service is good");
                      }}
                    >
                      <Plus className="w-4 h-4" /> Add Testimonial
                    </button>
                    {homeTestimonials.length === 0 ? (
                      <div className={emptyBoxCls}>
                        <Star className="w-8 h-8 opacity-40" />
                        <span>No testimonials added yet</span>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {homeTestimonials.map((t) => (
                          <li key={t.id} className="rounded-xl border border-slate-100 px-4 py-3 text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              {t.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={resolveAdminMediaUrl(t.image) || t.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                              ) : null}
                              <span className="font-semibold">{t.name}</span>
                              <span className="text-slate-400">· {t.role}</span>
                              <button type="button" className="ml-auto text-red-500 text-xs font-bold" onClick={() => setHomeTestimonials((p) => p.filter((x) => x.id !== t.id))}>Remove</button>
                            </div>
                            <p className="text-slate-600">{t.review}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  <section className={cardCls}>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Clients</h4>
                      <p className="text-sm text-slate-500 mt-1">Add client logos to showcase on the homepage</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Add Client</p>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Client Logo</label>
                      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50">
                        <button type="button" onClick={() => pickLayout6Upload("client")} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold shadow-sm">
                          <Camera className="w-4 h-4" /> Upload Logo
                        </button>
                        <button type="button" onClick={() => setHomeMediaTarget("client")} className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold shadow-sm">
                          <ImageIcon className="w-4 h-4" /> Media Library
                        </button>
                        {newClientLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={resolveAdminMediaUrl(newClientLogo) || newClientLogo} alt="" className="h-10 w-10 object-contain" />
                        ) : null}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Client Name</label>
                      <input type="text" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="Google" className={inputCls} />
                    </div>
                    <button
                      type="button"
                      className={addBtnCls}
                      onClick={() => {
                        if (!newClientName.trim()) {
                          toast.warning("Enter a client name.");
                          return;
                        }
                        setHomeClients((p) => [
                          ...p,
                          { id: Date.now(), logo: newClientLogo, name: newClientName.trim() },
                        ]);
                        setNewClientLogo("");
                        setNewClientName("Google");
                      }}
                    >
                      <Plus className="w-4 h-4" /> Add Client
                    </button>
                    {homeClients.length === 0 ? (
                      <div className={emptyBoxCls}>
                        <Users className="w-8 h-8 opacity-40" />
                        <span>No clients added yet</span>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {homeClients.map((c) => (
                          <li key={c.id} className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3 text-sm">
                            {c.logo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={resolveAdminMediaUrl(c.logo) || c.logo} alt="" className="h-8 w-8 object-contain" />
                            ) : null}
                            <span className="font-semibold flex-1">{c.name}</span>
                            <button type="button" className="text-red-500 text-xs font-bold" onClick={() => setHomeClients((p) => p.filter((x) => x.id !== c.id))}>Remove</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </>
              )}

              {/* Layout 1/2 — Hero only | Layout 4 — CTA only | others — both */}
              {!isCtaOnly && !isPaper && (
              <section className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Hero Section</h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Configure the main hero section of your homepage
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={homeHeroTitle}
                    onChange={(e) => {
                      setHomeHeroTitle(e.target.value);
                      setHomeEyebrow(e.target.value);
                    }}
                    placeholder="Home > What We Do"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={3}
                    value={homeTagline}
                    onChange={(e) => setHomeTagline(e.target.value)}
                    placeholder="Nature Is Essential For The Survival Of All Life On Earth. But It's Diminishing, Fast."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Hero Image
                  </label>
                  <p className="text-sm text-slate-500 mb-3">
                    Upload a background image for the hero section (max 5MB)
                  </p>
                  <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 min-h-[180px] flex flex-col items-center justify-center gap-3 p-6">
                    {homeHeroImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveAdminMediaUrl(homeHeroImage) || homeHeroImage}
                        alt="Hero"
                        className="max-h-40 w-auto object-contain rounded-lg"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-blue-500" />
                      </div>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <input
                        ref={homeHeroInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleHomeHeroUpload}
                      />
                      <button
                        type="button"
                        disabled={isUploadingHomeHero || !currentSite}
                        onClick={() => homeHeroInputRef.current?.click()}
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 shadow-sm"
                      >
                        {isUploadingHomeHero ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                        Upload Image
                      </button>
                      <button
                        type="button"
                        disabled={!currentSite}
                        onClick={() => setHomeMediaTarget("hero")}
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 shadow-sm"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Media Library
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">PNG, JPG or WebP (max 5MB)</p>
                    {homeHeroImage ? (
                      <button
                        type="button"
                        onClick={() => setHomeHeroImage("")}
                        className="text-xs font-semibold text-red-500 hover:underline"
                      >
                        Remove image
                      </button>
                    ) : null}
                  </div>
                </div>
              </section>
              )}

              {/* Layout 4 (bento): simple CTA Title only */}
              {isCtaOnly && (
              <section className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 space-y-5 shadow-sm">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">
                    Call to Action
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Configure the call-to-action text for your homepage
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    CTA Title
                  </label>
                  <input
                    type="text"
                    value={homeCtaTitle}
                    onChange={(e) => setHomeCtaTitle(e.target.value)}
                    placeholder="Subscribe for updates via newsletter"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </section>
              )}

              {/* Full CTA (portals / classic / etc.) — not layout 1, 2, 4, or 6 */}
              {!isHeroOnly && !isCtaOnly && !isPaper && (
              <section className="rounded-2xl border border-slate-100 bg-white p-6 space-y-5">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">
                    Call to Action Section
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Configure the call-to-action section of your homepage
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    CTA Title
                  </label>
                  <input
                    type="text"
                    value={homeCtaTitle}
                    onChange={(e) => setHomeCtaTitle(e.target.value)}
                    placeholder="Get Started Today"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    CTA Subtitle
                  </label>
                  <textarea
                    rows={3}
                    value={homeCtaBody}
                    onChange={(e) => setHomeCtaBody(e.target.value)}
                    placeholder="Join thousands of users who already trust us"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    CTA Background Image
                  </label>
                  <p className="text-sm text-slate-500 mb-3">
                    Upload a background image for the CTA section (max 5MB)
                  </p>
                  <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 min-h-[180px] flex flex-col items-center justify-center gap-3 p-6">
                    {homeCtaBgImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveAdminMediaUrl(homeCtaBgImage) || homeCtaBgImage}
                        alt="CTA background"
                        className="max-h-40 w-auto object-contain rounded-lg"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                      </div>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <input
                        ref={homeCtaBgInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleCtaBgUpload}
                      />
                      <button
                        type="button"
                        disabled={isUploadingCtaBg || !currentSite}
                        onClick={() => homeCtaBgInputRef.current?.click()}
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 shadow-sm"
                      >
                        {isUploadingCtaBg ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                        Upload Image
                      </button>
                      <button
                        type="button"
                        disabled={!currentSite}
                        onClick={() => setHomeMediaTarget("cta")}
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 shadow-sm"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Media Library
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">PNG, JPG or WebP (max 5MB)</p>
                    {homeCtaBgImage ? (
                      <button
                        type="button"
                        onClick={() => setHomeCtaBgImage("")}
                        className="text-xs font-semibold text-red-500 hover:underline"
                      >
                        Remove image
                      </button>
                    ) : null}
                  </div>
                </div>
              </section>
              )}
                  </>
                );
              })()}
            </div>

            <div className="sticky bottom-0 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-white/95 backdrop-blur">
              <button
                type="button"
                onClick={() => setHomeEditOpen(false)}
                disabled={isSavingHomeLayout}
                className="h-11 px-5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingHomeLayout || !currentSite}
                onClick={async () => {
                  const layoutId = editingHomeLayout || homeLayout;
                  try {
                    await saveHomeLayout(layoutId, { silent: true });
                    setHomeEditOpen(false);
                  } catch {
                    /* saveHomeLayout already shows error msg */
                  }
                }}
                className="h-11 px-6 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isSavingHomeLayout ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Save Homepage
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={layout6FileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleLayout6File}
      />

      <MediaLibraryModal
        isOpen={homeMediaTarget !== null}
        onClose={() => setHomeMediaTarget(null)}
        onSelect={(url) => {
          const path = normalizeMediaPath(url) || url;
          if (homeMediaTarget === "hero") setHomeHeroImage(path);
          if (homeMediaTarget === "cta") setHomeCtaBgImage(path);
          if (homeMediaTarget === "about") setHomeAboutImage(path);
          if (homeMediaTarget === "service") setNewServiceIcon(path);
          if (homeMediaTarget === "video") setHomeVideoThumb(path);
          if (homeMediaTarget === "testimonial") setNewTestImage(path);
          if (homeMediaTarget === "client") setNewClientLogo(path);
          setHomeMediaTarget(null);
        }}
      />

      <AppearanceThemeGallery
        activeTheme={activeTheme}
        busyThemeId={setupThemeId}
        disabled={activating || !currentSite}
        onActivate={(themeId) => void handleActivateTheme(themeId)}
        onCustomize={(themeId) => {
          const openCustomizer = () => {
            setActiveTab("colours");
            requestAnimationFrame(() => {
              document
                .getElementById("theme-customizer")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
          };
          if (themeId === activeTheme) openCustomizer();
          else void handleActivateTheme(themeId).then(openCustomizer);
        }}
      />

      {/* Legacy gallery retained temporarily for rollback; no longer rendered. */}
      {false && <section className="space-y-5">
        <div>
          <h2 className="text-xl font-black text-slate-900">Themes</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Choose a homepage look for your site. Click a card to activate —
            colours, header, footer, and home layout go live together.
          </p>
        </div>

        <div className="rounded-[1.75rem] bg-slate-100/80 p-4 sm:p-6 border border-slate-200/60">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {THEMES.map((theme) => {
              const isActive = theme.id === activeTheme;
              const isBusy =
                setupThemeId === theme.id || (activating && isActive);
              const preset = getThemePreset(theme.id);

              const goToEditWindow = () => {
                // Load this theme into the fine-tune panel (activate if needed first)
                if (!isActive) {
                  void handleActivateTheme(theme.id).then(() => {
                    setActiveTab("header");
                    requestAnimationFrame(() => {
                      document
                        .getElementById("theme-customizer")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    });
                  });
                } else {
                  setActiveTab("header");
                  document
                    .getElementById("theme-customizer")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              };

              return (
                <div
                  key={theme.id}
                  className={cn(
                    "group relative text-left rounded-2xl overflow-hidden border-2 bg-white shadow-md transition-all duration-300",
                    "hover:shadow-xl hover:-translate-y-0.5",
                    isActive
                      ? "border-blue-500 ring-2 ring-blue-200/80"
                      : "border-transparent hover:border-slate-200",
                  )}
                >
                  {/* Site mock preview */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-slate-200">
                    {/* Browser chrome strip */}
                    <div
                      className="absolute top-0 inset-x-0 z-[2] h-7 flex items-center gap-1.5 px-2.5 border-b border-black/5"
                      style={{
                        background: preset.header.headerBg || "#fff",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                      <span
                        className="ml-2 text-[9px] font-bold truncate opacity-80"
                        style={{ color: preset.header.headerFont || "#333" }}
                      >
                        CoreHead
                      </span>
                      <span
                        className="ml-auto h-4 w-10 rounded-full text-[8px] font-bold flex items-center justify-center"
                        style={{
                          background:
                            preset.header.ctaBg || preset.colours.primary,
                          color: preset.header.ctaColor || "#fff",
                        }}
                      >
                        Sign-In
                      </span>
                    </div>

                    <img
                      src={theme.preview}
                      alt={theme.name}
                      className="absolute inset-0 h-full w-full object-cover pt-7 transition-transform duration-500 group-hover:scale-[1.03]"
                    />

                    <div
                      className="absolute inset-0 pt-7 pointer-events-none opacity-25 mix-blend-multiply"
                      style={{
                        background: `linear-gradient(160deg, ${preset.colours.primary} 0%, transparent 55%)`,
                      }}
                    />

                    {/* Hover popup: Edit + Activate */}
                    <div className="absolute inset-0 z-[5] flex items-center justify-center gap-3 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                      <button
                        type="button"
                        disabled={activating || !!setupThemeId}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToEditWindow();
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
                      >
                        <Settings2 className="w-4 h-4" />
                        Edit
                      </button>
                      {!isActive && (
                        <button
                          type="button"
                          disabled={activating || !!setupThemeId}
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleActivateTheme(theme.id);
                          }}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-900/30 transition-transform hover:scale-[1.02] disabled:opacity-50"
                        >
                          {isBusy ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                          Activate
                        </button>
                      )}
                      {isActive && (
                        <button
                          type="button"
                          disabled={activating || !!setupThemeId}
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleActivateTheme(theme.id);
                          }}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-xl text-sm font-bold text-white hover:bg-slate-800 shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-50"
                        >
                          {isBusy ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          Re-apply
                        </button>
                      )}
                    </div>

                    {/* Eye preview */}
                    <button
                      type="button"
                      title="Preview image"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewThemeId(theme.id);
                        if (theme.id !== "theme-1") {
                          setPreviewImage(theme.preview);
                        }
                      }}
                      className="absolute top-10 left-3 z-10 p-2 bg-white/90 hover:bg-white rounded-full text-slate-600 shadow-md border border-slate-100"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <div className="absolute top-10 right-3 z-10 flex flex-col items-end gap-1">
                      {isBusy && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Editing
                        </span>
                      )}
                      {isActive && !isBusy && (
                        <span
                          className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg"
                          title="Active"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-black/80 via-black/45 to-transparent pt-16 pb-3.5 px-4 pointer-events-none">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-base font-black text-white drop-shadow">
                          {theme.name}
                        </h3>
                        {isActive && (
                          <span className="px-1.5 py-0.5 rounded-md bg-blue-500 text-white text-[9px] font-bold uppercase tracking-wide">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/85 leading-snug line-clamp-2 font-medium">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>}

      {/* ── Fine-tune customizer ──────────────────────────── */}
      <div id="theme-customizer" className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden scroll-mt-24">
        <div className="p-8 border-b border-gray-50 flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Settings2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Fine-tune: {activeThemeName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Theme styling and homepage structure are saved independently for{" "}
                <strong>{currentSite?.name || "this site"}</strong>
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-blue-100">
            Live
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-6 border-b border-gray-100 flex gap-2 sm:gap-4 overflow-x-auto">
          {["Header", "Colours", "Footer", "Fonts", "Homepage", "Post Layouts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={cn(
                "px-4 sm:px-6 py-3 rounded-t-2xl text-sm font-bold transition-all border border-b-0 whitespace-nowrap",
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

                <div className="grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <label htmlFor="header-height" className="text-sm font-bold text-gray-900">Desktop Height</label>
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{headerHeight}px</span>
                    </div>
                    <input
                      id="header-height"
                      type="range"
                      min="56"
                      max="120"
                      step="4"
                      value={headerHeight}
                      onChange={(e) => setHeaderHeight(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <p className="mt-2 text-xs text-gray-500">Controls the header height on tablets and desktop screens.</p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <label htmlFor="header-mobile-height" className="text-sm font-bold text-gray-900">Mobile Height</label>
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{headerMobileHeight}px</span>
                    </div>
                    <input
                      id="header-mobile-height"
                      type="range"
                      min="52"
                      max="88"
                      step="4"
                      value={headerMobileHeight}
                      onChange={(e) => setHeaderMobileHeight(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <p className="mt-2 text-xs text-gray-500">Keeps the mobile navigation compact and touch friendly.</p>
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
                    className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-6 transition-all"
                    style={{ backgroundColor: headerBg, color: headerFont, height: `${headerHeight}px` }}
                  >
                    {/* Logo Area */}
                    <div className="flex min-w-0 items-center gap-2 justify-self-start">
                      {headerLogo ? (
                        <img src={headerLogo} alt="Logo" className="block h-auto max-h-7 w-auto max-w-[120px] object-contain object-left" />
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
                    <div className="flex items-center justify-center gap-4 justify-self-center text-[10px] font-bold leading-none">
                      {navLinks.map((item) => (
                        <span key={item.id} className="inline-flex h-8 items-center whitespace-nowrap opacity-80 hover:opacity-100 cursor-pointer">
                          {item.name}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button 
                      className="inline-flex h-8 items-center justify-center justify-self-end rounded-full px-3.5 text-[10px] font-bold leading-none shadow-sm transition-all"
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

                <div className="grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <label htmlFor="footer-padding" className="text-sm font-bold text-gray-900">Desktop Vertical Spacing</label>
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{footerPadding}px</span>
                    </div>
                    <input
                      id="footer-padding"
                      type="range"
                      min="24"
                      max="96"
                      step="4"
                      value={footerPadding}
                      onChange={(e) => setFooterPadding(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <p className="mt-2 text-xs text-gray-500">Adds equal space above and below the desktop footer content.</p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <label htmlFor="footer-mobile-padding" className="text-sm font-bold text-gray-900">Mobile Vertical Spacing</label>
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{footerMobilePadding}px</span>
                    </div>
                    <input
                      id="footer-mobile-padding"
                      type="range"
                      min="20"
                      max="72"
                      step="4"
                      value={footerMobilePadding}
                      onChange={(e) => setFooterMobilePadding(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <p className="mt-2 text-xs text-gray-500">Controls footer spacing on phones without crowding content.</p>
                  </div>
                </div>

                <div
                  className="mt-6 border border-gray-100 rounded-2xl text-center transition-all"
                  style={{ backgroundColor: footerBg, color: footerFont, padding: `${Math.max(20, footerPadding / 2)}px 24px` }}
                >
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
                <p className="text-sm text-gray-500 mb-4">
                  Configure the <span className="text-blue-500">colour palette</span> for
                  your website. Click <strong>Save Colours</strong> to apply on the public
                  site.
                </p>
                {/* Live swatch preview */}
                <div
                  className="mb-8 rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
                  style={{ background: colourBackground, color: colourForeground }}
                >
                  <div
                    className="px-4 py-3 flex items-center justify-between text-sm font-bold"
                    style={{ background: headerBg, color: headerFont }}
                  >
                    <span>Header preview</span>
                    <span
                      className="px-3 py-1 rounded-full text-xs"
                      style={{ background: colourPrimary, color: colourDarkForeground || "#fff" }}
                    >
                      Primary CTA
                    </span>
                  </div>
                  <div className="p-4 text-sm">
                    Body uses background / foreground.{" "}
                    <span style={{ color: colourPrimary }} className="font-bold">
                      Links use primary
                    </span>
                    .
                  </div>
                  <div
                    className="px-4 py-2 text-xs"
                    style={{ background: footerBg, color: footerFont }}
                  >
                    Footer preview
                  </div>
                </div>

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

          {activeTab === "homepage" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    Homepage layouts
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xl">
                    Choose the home page structure only on{" "}
                    <code className="text-xs bg-slate-100 px-1 rounded">
                      /s/{currentSite?.slug || "your-site"}
                    </code>
                    . Colours stay in the{" "}
                    <strong className="text-gray-700">Colours</strong> tab.
                    Active:{" "}
                    <strong className="text-gray-800">{activeLayoutName}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openHomeContentEditor()}
                  disabled={!currentSite}
                  className="h-10 px-4 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center gap-2 shrink-0"
                >
                  <Pencil className="w-4 h-4" />
                  Edit home copy
                </button>
              </div>

              {homeLayoutMsg ? (
                <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2">
                  {homeLayoutMsg}
                </p>
              ) : null}

              <AppearanceHomeLayoutGallery
                activeLayout={homeLayout}
                siteId={currentSite?.id}
                disabled={!currentSite || isSavingHomeLayout}
                onSelect={(layout) => applyLayout(layout)}
                onEdit={(layoutId) => openHomeContentEditor(layoutId)}
              />

              {/* Legacy inline cards retained temporarily for rollback. */}
              {false && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {HOME_LAYOUT_OPTIONS.map((opt) => {
                  const selected = homeLayout === opt.id;
                  const palette = getHomeLayoutPalette(opt.id);
                  return (
                    <div
                      key={opt.id}
                      className={cn(
                        "relative rounded-2xl border-2 p-4 transition-all bg-white flex flex-col",
                        selected
                          ? "border-emerald-600 shadow-md shadow-emerald-100"
                          : "border-slate-100 hover:border-slate-200 shadow-sm",
                      )}
                    >
                      {selected && (
                        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      )}
                      <div
                        className="rounded-xl overflow-hidden border border-black/5 mb-3 h-20 flex flex-col"
                        style={{ background: palette.colours.background }}
                      >
                        <div
                          className="h-5 shrink-0"
                          style={{ background: palette.header.headerBg }}
                        />
                        <div className="flex-1 flex items-center gap-1.5 px-2">
                          <span
                            className="h-2.5 w-8 rounded-full"
                            style={{ background: palette.colours.primary }}
                          />
                          <span
                            className="h-2 flex-1 rounded-full opacity-40"
                            style={{ background: palette.colours.foreground }}
                          />
                        </div>
                        <div
                          className="h-3 shrink-0"
                          style={{ background: palette.footer.footerBg }}
                        />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm pr-14 mb-1">
                        {opt.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed flex-1 mb-3">
                        {opt.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!currentSite || isSavingHomeLayout}
                          onClick={() => applyLayout(opt)}
                          className={cn(
                            "flex-1 h-9 rounded-xl text-xs font-bold transition-colors disabled:opacity-50",
                            selected
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-slate-900 text-white hover:bg-slate-800",
                          )}
                        >
                          {selected ? "Selected" : "Use layout"}
                        </button>
                        <button
                          type="button"
                          disabled={!currentSite}
                          title="Edit home copy"
                          onClick={() => openHomeContentEditor(opt.id)}
                          className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-emerald-700 disabled:opacity-50"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>}
            </div>
          )}

          {activeTab === "post layouts" && (
            <div className="animate-in fade-in duration-300">
              <AppearanceContentLayoutGallery siteId={currentSiteId} />
            </div>
          )}

          {activeTab !== "header" &&
            activeTab !== "footer" &&
            activeTab !== "fonts" &&
            activeTab !== "colours" &&
            activeTab !== "homepage" &&
            activeTab !== "post layouts" && (
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
