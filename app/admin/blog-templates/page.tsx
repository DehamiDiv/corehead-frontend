'use client';

import React from 'react';

// --- TypeScript Interfaces ---

interface Template {
    id: string;
    title: string;
    updated: string; // e.g., "2 days ago"
    description: string;
    tag: string;
    tagColor: 'blue' | 'green' | 'purple' | 'gray' | 'orange';
    posts: number;
    views: string; // e.g. "4.5k"
    status: 'published' | 'draft';
}

// --- Dummy Data ---

const templates: Template[] = [
    {
        id: '1',
        title: 'Minimalist Editorial',
        updated: '2 days ago',
        description: 'Clean typography-focused layout perfect for long-form essays and thought leadership.',
        tag: 'GLOBAL DEFAULT',
        tagColor: 'blue',
        posts: 12,
        views: '4.5k',
        status: 'published',
    },
    {
        id: '2',
        title: 'Visual Portfolio Grid',
        updated: '5 hours ago',
        description: 'Image-heavy masonry grid designed for photographers and visual artists.',
        tag: 'DESIGN CATEGORY',
        tagColor: 'purple',
        posts: 8,
        views: '1.2k',
        status: 'published',
    },
    {
        id: '3',
        title: 'Tech Documentation',
        updated: '1 week ago',
        description: 'Structured layout with sidebars and code block styling for technical docs.',
        tag: 'TECH CATEGORY',
        tagColor: 'green',
        posts: 45,
        views: '12.8k',
        status: 'published',
    },
    {
        id: '4',
        title: 'Newsletter Archive',
        updated: '3 days ago',
        description: 'List-based view optimized for browsing past newsletter issues.',
        tag: 'BLOG ARCHIVE',
        tagColor: 'orange',
        posts: 24,
        views: '3.1k',
        status: 'published',
    },
    {
        id: '5',
        title: 'Podcast Episode',
        updated: 'Just now',
        description: 'Audio-first layout with embedded player and transcript area.',
        tag: 'DRAFT',
        tagColor: 'gray',
        posts: 0,
        views: '0',
        status: 'draft',
    },
    {
        id: '6',
        title: 'Product Review',
        updated: '1 month ago',
        description: 'Comparison tables and pros/cons sections for affiliate marketing.',
        tag: 'COMMERCE',
        tagColor: 'blue',
        posts: 5,
        views: '890',
        status: 'published',
    },
];

// --- Icons (Inline SVG) ---

const Icons = {
    Logo: () => (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" className="opacity-20" />
            <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-1 5h2v6h-2V9zm0 8h2v2h-2v-2z" fill="currentColor" />
        </svg>
    ),
    Search: () => (
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    Plus: () => (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    ),
    Edit: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    ),
    Copy: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    ),
    Delete: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    FileText: () => (
        <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    Eye: () => (
        <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ),
    ChevronDown: () => (
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    ),
    Grid: () => (
        <svg className="w-12 h-12 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
    )
};

// --- Sub-components ---

const TemplateCard = ({ template }: { template: Template }) => {
    const getTagColor = (color: Template['tagColor']) => {
        switch (color) {
            case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'green': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'purple': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'orange': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'gray': return 'bg-slate-100 text-slate-600 border-slate-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden group">
            {/* Card Header Illustration */}
            <div className="h-40 bg-slate-50 relative flex items-center justify-center border-b border-slate-100">
                <Icons.Grid />

                {/* Hover Actions */}
                <div className="absolute top-3 left-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 shadow-sm" title="Edit">
                        <Icons.Edit />
                    </button>
                    <button className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 shadow-sm" title="Copy">
                        <Icons.Copy />
                    </button>
                    <button className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-300 shadow-sm" title="Delete">
                        <Icons.Delete />
                    </button>
                </div>

                {/* Status Tag */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border ${getTagColor(template.tagColor)}`}>
                    {template.tag}
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                        {template.title}
                    </h3>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-3">Updated {template.updated}</p>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                    {template.description}
                </p>

                {/* Footer Metrics */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    {template.status === 'draft' ? (
                        <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-xs font-semibold rounded border border-yellow-200">
                            Not Published
                        </span>
                    ) : (
                        <div className="flex space-x-4">
                            <div className="flex items-center text-slate-500 text-xs font-medium">
                                <Icons.FileText />
                                {template.posts} posts
                            </div>
                        </div>
                    )}

                    <div className="flex items-center text-slate-500 text-xs font-medium">
                        <Icons.Eye />
                        {template.views}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Layout Sections ---

const Navbar = () => (
    <nav className="bg-[#EAF1FF] px-6 py-3 rounded-full flex items-center justify-between shadow-sm mb-8">
        <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-1.5 rounded-full">
                <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-blue-900 font-bold tracking-tight text-lg font-[family-name:var(--font-outfit)]">CoreHead</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="font-semibold text-blue-900">Dashboard</a>
            <a href="#" className="font-medium text-slate-500 hover:text-blue-700 transition-colors">All Blogs</a>
            <a href="#" className="font-medium text-slate-500 hover:text-blue-700 transition-colors">Settings</a>
        </div>

        <button className="bg-white text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm border border-blue-100 hover:bg-blue-50 transition-colors">
            Logout
        </button>
    </nav>
);

const StatsBar = () => (
    <div className="bg-[#E0EBF9] rounded-xl flex divide-x divide-blue-200/50 p-4 mb-8 shadow-sm">
        {[
            { label: 'Total Templates', value: '12' },
            { label: 'Active Templates', value: '3' },
            { label: 'Blog Posts Using', value: '2.4k' },
            { label: 'Drafts', value: '8' },
        ].map((stat, idx) => (
            <div key={idx} className="flex-1 text-center px-2">
                <div className="text-2xl font-bold text-slate-800 mb-0.5">{stat.value}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</div>
            </div>
        ))}
    </div>
);

const FilterBar = () => {
    const tabs = ['All', 'Global Default', 'Category Specific', 'Drafts'];
    const [activeTab, setActiveTab] = React.useState('All');

    return (
        <div className="bg-[#EFF6FF] rounded-xl p-2 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Search />
                </div>
                <input
                    type="text"
                    placeholder="Search Templates..."
                    className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
                />
            </div>

            <div className="flex space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${activeTab === tab
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-blue-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Page Component ---

export default function BlogTemplatesPage() {
    return (
        <div className="min-h-screen bg-[#F5F8FF] p-4 md:p-6 font-sans">
            <div className="max-w-7xl mx-auto bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 shadow-lg border border-white/50 min-h-[calc(100vh-3rem)]">

                <Navbar />

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">BLOG TEMPLATES</h1>
                        <p className="text-slate-500 text-lg max-w-2xl font-light">
                            Create, customize, and manage your blog layouts with visual tools and AI assistance
                        </p>
                    </div>
                    <button className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm self-start md:self-auto">
                        <Icons.Plus />
                        Create Template
                    </button>
                </div>

                <StatsBar />

                <FilterBar />

                {/* Templates Grid */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-700">Your Templates</h2>
                        <button className="text-sm text-slate-500 font-medium hover:text-blue-600 flex items-center">
                            Sort by: Recent <Icons.ChevronDown />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <TemplateCard key={template.id} template={template} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
