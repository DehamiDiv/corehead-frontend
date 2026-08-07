/**
 * Demo home copy by layout style.
 * Used to:
 * 1) Pre-fill Appearance → Home edit form (so owners can edit what they see)
 * 2) Fall back on the public home when home_layout fields are still empty
 */

import type { ThemePreset } from "@/lib/themePresets";

export type HomeDemoPillar = { title: string; body: string };

export type HomeDemoContent = {
  eyebrow: string;
  tagline: string;
  captionLeft: string;
  captionRight: string;
  featuredEyebrow: string;
  featuredTitle: string;
  sideRailLabel: string;
  pillarsEyebrow: string;
  pillarsTitle: string;
  pillarsBody: string;
  pillars: HomeDemoPillar[];
  latestEyebrow: string;
  latestTitle: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};

type HomeStyle = ThemePreset["homeStyle"] | string | null | undefined;

function normalizeStyle(style: HomeStyle): string {
  let s = String(style || "classic");
  if (s === "editorial") s = "nature";
  if (s === "agents") s = "portals";
  if (s === "dark") s = "studio";
  if (s === "magazine") s = "paper";
  if (s === "minimal") s = "glass";
  return s;
}

/**
 * Layout-specific demo strings (what the public home shows by default).
 * Edit these once — Appearance form + public site stay in sync.
 */
