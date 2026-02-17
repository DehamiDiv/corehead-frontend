import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ComponentType, RenderContext } from "./types";
import { cn } from "@/lib/utils";

// --- Basic Components ---

const Container = ({ children, className, context, ...props }: any) => (
  <div className={cn("container mx-auto px-4", className)} {...props}>
    {children}
  </div>
);

const Row = ({ children, className, context, ...props }: any) => (
  <div className={cn("flex flex-wrap -mx-4", className)} {...props}>
    {children}
  </div>
);

const Column = ({ children, className, width, context, ...props }: any) => (
  <div className={cn("px-4 w-full", width, className)} {...props}>
    {children}
  </div>
);

const Heading = ({ level, content, className, context, ...props }: any) => {
  const Tag = `h${level || 1}` as keyof JSX.IntrinsicElements;
  return <Tag className={cn("font-bold", className)} {...props}>{content}</Tag>;
};

const Text = ({ content, className, context, ...props }: any) => (
  <p className={cn("text-neutral-600", className)} {...props}>{content}</p>
);

const CustomImage = ({ src, alt, width, height, className, context, ...props }: any) => (
  <div className={cn("relative overflow-hidden rounded-lg", className)}>
    <Image 
      src={src || "https://placehold.co/600x400"} 
      alt={alt || "Image"} 
      width={width || 800} 
      height={height || 600}
      className="object-cover w-full h-full"
      {...props} 
    />
  </div>
);

// --- Dynamic/Bound Components ---

const PostTitle = ({ context, className }: { context: RenderContext; className?: string }) => {
  if (!context.post) return null;
  return <h1 className={cn("text-4xl font-extrabold tracking-tight lg:text-5xl mb-4", className)}>{context.post.title}</h1>;
};

const PostContent = ({ context, className }: { context: RenderContext; className?: string }) => {
  if (!context.post) return null;
  return (
    <div 
      className={cn("prose prose-lg dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: context.post.content }}
    />
  );
};

const PostImage = ({ context, className }: { context: RenderContext; className?: string }) => {
  if (!context.post?.image) return <div className="bg-neutral-100 w-full h-64 rounded-xl flex items-center justify-center text-neutral-400">No Image</div>;
  return (
      <div className={cn("relative w-full aspect-video mb-8 overflow-hidden rounded-2xl", className)}>
        <Image
          src={context.post.image}
          alt={context.post.title || "Post Image"}
          fill
          className="object-cover"
        />
      </div>
  );
};

const PostMeta = ({ context, className }: { context: RenderContext; className?: string }) => {
    if (!context.post) return null;
    
    // Safely handle date
    let dateStr = "";
    try {
        if (context.post.date) {
            dateStr = new Date(context.post.date).toLocaleDateString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    } catch (e) {
        console.error("Invalid date:", context.post.date);
    }

    return (
        <div className={cn("flex items-center gap-4 text-sm text-neutral-500 mb-6", className)}>
            <span>{context.post.author?.name || "Unknown Author"}</span>
            {dateStr && (
                <>
                    <span>•</span>
                    <span>{dateStr}</span>
                </>
            )}
        </div>
    );
};

const BlogLoop = ({ context }: { context: RenderContext }) => {
  const posts = context.posts || [];
  if (posts.length === 0) return <div>No posts found.</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post: any) => (
        <Link href={`/blog/${post.slug}`} key={post.slug} className="group block">
            <div className="aspect-video relative overflow-hidden rounded-xl bg-neutral-100 mb-4">
                {post.image && (
                   <Image src={post.image} alt={post.title} fill className="object-cover transition group-hover:scale-105" />
                )}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">{post.title}</h3>
            <p className="text-neutral-600 line-clamp-2">{post.excerpt}</p>
        </Link>
      ))}
    </div>
  );
};

const Navbar = ({ className }: { className?: string }) => (
    <nav className={cn("border-b bg-white/80 backdrop-blur-md sticky top-0 z-50", className)}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg text-white flex items-center justify-center">C</div>
                CoreHead
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
                <Link href="#" className="hover:text-blue-600 transition">Features</Link>
                <Link href="#" className="hover:text-blue-600 transition">Pricing</Link>
                <Link href="#" className="hover:text-blue-600 transition">Blog</Link>
                <Link href="#" className="hover:text-blue-600 transition">Contact</Link>
            </div>
             <div className="flex items-center gap-4">
                <Link href="/admin" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Sign in</Link>
                <Link href="#" className="btn btn-primary text-sm px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition">Get Started</Link>
            </div>
        </div>
    </nav>
);

const Footer = ({ className }: { className?: string }) => (
    <footer className={cn("bg-neutral-50 border-t py-12 mt-20", className)}>
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
            <div>
                 <Link href="/" className="font-bold text-xl flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg text-white flex items-center justify-center">C</div>
                    CoreHead
                </Link>
                <p className="text-neutral-500 text-sm">
                    Building the future of digital experiences with modern web technologies.
                </p>
            </div>
             <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                    <li><Link href="#" className="hover:text-neutral-900">Features</Link></li>
                    <li><Link href="#" className="hover:text-neutral-900">Integrations</Link></li>
                    <li><Link href="#" className="hover:text-neutral-900">Pricing</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                    <li><Link href="#" className="hover:text-neutral-900">About</Link></li>
                    <li><Link href="#" className="hover:text-neutral-900">Blog</Link></li>
                    <li><Link href="#" className="hover:text-neutral-900">Careers</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                    <li><Link href="#" className="hover:text-neutral-900">Privacy</Link></li>
                    <li><Link href="#" className="hover:text-neutral-900">Terms</Link></li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t text-center text-sm text-neutral-400">
            © {new Date().getFullYear()} CoreHead Inc. All rights reserved.
        </div>
    </footer>
);

const Pagination = ({ className }: { className?: string }) => (
    <div className={cn("flex justify-center gap-2 mt-12", className)}>
        <button className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-neutral-50 text-neutral-600 disabled:opacity-50" disabled>
            ←
        </button>
        <button className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">1</button>
        <button className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-neutral-50 text-neutral-600">2</button>
        <button className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-neutral-50 text-neutral-600">3</button>
         <button className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-neutral-50 text-neutral-600">
            →
        </button>
    </div>
);

// --- Registry Map ---

export const COMPONENT_REGISTRY: Record<ComponentType, React.ComponentType<any>> = {
  container: Container,
  row: Row,
  column: Column,
  heading: Heading,
  text: Text,
  image: CustomImage,
  button: ({ label, href, className }) => <Link href={href || "#"} className={cn("btn btn-primary", className)}>{label}</Link>,
  
  // Dynamic
  post_title: PostTitle,
  post_content: PostContent,
  post_image: PostImage,
  post_meta: PostMeta,
  blog_loop: BlogLoop,
  navbar: Navbar,
  footer: Footer,
  pagination: Pagination,
};
