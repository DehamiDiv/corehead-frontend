import { ComponentNode } from "@/lib/page-renderer/types";
import { getBindings } from "@/app/admin/binding/actions";

// Mock Layouts - keeping them for fallback or if bindings are missing
export const SINGLE_POST_LAYOUT: ComponentNode[] = [
  {
    id: "1",
    type: "container",
    props: { className: "py-12" },
    children: [
       { id: "2", type: "post_image", props: {} },
       { id: "3", type: "post_title", props: { className: "text-center" } },
       { id: "4", type: "post_meta", props: { className: "justify-center" } },
       { id: "5", type: "post_content", props: { className: "mx-auto" } },
    ]
  }
];

export const ARCHIVE_LAYOUT: ComponentNode[] = [
    {
        id: "hero",
        type: "container", 
        props: { className: "py-20 text-center bg-neutral-50 rounded-3xl mb-12" },
        children: [
            { id: "h1", type: "heading", props: { content: "Our Blog", level: 1, className: "text-5xl mb-4" } },
            { id: "p1", type: "text", props: { content: "Latest news, updates, and stories from our team." } }
        ]
    },
    {
        id: "main",
        type: "container",
        children: [
            { id: "loop", type: "blog_loop", props: {} }
        ]
    }
];

// Mock Data
export const MOCK_POSTS = [
    {
        slug: "building-modern-blogs",
        title: "How to Build a Modern Blog with Next.js",
        excerpt: "Learn how to use Next.js App Router and a Headless CMS to build performant and scalable blogs.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...",
        image: "https://placehold.co/1200x600/2563eb/white?text=Next.js+Blog",
        date: "2024-04-12",
        author: { name: "John Doe" }
    },
    {
        slug: "tailwind-css-tips",
        title: "10 Tailwind CSS Tips You Should Know",
        excerpt: "Boost your productivity with these advanced Tailwind CSS techniques and patterns.",
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
        image: "https://placehold.co/1200x600/06b6d4/white?text=Tailwind+CSS",
        date: "2024-04-10",
        author: { name: "Jane Smith" }
    }
];

export async function getPostBySlug(slug: string) {
    return MOCK_POSTS.find(p => p.slug === slug);
}

export async function getAllPosts() {
    return MOCK_POSTS;
}

// Helper function to build Single Post Layout
function buildSinglePostLayout(selected: Record<string, boolean>): ComponentNode[] {
    const children: ComponentNode[] = [];

    // Order matters here, we can follow a standard order
    if (selected["navbar"]) {
        children.push({ id: "navbar", type: "navbar", props: {} });
    }

    if (selected["post_featured_image"]) {
        children.push({ id: "post_image", type: "post_image", props: {} });
    }

    if (selected["post_content"]) { 
       children.push({ id: "post_title", type: "post_title", props: { className: "text-center mb-4" } });
       
       if (selected["post_author_info"] || selected["post_date"] || selected["post_category"] || selected["post_tags"]) {
            children.push({ id: "post_meta", type: "post_meta", props: { className: "justify-center" } }); 
       }
       
       children.push({ id: "post_content", type: "post_content", props: { className: "mx-auto" } });
    }

    if (selected["footer"]) {
        children.push({ id: "footer", type: "footer", props: {} });
    }

    // Wrap in container
    return [
        {
            id: "single-container",
            type: "container",
            props: { className: "py-12" },
            children: children
        }
    ];
}

function buildArchiveLayout(selected: Record<string, boolean>): ComponentNode[] {
    const layout: ComponentNode[] = [];

    if (selected["navbar"]) {
        layout.push({ id: "navbar", type: "navbar", props: {} });
    }

    // Hero
    layout.push({
        id: "hero",
        type: "container",
        props: { className: "py-20 text-center bg-neutral-50 rounded-3xl mb-12" },
        children: [
            { id: "h1", type: "heading", props: { content: "Our Blog", level: 1, className: "text-5xl mb-4" } },
            { id: "p1", type: "text", props: { content: "Latest news, updates, and stories from our team." } }
        ]
    });

    const mainChildren: ComponentNode[] = [];

    if (selected["archive_listing"]) {
        mainChildren.push({ id: "loop", type: "blog_loop", props: {} });
    }

    if (selected["archive_pagination"]) {
        mainChildren.push({ id: "pagination", type: "pagination", props: {} });
    }

    layout.push({
        id: "main",
        type: "container",
        children: mainChildren
    });

    if (selected["footer"]) {
        layout.push({ id: "footer", type: "footer", props: {} });
    }

    return layout;
}

export async function getLayout(type: "single" | "archive") {
    const bindings = await getBindings();
    const selected = bindings?.selected || {};

    // If no bindings file, fallback to default layouts (or all true)
    if (!bindings) {
        return type === "single" ? SINGLE_POST_LAYOUT : ARCHIVE_LAYOUT;
    }

    if (type === "single") {
        return buildSinglePostLayout(selected);
    } else {
        return buildArchiveLayout(selected);
    }
}
