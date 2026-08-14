/**
 * Professional starter copy by layout style.
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
 * Layout-specific starter strings (what the public home shows by default).
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
      eyebrow: "Field notes · People · Place",
      tagline: `Immersive stories, considered perspectives and visual journeys from ${name}.`,
      captionLeft: "Stories shaped by place\nPublished with purpose",
      captionRight: "Journal\nField notes",
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
      ctaTitle: `Continue exploring ${name}`,
      ctaBody: "Read the complete collection of features, field notes and visual essays.",
      ctaButton: "Explore all posts",
    };
  }

  if (style === "bloom") {
    return {
      eyebrow: "Wellbeing · Guidance · Growth",
      tagline: `Thoughtful guidance and practical ideas for living and working well, from ${name}.`,
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
      ctaTitle: `Make space for what matters with ${name}`,
      ctaBody: "Explore supportive resources, expert perspectives and practical next steps.",
      ctaButton: "Explore the journal",
    };
  }

  if (style === "portals") {
    return {
      eyebrow: "Expertise · Innovation · Insight",
      tagline: `Ideas, practical guidance and industry perspectives from ${name}.`,
      captionLeft: "",
      captionRight: "",
      featuredEyebrow: "Insights",
      featuredTitle: "Latest insights",
      sideRailLabel: "More to explore",
      pillarsEyebrow: "Platform",
      pillarsTitle: "Designed to create impact",
      pillarsBody:
        "A clear view of the capabilities, knowledge and outcomes behind the work.",
      pillars: [
        {
          title: "Clear expertise",
          body: "Present complex ideas in a focused and credible way.",
        },
        {
          title: "Useful insights",
          body: "Share practical knowledge that helps readers make better decisions.",
        },
        {
          title: "Meaningful outcomes",
          body: "Connect every story to the value it creates for its audience.",
        },
      ],
      latestEyebrow: "Latest",
      latestTitle: "From the journal",
      ctaEyebrow: "Get started",
      ctaTitle: `Discover more from ${name}`,
      ctaBody: "Explore the complete archive of published stories and practical insights.",
      ctaButton: "Explore insights",
    };
  }

  if (style === "bento") {
    return {
      eyebrow: "Ideas · Culture · Perspective",
      tagline: `A dynamic collection of standout stories and fresh perspectives from ${name}.`,
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
      ctaEyebrow: "Explore",
      ctaTitle: `Discover more from ${name}`,
      ctaBody:
        "Browse the full archive of published stories, guides, and field notes.",
      ctaButton: "Explore all stories",
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
      eyebrow: "Ideas · Notes · Perspective",
      tagline: `A clear, focused home for essays, updates and independent thinking from ${name}.`,
      captionLeft: "",
      captionRight: "",
      featuredEyebrow: "Featured",
      featuredTitle: "Latest",
      sideRailLabel: "More to explore",
      pillarsEyebrow: `Why ${name}`,
      pillarsTitle: "Publishing with clarity and purpose",
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
      ctaTitle: `Keep reading ${name}`,
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
    pillarsTitle: "Publishing with clarity and purpose",
    pillarsBody:
      "A focused home for useful articles, original perspectives and the ideas behind your work.",
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
