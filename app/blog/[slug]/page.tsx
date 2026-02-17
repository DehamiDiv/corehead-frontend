import React from "react";
import { notFound } from "next/navigation";
import PageRenderer from "@/lib/page-renderer/renderer";
import { getLayout, getPostBySlug, SINGLE_POST_LAYOUT } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SinglePostPage(props: Props) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const layout = await getLayout("single");

  return (
    <main className="min-h-screen bg-white">
      <PageRenderer layout={layout || SINGLE_POST_LAYOUT} context={{ post }} />
    </main>
  );
}
