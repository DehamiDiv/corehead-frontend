"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BuilderBlock } from "../admin/builder/BuilderContext";

/**
 * FR-25: Public Page Renderer Component
 * Takes the raw JSON schema stored in PostgreSQL and renders it using optimized Next.js components.
 * 
 * @param {BuilderBlock[]} layout - The layout array extracted from the DB JSON.
 * @param {any} data - The real CMS data (e.g. { post: { title: "Hello", content: "...", featured_image: "url" } })
 */

interface PublicPageRendererProps {
  layout: BuilderBlock[] | { blocks: BuilderBlock[] };
  data?: Record<string, any>;
}

// FR-26: Dynamic Template Binding Helper
// Evaluates `{post.title}` type syntax and replaces it with real CMS data.
function bindData(content: any, bindings: Record<string, string> | undefined, data: any) {
  if (!bindings?.content) return content;
  
  const path = bindings.content.split(".");
  let resolvedData = data;
  for (const key of path) {
    if (resolvedData && resolvedData[key] !== undefined) {
      resolvedData = resolvedData[key];
    } else {
      resolvedData = null;
      break;
    }
  }

  return resolvedData || content;
}

export function PublicPageRenderer({ layout, data = {} }: PublicPageRendererProps) {
  const blocksArray = Array.isArray(layout) ? layout : (layout as any)?.blocks || [];

  const renderBlock = (block: BuilderBlock) => {
    const styleString = block.styles || {};
    
    // Resolve any dynamic CMS bindings
    const content = bindData(block.content, block.bindings, data);

    switch (block.type) {
      case "Heading":
        return <h2 key={block.id} style={styleString} className="font-bold mb-4">{content}</h2>;
        
      case "Paragraph":
        return <p key={block.id} style={styleString} className="mb-4 text-gray-700 leading-relaxed">{content}</p>;
        
      case "Image":
        // FR-27: Optimized Next.js `next/image` usage
        return (
          <div key={block.id} style={styleString} className="relative w-full aspect-video my-4 rounded-lg overflow-hidden">
            <Image 
              src={content || "https://placehold.co/800x400"} 
              alt="Dynamic Blog Image" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        );
        
      case "Quote":
        return (
          <blockquote key={block.id} style={styleString} className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50">
            {content}
          </blockquote>
        );
        
      case "Divider":
        return <hr key={block.id} style={styleString} className="my-6 border-gray-200" />;
        
      case "Button":
        // FR-27: Optimized Next.js `next/link` usage
        const url = content?.url || "#";
        const text = content?.text || "Click Here";
        return (
          <div key={block.id} style={styleString} className="my-4">
            <Link href={url} className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition">
              {text}
            </Link>
          </div>
        );
        
      case "Container":
        return (
          <div key={block.id} style={styleString}>
            {renderChildren(block.id)}
          </div>
        );
        
      case "Columns":
        const cols = content || 2;
        return (
          <div key={block.id} style={styleString} className={`grid grid-cols-1 md:grid-cols-${cols} gap-6 my-6`}>
            {renderChildren(block.id)}
          </div>
        );

      case "Collection List":
        // FR-18: Blog Loop handling
        const limit = content?.limit || 6;
        const posts = Array.isArray(data?.posts) ? data.posts.slice(0, limit) : [];
        
        return (
          <div key={block.id} style={styleString} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {posts.length > 0 ? (
              posts.map((post: any) => (
                <Link href={`/posts/${post.slug || post.id}`} key={post.id} className="group block border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition bg-white flex flex-col h-full">
                  <div className="relative w-full h-48 bg-gray-100">
                    <Image src={post.featured_image || "https://placehold.co/400x300"} fill className="object-cover group-hover:scale-105 transition-transform duration-300" alt={post.title} />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">{post.category || "Article"}</span>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-auto">{post.excerpt}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center p-8 border border-dashed border-gray-300 rounded-lg text-gray-500">
                No blog posts available in this collection loop.
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderChildren = (parentId?: string) => {
    const levelBlocks = blocksArray.filter(
      (b: any) => b.parentId === parentId || (!b.parentId && !parentId)
    );
    return levelBlocks.map((block: any) => renderBlock(block));
  };

  return <div className="public-renderer-wrapper">{renderChildren()}</div>;
}
