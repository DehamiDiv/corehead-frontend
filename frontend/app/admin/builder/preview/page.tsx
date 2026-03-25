"use client";
import React, { useState, useEffect } from "react";

import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
} from "lucide-react";

export default function BlogPreviewPage() {
  const [blocks, setBlocks] = useState<any[]>([]);

  // Need to import useEffect, import useState at the top? Wait, it's missing imports!
  // I will just use React.useState and React.useEffect

  React.useEffect(() => {
    const saved = localStorage.getItem("corehead_builder_layout");
    if (saved) {
      try {
        setBlocks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved layout", e);
      }
    }
  }, []);

  const renderBlockTree = (parentId?: string) => {
    const levelBlocks = blocks.filter(
      (b) => b.parentId === parentId || (!b.parentId && !parentId),
    );

    return levelBlocks.map((block: any) => {
      const styleString = block.styles || {};
      const content = block.bindings?.content
        ? `{${block.bindings.content}}`
        : block.content;

      let renderedContent = null;
      switch (block.type) {
        case "Heading":
          renderedContent = (
            <h2
              className="text-3xl font-bold text-slate-800"
              style={styleString}
            >
              {content}
            </h2>
          );
          break;
        case "Paragraph":
          renderedContent = (
            <p
              className="text-slate-600 leading-relaxed text-lg"
              style={styleString}
            >
              {content}
            </p>
          );
          break;
        case "Image":
          renderedContent = (
            <div style={styleString}>
              <img
                src={content}
                alt="Block"
                className="w-full h-auto rounded-lg"
              />
            </div>
          );
          break;
        case "Quote":
          renderedContent = (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 italic text-slate-700 text-xl"
              style={styleString}
            >
              {content}
            </blockquote>
          );
          break;
        case "Divider":
          renderedContent = (
            <hr
              className="border-t border-slate-200 my-4"
              style={styleString}
            />
          );
          break;
        case "Button":
          renderedContent = (
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium"
              style={styleString}
            >
              {block.content?.text || "Click Me"}
            </button>
          );
          break;
        case "Container":
          renderedContent = (
            <div style={styleString} className="my-4">
              {renderBlockTree(block.id)}
            </div>
          );
          break;
        case "Columns":
          const cols = block.content || 2;
          renderedContent = (
            <div
              style={styleString}
              className={`my-4 grid grid-cols-1 md:grid-cols-${cols} gap-4`}
            >
              {renderBlockTree(block.id)}
            </div>
          );
          break;
        default:
          renderedContent = null;
      }

      return <div key={block.id}>{renderedContent}</div>;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar (Preview Mode) */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/builder"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Editor</span>
          </Link>
          <div className="h-6 w-px bg-gray-200" />
          <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            Preview Mode
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            Desktop
          </button>
          <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            Mobile
          </button>
        </div>
      </nav>

      {/* Blog Content */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Category & Date */}
        <div className="flex items-center gap-3 text-sm mb-6">
          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            Development
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">Oct 24, 2024</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
          The Future of AI in Web Development: A Comprehensive Guide
        </h1>

        {/* Author */}
        <div className="flex items-center justify-between mb-10 pb-10 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Author"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Felix Vance</div>
              <div className="text-sm text-slate-500">Senior Engineer</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <button className="hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="hover:text-blue-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="hover:text-blue-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="hover:text-slate-700 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden bg-slate-100 mb-10 aspect-video relative">
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            {/* Placeholder for actual image */}
            <span className="font-medium text-lg">Featured Image Preview</span>
          </div>
        </div>

        {/* Body Content (Dynamic content) */}
        <div className="prose prose-lg prose-slate max-w-none">
          {blocks.length > 0 ? (
            renderBlockTree()
          ) : (
            <p className="lead italic text-slate-400">
              No content found in this post.
            </p>
          )}
        </div>

        {/* Footer / Tags */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {["AI", "Web Dev", "Future", "Tech"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