export function getHomeDemoContent(
  homeStyle: HomeStyle,
  siteName = "our site"
): HomeDemoContent {
  const style = normalizeStyle(homeStyle);
  const name = siteName || "our site";

  if (style === "nature") {
    return {
      eyebrow: "Home > What We Do",
      tagline:
        "Nature Is Essential For The Survival Of All Life On Earth. But It's Diminishing, Fast.",
      captionLeft: "New stories with beauty\nNature collections",
      captionRight: "Studio\n2026",
      featuredEyebrow: "This week",
      featuredTitle: "Featured stories",
      sideRailLabel: "More to explore",
      pillarsEyebrow: `Why ${name}`,
      pillarsTitle: "Grow with intention",
      pillarsBody:
        "Guides and stories for outdoor living, conservation, and beauty in the natural world.",
      pillars: [
        {
          title: "Grow greener",
          body: "Practical gardening and eco-living guides you can use this weekend.",
        },
        {
          title: "Protect wildlife",
          body: "Conservation stories and ethical ways to reconnect with the wild.",
        },
        {
          title: "See the planet",
          body: "Outdoor adventures and photography tips from the field.",
        },
      ],
      latestEyebrow: "Latest",
      latestTitle: "From the journal",
      ctaEyebrow: "Start reading",
      ctaTitle: "Home > What We Do",
      ctaBody:
        "Nature Is Essential For The Survival Of All Life On Earth. But It's Diminishing, Fast.",
      ctaButton: "Explore all posts",
    };
  }

  if (style === "bloom") {
    // Layout 2 · Wellness — hero content (Appearance edit window)
    return {
      eyebrow: "Home > What We Do",
      tagline:
        "Nature Is Essential For The Survival Of All Life On Earth. But It's Diminishing, Fast.",
      captionLeft: "",
      captionRight: "",
      featuredEyebrow: "Journal",
      featuredTitle: "Stories for softer days",
      sideRailLabel: "More to explore",
      pillarsEyebrow: "How we help",
      pillarsTitle: "Care that feels human",
      pillarsBody: "",
      pillars: [
        {
          title: "Individual therapy",
          body: "One-to-one sessions tailored to anxiety, stress, and life transitions.",
        },
        {
          title: "Group support",
          body: "Safe circles for connection, listening, and shared growth.",
        },
        {
          title: "Guided journaling",
          body: "Gentle prompts and reflective tools to meet yourself with kindness.",
        },
        {
          title: "Mindful routines",
          body: "Small daily practices that restore calm without overwhelm.",
        },
      ],
      latestEyebrow: "Latest",
      latestTitle: "From the journal",
      ctaEyebrow: "You are welcome here",
      // Used as Hero Title in the Layout 2 edit form
      ctaTitle: "Home > What We Do",
      ctaBody:
        "Nature Is Essential For The Survival Of All Life On Earth. But It's Diminishing, Fast.",
      ctaButton: "Explore the journal",
    };
  }

  if (style === "portals") {
    return {
      eyebrow: "Product · Platform · Builders",
      tagline: `Powering seamless flows and integrations for ${name} — make complex work simpler and enable builders to ship faster.`,
      captionLeft: "",
      captionRight: "",
      featuredEyebrow: "Insights",
      featuredTitle: "Latest from the lab",
      sideRailLabel: "More to explore",
      pillarsEyebrow: "Platform",
      pillarsTitle: "Built for complex work",
      pillarsBody:
        "Everything builders need to ship faster — without the operational drag.",
      pillars: [
        {
          title: "Seamless swaps",
          body: "Route complex flows in one action — less friction, more throughput.",
        },
        {
          title: "Historical data",
          body: "APIs and timelines that keep builders unblocked and informed.",
        },
        {
          title: "AI-ready stack",
          body: "Integrate intelligence where it matters without slowing shipping.",
        },
      ],
      latestEyebrow: "Latest",
      latestTitle: "From the journal",
      ctaEyebrow: "Get started",
      ctaTitle: `Simplifying ${name}'s most complex transactions`,
      ctaBody: "Ship faster with a stack built for complex workflows.",
      ctaButton: "Get started",
    };
  }

  if (style === "bento") {
    // Layout 4 · Bento — CTA-focused edit form
    return {
      eyebrow: "Mosaic · Stories · Product",
      tagline: `A modern mosaic of stories and product moments from ${name}.`,
      captionLeft: "",
      captionRight: "",
      featuredEyebrow: "Featured",
      featuredTitle: "Stories",
      sideRailLabel: "More",
      pillarsEyebrow: "Why us",
      pillarsTitle: "Built for modern readers",
      pillarsBody: "",
      pillars: [
        {
          title: "Thoughtful stories",
          body: "Clear writing on the topics that matter to your readers.",
        },
        {
          title: "Fresh perspectives",
          body: "Features and guides curated for a modern digital magazine.",
        },
        {
          title: "Built for your brand",
          body: "A fully branded public site — your name, logo, and voice.",
        },
      ],
      latestEyebrow: "Latest",
      latestTitle: "From the journal",
      ctaEyebrow: "Newsletter",
      ctaTitle: "Subscribe for updates via newsletter",
      ctaBody:
        "Browse the full archive of published stories, guides, and field notes.",
      ctaButton: "Subscribe",
    };
  }

  if (style === "studio") {
    return {
      eyebrow: "Studio · Collection",
      tagline: `A curated visual journal — frames and stories from ${name}.`,
      captionLeft: "",
      captionRight: "",
      featuredEyebrow: "Gallery",
      featuredTitle: "Selected works",
      sideRailLabel: "More",
      pillarsEyebrow: `Why ${name}`,
      pillarsTitle: "A magazine built for modern readers",
      pillarsBody:
        "Beautiful public pages, published stories only, and branding that feels like your own product.",
      pillars: [
        {
          title: "Thoughtful stories",
          body: "Clear writing on the topics that matter to your readers.",
        },
        {
          title: "Fresh perspectives",
          body: "Features and guides curated for a modern digital magazine.",
        },
        {
          title: "Built for your brand",
          body: "A fully branded public site — your name, logo, and voice.",
        },
      ],
      latestEyebrow: "Latest",
      latestTitle: "From the journal",
      ctaEyebrow: "Start reading",
      ctaTitle: `Stay with ${name}`,
      ctaBody: "Browse the full archive of published stories and frames.",
      ctaButton: "Enter the studio",
    };
  }

  if (style === "paper") {
    return {
      eyebrow: "The daily journal",
      tagline: `All the news and long reads that matter — ${name}.`,
      captionLeft: "",
      captionRight: "",
      featuredEyebrow: "Vol. 1",
      featuredTitle: "Front page",
      sideRailLabel: "Also today",
      pillarsEyebrow: "Also today",
      pillarsTitle: "Inside this edition",
      pillarsBody: "",
      pillars: [
        {
          title: "Thoughtful stories",
          body: "Clear writing on the topics that matter to your readers.",
        },
        {
          title: "Fresh perspectives",
          body: "Features and guides curated for a modern digital magazine.",
        },
        {
          title: "Built for your brand",
          body: "A fully branded public site — your name, logo, and voice.",
        },
      ],
      latestEyebrow: "Inside",
      latestTitle: "More stories",
      ctaEyebrow: "Subscribe",
      ctaTitle: `Stay with ${name}`,
      ctaBody: `All the news that’s fit to print — ${name}`,
      ctaButton: "Full edition",
    };
  }

  if (style === "glass") {
    return {
      eyebrow: "Clear · Modern · Soft",
      tagline: `Clear, modern publishing with a soft glass interface — ${name}.`,
      captionLeft: "",
      captionRight: "",
      featuredEyebrow: "Featured",
      featuredTitle: "Latest",
      sideRailLabel: "More to explore",
      pillarsEyebrow: `Why ${name}`,
      pillarsTitle: "A magazine built for modern readers",
      pillarsBody:
        "Beautiful public pages, published stories only, and branding that feels like your own product.",
      pillars: [
        {
          title: "Thoughtful stories",
          body: "Clear writing on the topics that matter to your readers.",
        },
        {
          title: "Fresh perspectives",
          body: "Features and guides curated for a modern digital magazine.",
        },
        {
          title: "Built for your brand",
          body: "A fully branded public site — your name, logo, and voice.",
        },
      ],
      latestEyebrow: "Latest",
      latestTitle: "From the journal",
      ctaEyebrow: "Start reading",
      ctaTitle: `Stay with ${name}`,
      ctaBody:
        "Browse the full archive of published stories, guides, and field notes.",
      ctaButton: "Explore all posts",
    };
  }

  // classic (default)
  return {
    eyebrow: "Stories & insights",
    tagline: `Discover articles, guides, and stories from ${name}.`,
    captionLeft: "",
    captionRight: "",
    featuredEyebrow: "This week",
    featuredTitle: "Featured stories",
    sideRailLabel: "More to explore",
    pillarsEyebrow: `Why ${name}`,
    pillarsTitle: "A magazine built for modern readers",
    pillarsBody:
      "Beautiful public pages, published stories only, and branding that feels like your own product — not a template dump.",
    pillars: [
      {
        title: "Thoughtful stories",
        body: "Clear writing on the topics that matter to your readers.",
      },
      {
        title: "Fresh perspectives",
        body: "Features and guides curated for a modern digital magazine.",
      },
      {
        title: "Built for your brand",
        body: "A fully branded public site — your name, logo, and voice.",
      },
    ],
    latestEyebrow: "Latest",
    latestTitle: "From the journal",
    ctaEyebrow: "Start reading",
    ctaTitle: `Stay with ${name}`,
    ctaBody:
      "Browse the full archive of published stories, guides, and field notes.",
    ctaButton: "Explore all posts",
  };
}

