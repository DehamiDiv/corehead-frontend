"use client";

import { useState } from "react";

// --- TypeScript Interfaces ---
interface Template {
  id: string;
  title: string;
  updated: string; // e.g., "2 days ago"
  description: string;
  tag: string;
  tagColor: "blue" | "green" | "purple" | "gray" | "orange";
  posts: number;
  views: string; // e.g. "4.5k"
  status: "published" | "draft";
}

// --- Dummy Data ---
const templates: Template[] = [
  {
    id: "1",
    title: "Minimalist Editorial",
    updated: "2 days ago",
    description:
      "Clean typography-focused layout perfect for long-form essays and thought leadership.",
    tag: "GLOBAL DEFAULT",
    tagColor: "blue",
    posts: 12,
    views: "4.5k",
    status: "published",
  },
  {
    id: "2",
    title: "Visual Portfolio Grid",
    updated: "5 hours ago",
    description:
      "Image-heavy masonry grid designed for photographers and visual artists.",
    tag: "DESIGN CATEGORY",
    tagColor: "purple",
    posts: 8,
    views: "1.2k",
    status: "published",
  },
  {
    id: "3",
    title: "Tech Documentation",
    updated: "1 week ago",
    description:
      "Structured layout with sidebars and code block styling for technical docs.",
    tag: "TECH CATEGORY",
    tagColor: "green",
    posts: 45,
    views: "12.8k",
    status: "published",
  },
  {
    id: "4",
    title: "Newsletter Archive",
    updated: "3 days ago",
    description: "List-based view optimized for browsing past newsletter issues.",
    tag: "BLOG ARCHIVE",
    tagColor: "orange",
    posts: 24,
    views: "3.1k",
    status: "published",
  },
  {
    id: "5",
    title: "Podcast Episode",
    updated: "Just now",
    description: "Audio-first layout with embedded player and transcript area.",
    tag: "DRAFT",
    tagColor: "gray",
    posts: 0,
    views: "0",
    status: "draft",
  },
  {
    id: "6",
    title: "Product Review",
    updated: "1 month ago",
    description: "Comparison tables and pros/cons sections for affiliate marketing.",
    tag: "COMMERCE",
    tagColor: "blue",
    posts: 5,
    views: "890",
    status: "published",
  },
];

// --- Icons (Inline SVG) ---
const Icons = {
  Search: () => (
    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Plus: () => (
    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Edit: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  ),
  Copy: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  ),
  Delete: () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  FileText: () => (
    <svg className="mr-1 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  Eye: () => (
    <svg className="mr-1 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Grid: () => (
    <svg className="h-12 w-12 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
};

// --- Sub-components ---
const TemplateCard = ({ template }: { template: Template }) => {
  const getTagColor = (color: Template["tagColor"]) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "green":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "purple":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "orange":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "gray":
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative flex h-40 items-center justify-center border-b border-slate-100 bg-slate-50">
        <Icons.Grid />

        {/* Actions */}
        <div className="absolute left-3 top-3 flex space-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm hover:border-blue-300 hover:text-blue-600"
            title="Edit"
          >
            <Icons.Edit />
          </button>
          <button
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm hover:border-blue-300 hover:text-blue-600"
            title="Copy"
          >
            <Icons.Copy />
          </button>
          <button
            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm hover:border-red-300 hover:text-red-500"
            title="Delete"
          >
            <Icons.Delete />
          </button>
        </div>

        {/* Tag */}
        <div
          className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider ${getTagColor(
            template.tagColor
          )}`}
        >
          {template.tag}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-tight text-slate-800 transition-colors group-hover:text-blue-600">
          {template.title}
        </h3>
        <p className="mb-3 mt-2 text-xs font-medium text-slate-400">Updated {template.updated}</p>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500">{template.description}</p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          {template.status === "draft" ? (
            <span className="rounded border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-xs font-semibold text-yellow-700">
              Not Published
            </span>
          ) : (
            <div className="flex items-center text-xs font-medium text-slate-500">
              <Icons.FileText />
              {template.posts} posts
            </div>
          )}

          <div className="flex items-center text-xs font-medium text-slate-500">
            <Icons.Eye />
            {template.views}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsBar = () => (
  <div className="mb-6 flex rounded-xl bg-[#E0EBF9] p-4 shadow-sm divide-x divide-blue-200/50">
    {[
      { label: "Total Templates", value: "12" },
      { label: "Active Templates", value: "3" },
      { label: "Blog Posts Using", value: "2.4k" },
      { label: "Drafts", value: "8" },
    ].map((stat, idx) => (
      <div key={idx} className="flex-1 px-2 text-center">
        <div className="mb-0.5 text-2xl font-bold text-slate-800">{stat.value}</div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</div>
      </div>
    ))}
  </div>
);

const FilterBar = () => {
  const tabs = ["All", "Global Default", "Category Specific", "Drafts"];
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl bg-[#EFF6FF] p-2 md:flex-row">
      <div className="relative w-full md:w-80">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icons.Search />
        </div>
        <input
          type="text"
          placeholder="Search Templates..."
          className="block w-full rounded-lg bg-white py-2 pl-10 pr-3 text-sm placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex w-full space-x-1.5 overflow-x-auto pb-1 md:w-auto md:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-md"
                : "border border-slate-200 bg-white text-slate-500 hover:bg-blue-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Page Component (NO extra navbar / NO full-screen wrapper) ---
export default function BlogTemplatesPage() {
  return (
    <div className="space-y-6">
      {/* Inner canvas like your screenshot (but inside AdminLayout) */}
      <div className="rounded-[28px] border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 md:text-4xl">
              BLOG TEMPLATES
            </h1>
            <p className="mt-2 max-w-2xl text-lg font-light text-slate-500">
              Create, customize, and manage your blog layouts with visual tools and AI assistance
            </p>
          </div>

          <button className="flex items-center self-start rounded-xl bg-blue-100 px-5 py-2.5 font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-200 md:self-auto">
            <Icons.Plus />
            Create Template
          </button>
        </div>

        <StatsBar />
        <FilterBar />

        {/* Templates */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-700">Your Templates</h2>
            <button className="flex items-center text-sm font-medium text-slate-500 hover:text-blue-600">
              Sort by: Recent <Icons.ChevronDown />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
