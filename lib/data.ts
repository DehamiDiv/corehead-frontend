import { ComponentNode } from "@/lib/page-renderer/types";
import { getBindings } from "@/app/admin/binding/actions";

// Mock Layouts - keeping them for fallback or if bindings are missing
export const SINGLE_POST_LAYOUT: ComponentNode[] = [
  { id: "nav", type: "navbar", props: {} },
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
  },
  { id: "footer", type: "footer", props: {} }
];

export const ARCHIVE_LAYOUT: ComponentNode[] = [
    { id: "nav", type: "navbar", props: {} },
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
    },
    { id: "footer", type: "footer", props: {} }
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
        content: `<h2>Master Tailwind CSS Like a Pro</h2>

<p>Tailwind CSS has revolutionized how we approach styling in modern web development. Here are 10 essential tips to take your Tailwind skills to the next level.</p>

<h3>1. Leverage @apply for Component Styles</h3>

<p>While Tailwind promotes utility-first CSS, sometimes you need to extract common patterns. Use @apply in your CSS files to group utilities:</p>

<pre><code class="language-css">.btn-primary {
  @apply px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
}</code></pre>

<h3>2. Customize Your Color Palette</h3>

<p>Don't settle for default colors. Extend your <code>tailwind.config.js</code> with brand-specific colors:</p>

<pre><code class="language-javascript">module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        }
      }
    }
  }
}</code></pre>

<h3>3. Use Arbitrary Values Wisely</h3>

<p>Need a specific value not in your scale? Use square brackets:</p>

<pre><code class="language-html">&lt;div class="top-[117px] w-[347px]"&gt;</code></pre>

<p>But don't overuse this—it defeats the purpose of a design system.</p>

<h3>4. Master Responsive Design Modifiers</h3>

<p>Tailwind's mobile-first breakpoints make responsive design a breeze:</p>

<pre><code class="language-html">&lt;div class="text-sm md:text-base lg:text-lg xl:text-xl"&gt;</code></pre>

<h3>5. Group Hover and Focus States</h3>

<p>Create interactive components with group utilities:</p>

<pre><code class="language-html">&lt;div class="group"&gt;
  &lt;img class="group-hover:opacity-75" /&gt;
  &lt;p class="group-hover:text-blue-600"&gt;Text&lt;/p&gt;
&lt;/div&gt;</code></pre>

<h3>6. Utilize Container Queries</h3>

<p>Modern Tailwind supports container queries for truly responsive components:</p>

<pre><code class="language-html">&lt;div class="@container"&gt;
  &lt;div class="@lg:grid @lg:grid-cols-2"&gt;</code></pre>

<h3>7. Dark Mode Support</h3>

<p>Implement dark mode effortlessly:</p>

<pre><code class="language-html">&lt;div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"&gt;</code></pre>

<h3>8. Typography Plugin</h3>

<p>Install the official typography plugin for beautiful prose:</p>

<pre><code class="language-html">&lt;article class="prose prose-lg dark:prose-invert"&gt;
  &lt;!-- Your markdown/HTML content --&gt;
&lt;/article&gt;</code></pre>

<h3>9. Optimize for Production</h3>

<p>Always purge unused styles in production. Tailwind's JIT mode already does this, but verify your <code>content</code> paths are correct:</p>

<pre><code class="language-javascript">content: [
  './pages/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
]</code></pre>

<h3>10. Use Plugins for Extended Functionality</h3>

<p>Explore the ecosystem of Tailwind plugins:</p>
<ul>
<li>@tailwindcss/forms</li>
<li>@tailwindcss/typography</li>
<li>@tailwindcss/aspect-ratio</li>
<li>@tailwindcss/line-clamp</li>
</ul>

<h2>Conclusion</h2>

<p>These tips will help you write cleaner, more maintainable Tailwind CSS. Remember: the utility-first approach shines when you embrace the constraints of the design system while knowing when to extend it for your specific needs.</p>

<p>Happy styling! 🎨</p>`,
        image: "https://placehold.co/1200x600/06b6d4/ffffff?text=Tailwind+CSS+Tips+%26+Tricks",
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
    if (selected["navbar"] !== false) {
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

    if (selected["footer"] !== false) {
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

    if (selected["navbar"] !== false) {
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

    if (selected["footer"] !== false) {
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
