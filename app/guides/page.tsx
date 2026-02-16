"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuidesHero from "@/components/GuidesHero";
import GuideCard from "@/components/GuideCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import CTA from "@/components/CTA"; // Assuming CTA component exists based on file list

const quickstartGuides = [
  {
    title: "Deploy CoreHead on Docker",
    description:
      "Learn how to get a production-ready instance running in under 5 minutes using Docker Compose.",
    tags: ["React", "Nodejs"],
    link: "#",
  },
  {
    title: "Next.js Blog Starter Kit",
    description:
      "Connect your Next.js frontend to the CoreHead API and build a static blog with ISR.",
    tags: ["Nextjs", "Typescript"],
    link: "#",
  },
  {
    title: "PostgreSQL Database Schema",
    description:
      "Understand how CoreHead structures content and how to extend the database directly.",
    tags: ["Postgresql", "Sql"],
    link: "#",
  },
];

const buildGuides = [
  {
    title: "Building a Custom Plugin",
    description:
      "Extend the dashboard functionality by writing custom Go plugins for the backend.",
    tags: ["Go", "Plugin"],
    link: "#",
  },
  {
    title: "Webhooks & Automation",
    description:
      "Trigger build pipelines in Vercel or Netlify whenever content is published.",
    tags: ["Webhooks", "Automation"],
    link: "#",
  },
  {
    title: "Multi-Language Setup",
    description:
      "Configure localization and manage translations for a global audience.",
    tags: ["I18n", "Translation"],
    link: "#",
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