/** Merge saved home_layout fields over demo defaults (saved wins when non-empty). */
export function mergeHomeWithDemo(
  saved: Partial<HomeDemoContent> & {
    pillars?: Array<{ title?: string | null; body?: string | null } | null> | null;
    homeStyle?: string | null;
  } | null | undefined,
  homeStyle: HomeStyle,
  siteName = "our site"
): HomeDemoContent {
  const demo = getHomeDemoContent(
    saved?.homeStyle || homeStyle,
    siteName
  );
  if (!saved || typeof saved !== "object") return demo;

  const pick = (key: keyof HomeDemoContent): string => {
    if (key === "pillars") return "";
    const v = saved[key];
    if (typeof v === "string" && v.trim()) return v.trim();
    return demo[key] as string;
  };

  let pillars = demo.pillars;
  if (Array.isArray(saved.pillars) && saved.pillars.some((p) => p?.title || p?.body)) {
    const max = Math.max(demo.pillars.length, saved.pillars.length, 3);
    pillars = Array.from({ length: max }, (_, i) => ({
      title:
        (saved.pillars![i]?.title && String(saved.pillars![i]!.title).trim()) ||
        demo.pillars[i]?.title ||
        "",
      body:
        (saved.pillars![i]?.body && String(saved.pillars![i]!.body).trim()) ||
        demo.pillars[i]?.body ||
        "",
    })).filter((p) => p.title || p.body);
    if (pillars.length === 0) pillars = demo.pillars;
  }

  return {
    eyebrow: pick("eyebrow"),
    tagline: pick("tagline"),
    captionLeft: pick("captionLeft"),
    captionRight: pick("captionRight"),
    featuredEyebrow: pick("featuredEyebrow"),
    featuredTitle: pick("featuredTitle"),
    sideRailLabel: pick("sideRailLabel"),
    pillarsEyebrow: pick("pillarsEyebrow"),
    pillarsTitle: pick("pillarsTitle"),
    pillarsBody: pick("pillarsBody"),
    pillars,
    latestEyebrow: pick("latestEyebrow"),
    latestTitle: pick("latestTitle"),
    ctaEyebrow: pick("ctaEyebrow"),
    ctaTitle: pick("ctaTitle"),
    ctaBody: pick("ctaBody"),
    ctaButton: pick("ctaButton"),
  };
}
