/**
 * Market-facing copy helpers for public tenant sites.
 * Prefer branding fields; fall back to polished generic magazine language.
 */

import type { SiteBranding } from "@/lib/siteBranding";

export function siteTagline(
  siteName: string,
  branding?: SiteBranding | null
): string {
  // Appearance → Home layout editable tagline
  const fromHome = branding?.home?.tagline?.trim();
  if (fromHome) return fromHome;

  const fromFooter = branding?.footer?.footerDescription?.trim();
  if (fromFooter) return fromFooter;

  if (branding?.homeStyle === "nature") {
    return "A nature & beauty journal — gardens, wildlife, and conscious living, told with quiet luxury.";
  }
  if (branding?.homeStyle === "magazine") {
    return "Long reads, sharp features, and stories that stay with you.";
  }
  if (branding?.homeStyle === "dark") {
    return "Bold ideas, clear writing, and stories built for curious minds.";
  }
  if (branding?.homeStyle === "bloom") {
    return "A calm space for mental wellness, reflection, and stories that help you breathe.";
  }
  if (branding?.homeStyle === "agents") {
    return "Powering seamless agents and integrations — make automation simpler and enable teams to ship faster.";
  }
  if (branding?.homeStyle === "portals") {
    return `Powering seamless flows and integrations for ${siteName} — make complex work simpler and enable builders to ship faster.`;
  }
  if (branding?.homeStyle === "bento") {
    return `A modern mosaic of stories and product moments from ${siteName}.`;
  }
  if (branding?.homeStyle === "studio") {
    return `A curated visual journal — frames and stories from ${siteName}.`;
  }
  if (branding?.homeStyle === "paper") {
    return `All the news and long reads that matter — ${siteName}.`;
  }
  if (branding?.homeStyle === "glass") {
    return `Clear, modern publishing with a soft glass interface — ${siteName}.`;
  }
  return `Discover articles, guides, and stories from ${siteName}.`;
}

export function siteEyebrow(branding?: SiteBranding | null): string {
  const fromHome = branding?.home?.eyebrow?.trim();
  if (fromHome) return fromHome;

  switch (branding?.homeStyle) {
    case "nature":
      return "Nature · Beauty · Collections";
    case "bloom":
      return "Gentle care · Mindful living";
    case "agents":
      return "AI agents · Live factory";
    case "portals":
      return "Product · Platform · Builders";
    case "bento":
      return "Mosaic · Stories · Product";
    case "studio":
      return "Studio · Collection";
    case "paper":
      return "The daily journal";
    case "glass":
      return "Clear · Modern · Soft";
    default:
      return "Stories & insights";
  }
}

/** Optional captions under editorial hero plate */
export function siteHomeCaptions(branding?: SiteBranding | null): {
  left: string;
  right: string;
} {
  return {
    left:
      branding?.home?.captionLeft?.trim() ||
      "New stories with beauty\nNature collections",
    right: branding?.home?.captionRight?.trim() || "Studio\n2026",
  };
}

export type HomePillarCopy = { title: string; body: string };

/** Resolved home section labels + pillar cards (Appearance overrides + defaults). */
export type HomeSectionCopy = {
  featuredEyebrow: string;
  featuredTitle: string;
  sideRailLabel: string;
  pillarsEyebrow: string;
  pillarsTitle: string;
  pillarsBody: string;
  pillars: HomePillarCopy[];
  latestEyebrow: string;
  latestTitle: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};

function defaultPillars(homeStyle?: string | null): HomePillarCopy[] {
  if (homeStyle === "nature") {
    return [
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
    ];
  }
  if (homeStyle === "bloom") {
    return [
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
    ];
  }
  if (homeStyle === "agents") {
    return [
      {
        title: "Research agent",
        body: "Scans sources, summarizes findings, and drafts clear briefs.",
      },
      {
        title: "Ops agent",
        body: "Automates workflows, tickets, and hand-offs across tools.",
      },
      {
        title: "Build agent",
        body: "Turns requirements into structured tasks and ship-ready plans.",
      },
      {
        title: "Orchestrator",
        body: "Routes work across agents so the whole factory stays in sync.",
      },
    ];
  }
  if (homeStyle === "portals") {
    return [
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
    ];
  }
  return [
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
  ];
}

