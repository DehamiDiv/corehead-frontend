"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
} from "lucide-react";

export default function BlogPreviewPage() {
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

        {/* Body Content (Placeholder for dynamic content) */}
        <div className="prose prose-lg prose-slate max-w-none">
          <p className="lead">
            Artificial Intelligence is rapidly transforming how we build and
            interact with the web. From automated code generation to
            hyper-personalized user experiences, the landscape is shifting.
          </p>
          <p>
            In this guide, we'll explore the key trends shaping the industry and
            how developers can leverage these tools to build faster, smarter,
            and more efficient applications.
          </p>

          <h3>1. Automated Coding Assistants</h3>
          <p>
            Tools like GitHub Copilot and Cursor are changing the way we write
            code. By suggesting snippets and extensive blocks of logic, they
            reduce boilerplate and allow developers to focus on architecture and
            problem-solving.
          </p>

          <blockquote>
            "AI won't replace developers, but developers using AI will replace
            those who don't."
          </blockquote>

          <h3>2. Dynamic Content Generation</h3>
          <p>
            Imagine a CMS that not only stores content but suggests
            improvements, generates meta tags, and even translates posts
            automatically. This is the new standard for modern content
            management systems.
          </p>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 my-8">
            <h4 className="text-blue-800 font-semibold mb-2 mt-0">
              Key Takeaway
            </h4>
            <p className="text-blue-700 mb-0">
              Embracing AI tools early gives you a significant competitive
              advantage. Start integrating them into your workflow today.
            </p>
          </div>
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
