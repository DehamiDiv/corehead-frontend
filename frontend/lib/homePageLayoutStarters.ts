import type { LayoutDocumentV1 } from "@/lib/layoutContract";

export interface HomePageLayoutStarter {
  id: "editorial" | "magazine" | "newsletter";
  name: string;
  description: string;
  document: LayoutDocumentV1;
}

export const HOME_PAGE_LAYOUT_STARTERS: readonly HomePageLayoutStarter[] = [
  {
    id: "editorial",
    name: "Editorial Hero",
    description: "A strong site introduction followed by a clean latest-stories grid.",
    document: {
      schemaVersion: "1.0",
      kind: "home-page",
      name: "Editorial Hero Home",
      metadata: { origin: "manual", designStyle: "editorial" },
      blocks: [
        { id: "editorial-hero", type: "Container", content: "", styles: { padding: "88px 24px 64px", maxWidth: "1120px" } },
        { id: "editorial-title", type: "Heading", content: "Site name", level: 1, parentId: "editorial-hero", bindings: { content: "site.name" }, styles: { fontSize: "64px", lineHeight: 1.05, marginBottom: "20px" } },
        { id: "editorial-tagline", type: "Paragraph", content: "Independent stories and useful ideas.", parentId: "editorial-hero", bindings: { content: "site.tagline" }, styles: { fontSize: "21px", lineHeight: 1.6, maxWidth: "720px" } },
        { id: "editorial-stories-title", type: "Heading", content: "Latest stories", level: 2, styles: { fontSize: "36px", marginBottom: "24px" } },
        { id: "editorial-stories", type: "Collection List", content: { limit: 6, category: "" }, styles: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "24px" } },
      ],
    },
  },
  {
    id: "magazine",
    name: "Magazine Spotlight",
    description: "An image-led hero with featured stories and a larger editorial feed.",
    document: {
      schemaVersion: "1.0",
      kind: "home-page",
      name: "Magazine Spotlight Home",
      metadata: { origin: "manual", designStyle: "magazine" },
      blocks: [
        { id: "magazine-hero", type: "Container", content: "", styles: { padding: "72px 24px", backgroundColor: "#0f172a", color: "#ffffff" } },
        { id: "magazine-title", type: "Heading", content: "Site name", level: 1, parentId: "magazine-hero", bindings: { content: "site.name" }, styles: { fontSize: "58px", marginBottom: "16px", color: "#ffffff" } },
        { id: "magazine-description", type: "Paragraph", content: "Reporting, analysis, and perspective.", parentId: "magazine-hero", bindings: { content: "site.description" }, styles: { fontSize: "20px", lineHeight: 1.6, maxWidth: "680px", color: "#cbd5e1" } },
        { id: "magazine-featured-title", type: "Heading", content: "Featured", level: 2, styles: { fontSize: "34px", marginTop: "48px", marginBottom: "20px" } },
        { id: "magazine-featured", type: "Featured Carousel", content: { limit: 4 } },
        { id: "magazine-latest-title", type: "Heading", content: "More from the journal", level: 2, styles: { fontSize: "34px", marginTop: "56px", marginBottom: "20px" } },
        { id: "magazine-latest", type: "Collection List", content: { limit: 9, category: "" }, styles: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "28px" } },
      ],
    },
  },
  {
    id: "newsletter",
    name: "Newsletter First",
    description: "A concise brand hero, recent writing, and a prominent subscription section.",
    document: {
      schemaVersion: "1.0",
      kind: "home-page",
      name: "Newsletter First Home",
      metadata: { origin: "manual", designStyle: "newsletter" },
      blocks: [
        { id: "newsletter-hero", type: "Container", content: "", styles: { padding: "80px 24px", textAlign: "center", maxWidth: "960px" } },
        { id: "newsletter-title", type: "Heading", content: "Site name", level: 1, parentId: "newsletter-hero", bindings: { content: "site.name" }, styles: { fontSize: "60px", marginBottom: "18px" } },
        { id: "newsletter-tagline", type: "Paragraph", content: "A thoughtful email for curious readers.", parentId: "newsletter-hero", bindings: { content: "site.tagline" }, styles: { fontSize: "20px", lineHeight: 1.6, maxWidth: "640px", margin: "0 auto" } },
        { id: "newsletter-posts-title", type: "Heading", content: "Recent writing", level: 2, styles: { fontSize: "34px", marginBottom: "24px" } },
        { id: "newsletter-posts", type: "Collection List", content: { limit: 6, category: "" }, styles: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "24px" } },
        { id: "newsletter-signup", type: "Newsletter", content: { title: "Join the newsletter", description: "Get new stories delivered to your inbox.", buttonText: "Subscribe", placeholder: "you@example.com" }, styles: { marginTop: "64px", padding: "40px", backgroundColor: "#eff6ff", borderRadius: "20px" } },
      ],
    },
  },
] as const;

export const HOME_PAGE_BINDINGS = [
  { value: "site.name", label: "Site name", blockType: "Heading" },
  { value: "site.tagline", label: "Site tagline", blockType: "Paragraph" },
  { value: "site.description", label: "Site description", blockType: "Paragraph" },
  { value: "site.logo", label: "Site logo", blockType: "Image" },
  { value: "site.heroImage", label: "Hero image", blockType: "Image" },
] as const;