export function siteHomeSections(
  siteName: string,
  branding?: SiteBranding | null
): HomeSectionCopy {
  const h = branding?.home;
  const style = branding?.homeStyle || h?.homeStyle;
  const isNature = style === "nature";
  const isBloom = style === "bloom";
  const isAgents = style === "agents";
  const isPortals = style === "portals";

  const defaults = defaultPillars(style);
  const saved = Array.isArray(h?.pillars) ? h!.pillars! : [];
  const pillars = defaults.map((d, i) => ({
    title: saved[i]?.title?.trim() || d.title,
    body: saved[i]?.body?.trim() || d.body,
  }));

  return {
    featuredEyebrow:
      h?.featuredEyebrow?.trim() ||
      (isPortals
        ? "Insights"
        : isAgents
          ? "Transmission"
          : isBloom
            ? "Journal"
            : "This week"),
    featuredTitle:
      h?.featuredTitle?.trim() ||
      (isPortals
        ? "Latest from the lab"
        : isAgents
          ? "From the agent lab"
          : isBloom
            ? "Stories for softer days"
            : "Featured stories"),
    sideRailLabel: h?.sideRailLabel?.trim() || "More to explore",
    pillarsEyebrow:
      h?.pillarsEyebrow?.trim() ||
      (isPortals
        ? "Platform"
        : isAgents
          ? "Agent factory"
          : isBloom
            ? "How we help"
            : `Why ${siteName}`),
    pillarsTitle:
      h?.pillarsTitle?.trim() ||
      (isPortals
        ? "Built for complex work"
        : isAgents
          ? "Compose a living team"
          : isBloom
            ? "Care that feels human"
            : "A magazine built for modern readers"),
    pillarsBody:
      h?.pillarsBody?.trim() ||
      (isPortals
        ? "Everything builders need to ship faster — without the operational drag."
        : isAgents
          ? "Modular roles that plug into your product — research, ops, and build agents on one neon canvas."
          : isBloom
            ? ""
            : "Beautiful public pages, published stories only, and branding that feels like your own product — not a template dump."),
    pillars,
    latestEyebrow: h?.latestEyebrow?.trim() || "Latest",
    latestTitle: h?.latestTitle?.trim() || "From the journal",
    ctaEyebrow:
      h?.ctaEyebrow?.trim() ||
      (isPortals
        ? "Get started"
        : isAgents
          ? "Ready to orchestrate"
          : isBloom
            ? "You are welcome here"
            : "Start reading"),
    ctaTitle:
      h?.ctaTitle?.trim() ||
      (isPortals
        ? `Simplifying ${siteName}'s\nMost Complex\nTransactions`
        : isAgents
          ? `Spin up your first ${siteName} agent`
          : isBloom
            ? "Small steps still count as progress"
            : isNature
              ? "Grow something good today"
              : `Stay with ${siteName}`),
    ctaBody:
      h?.ctaBody?.trim() ||
      (isPortals
        ? "Ship faster with a stack built for complex workflows."
        : isAgents
          ? "Explore stories, blueprints, and field notes from the agent lab — then ship something luminous."
          : isBloom
            ? `Explore gentle stories and tools from ${siteName} — written for real days, not perfect ones.`
            : "Browse the full archive of published stories, guides, and field notes."),
    ctaButton:
      h?.ctaButton?.trim() ||
      (isPortals
        ? "Get started"
        : isAgents
          ? "Explore the lab"
          : isBloom
            ? "Explore the journal"
            : "Explore all posts"),
  };
}

export function formatPostDate(value?: string | Date | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function postCategory(post: {
  category?: string | null;
  categories?: Array<string | { name?: string }> | string | null;
}): string | null {
  if (typeof post.category === "string" && post.category.trim()) {
    return post.category.trim();
  }
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const first = post.categories[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && first.name) return first.name;
  }
  return null;
}

export function readingTimeMinutes(content?: string | null): number {
  if (!content) return 3;
  const text = String(content).replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.min(25, Math.round(words / 200)));
}
