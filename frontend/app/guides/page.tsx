"use client";


import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuidesHero from "@/components/GuidesHero";
import GuideCard from "@/components/GuideCard";
import { ArrowRight, BookOpen, Cpu, ShieldCheck, Database, Globe, Zap } from "lucide-react";
import Link from "next/link";
import CTA from "@/components/CTA";

const quickstartGuides = [
  {
    title: "Project Initialization & Setup",
    description:
      "Learn how to configure your environment variables and get the CoreHead backend running with PostgreSQL in minutes.",
    tags: ["Setup", "Node.js", "Prisma"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    link: "/guides/setup",
  },
  {
    title: "Mastering the AI Layout Builder",
    description:
      "A complete guide on using generative AI to create dynamic blog layouts and landing pages with zero coding required.",
    tags: ["AI Builder", "Design", "Automation"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    link: "/admin/builder",
  },
  {
    title: "Secure Auth with JWT & OTP",
    description:
      "Understanding the multi-layer security flow: From bcrypt password hashing to secure OTP email verification.",
    tags: ["Security", "JWT", "Auth"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80",
    link: "/guides/auth",
  },
];

const buildGuides = [
  {
    title: "Prisma Schema & Migrations",
    description:
      "Step-by-step tutorial on extending content models, defining relationships, and running database migrations safely.",
    tags: ["Prisma", "PostgreSQL", "Backend"],
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    link: "/guides/database",
  },
  {
    title: "RESTful API Integration",
    description:
      "How to consume CoreHead's headless API endpoints in your React components or third-party mobile applications.",
    tags: ["API", "Integration", "Webhooks"],
    image: "https://images.unsplash.com/photo-1623282033815-40b05d96c9bb?auto=format&fit=crop&w=800&q=80",
    link: "/guides/api",
  },
  {
    title: "Optimizing for Next.js 14",
    description:
      "Leveraging Server Components and Incremental Static Regeneration (ISR) for maximum SEO and performance.",
    tags: ["Next.js", "SEO", "Speed"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    link: "/guides/performance",
  },
];

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <GuidesHero />

      {/* Quickstart Guides Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Quickstart guides
              </h2>
              <p className="text-slate-500">
                Get up and running with CoreHead in minutes.
              </p>
            </div>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 px-4 py-2 rounded-full border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              View more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickstartGuides.map((guide, index) => (
              <GuideCard key={index} {...guide} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Build Application Section */}
      <section className="py-20 px-6 md:px-12 bg-white boundary-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Build an application
              </h2>
              <p className="text-slate-500">
                Deep dives into building complex applications.
              </p>
            </div>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 px-4 py-2 rounded-full border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              View more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {buildGuides.map((guide, index) => (
              <GuideCard key={index} {...guide} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  );
}
