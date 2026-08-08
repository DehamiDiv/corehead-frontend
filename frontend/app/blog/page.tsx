import DetailedFooter from "@/components/DetailedFooter";
import { PublicPageRenderer } from "@/components/Renderer/PublicPageRenderer";
import type { BuilderBlock } from "@/components/admin/builder/BuilderContext";
import "./page.css";

export const metadata = {
  title: "Blog | CoreHead",
  description:
    "Explore the latest articles and tutorials from the CoreHead team.",
};

export default async function BlogArchivePage() {
  // Platform /blog is not multi-tenant. Tenant blogs: /s/{slug}/blog
  const layout: { blocks: BuilderBlock[] } = {
    blocks: [
      { id: "1", type: "Heading", content: "Latest Posts" },
      { id: "2", type: "Collection List", content: { limit: 6, category: "" } },
    ],
  };

  return (
    <>
      <main className="blog-archive-page">
        <PublicPageRenderer
          layout={layout}
          data={{ posts: [] }}
          isLoop={true}
        />
      </main>
      <DetailedFooter />
    </>
  );
}
