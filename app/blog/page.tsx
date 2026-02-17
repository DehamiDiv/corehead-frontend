import React from "react";
import PageRenderer from "@/lib/page-renderer/renderer";
import { getLayout, getAllPosts, ARCHIVE_LAYOUT } from "@/lib/data";

export default async function BlogArchivePage() {
  const posts = await getAllPosts();
  const layout = await getLayout("archive");

  // In a real app, layout would come from DB. 
  // Here we use the mock layout or fallback to ARCHIVE_LAYOUT
  
  return (
    <main className="min-h-screen bg-white">
      <PageRenderer layout={layout || ARCHIVE_LAYOUT} context={{ posts }} />
    </main>
  );
}
