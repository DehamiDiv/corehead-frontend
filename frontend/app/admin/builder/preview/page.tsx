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
import { api } from "@/lib/api";

export default function BlogPreviewPage() {
  const [blocks, setBlocks] = useState<any[]>([]);

  // Need to import useEffect, import useState at the top? Wait, it's missing imports!
  // I will just use React.useState and React.useEffect

  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    // 1. Load layout from local storage
    const saved = localStorage.getItem("corehead_builder_layout");
    if (saved) {
      try {
        setBlocks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved layout", e);
      }
    }

    // 2. Fetch real data from backend preview API
    const fetchPosts = async () => {
        try {
            const posts = await api.getPreviewPosts(3);
            setBlogPosts(posts);
        } catch (error) {
            console.error("Failed to fetch preview posts", error);
        }
    };
    fetchPosts();
  }, []);

  const renderBlockTree = (parentId?: string) => {
    const levelBlocks = blocks.filter(
      (b) => b.parentId === parentId || (!b.parentId && !parentId),
    );

    return levelBlocks.map((block: any) => {
      const styleString = block.styles || {};
      
      // Data Binding Logic: Replace content if bound to a field
      let content = block.content;
      if (block.bindings?.content) {
          const binding = block.bindings.content;
          if (binding === 'post.title') content = "The Future of AI in Web Development: A Comprehensive Guide";
          else if (binding === 'post.excerpt') content = "Exploring how artificial intelligence is transforming the way we build and interact with the web.";
          else if (binding === 'post.content') content = "Full blog post content would go here in a real scenario...";
          else if (binding === 'post.category') content = "Development";
          else if (binding === 'post.author') content = "Felix Vance";
          else if (binding === 'post.date') content = "Oct 24, 2024";
          else if (binding === 'site.name') content = "CoreHead Blog";
          else if (binding === 'post.featured_image') content = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80";
      }

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
              style={{ ...styleString, display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '1rem' }}
              className="my-4"
            >
              {renderBlockTree(block.id)}
            </div>
          );
          break;
        case "Collection List":
          renderedContent = (
            <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-6" style={styleString}>
              {blogPosts.map((post) => (
                <div key={post.id} className="group border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                        <h4 className="font-bold text-slate-800 line-clamp-2">{post.title}</h4>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{post.excerpt}</p>
                    </div>
                </div>
              ))}
            </div>
          );
          break;
        case "Featured Carousel":
          renderedContent = (
            <div className="my-8 relative rounded-3xl overflow-hidden bg-slate-900 aspect-[21/9]" style={styleString}>
                {blogPosts[0] && (
                    <>
                        <img src={blogPosts[0].imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-12">
                            <span className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">Featured Article</span>
                            <h2 className="text-white text-4xl font-extrabold max-w-2xl mb-4">{blogPosts[0].title}</h2>
                            <p className="text-white/70 max-w-xl line-clamp-2">{blogPosts[0].excerpt}</p>
                        </div>
                    </>
                )}
            </div>
          );
          break;
        case "Video":
          renderedContent = (
            <div className="my-8 aspect-video rounded-2xl overflow-hidden bg-slate-100" style={styleString}>
               <iframe 
                  className="w-full h-full"
                  src={content && typeof content === "string" ? content.replace('watch?v=', 'embed/') : ""} 
                  title="Video"
                  allowFullScreen
               ></iframe>
            </div>
          );
          break;
        case "Newsletter":
          renderedContent = (
            <div className="my-8 bg-slate-900 rounded-3xl p-12 text-center text-white" style={styleString}>
               <h3 className="text-3xl font-bold mb-4">{block.content?.title}</h3>
               <p className="text-slate-400 mb-8 max-w-md mx-auto">Stay updated with our latest news and articles delivered straight to your inbox.</p>
               <div className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
                  <input type="email" placeholder="Enter your email" className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-blue-500" />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">{block.content?.buttonText}</button>
               </div>
            </div>
          );
          break;
        case "Spacer":
          renderedContent = <div style={{ height: block.content || '40px' }}></div>;
          break;
        case "Code Block":
          renderedContent = (
            <div className="my-6 bg-slate-900 rounded-xl p-6 overflow-x-auto border border-slate-800" style={styleString}>
               <pre className="text-blue-300 font-mono text-sm">
                  <code>{block.content?.code}</code>
               </pre>
            </div>
          );
          break;
        case "Social Links":
          renderedContent = (
            <div className="my-8 flex justify-center gap-6" style={styleString}>
               {["Facebook", "Twitter", "Instagram"].map(s => (
                 <span key={s} className="text-slate-400 hover:text-blue-500 font-medium cursor-pointer transition-colors">{s}</span>
               ))}
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

      {/* Dynamic Content Rendering */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {blocks.length > 0 ? (
          renderBlockTree()
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p className="text-xl font-medium">Your canvas is empty</p>
            <p>Go back to the editor to add some components.</p>
          </div>
        )}
      </main>
    </div>
  );
}
