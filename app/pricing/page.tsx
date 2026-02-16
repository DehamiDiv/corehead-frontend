"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingHero from "@/components/PricingHero";
import Pricing from "@/components/Pricing";
import { PenTool, Users, Search } from "lucide-react";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <PricingHero />

      {/* Features Subset Section */}
      <section className="py-24 px-6 md:px-12 bg-white flex justify-center">
        <div className="max-w-7xl w-full">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
              Everything you need to build
              <br />
              and scale your content
            </h2>
            <div className="flex justify-end mt-[-3rem]">
              <p className="text-slate-400 text-xs max-w-xs text-right hidden md:block">
                Streamline your publishing workflow with a platform engineered
                for speed, collaboration, and SEO success. No bloat, just
                performance.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                <PenTool className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Smart Content Editor
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Write, format, and publish blog posts with our intuitive editor.
                Supports markdown, rich media embedding, and real-time preview
                for seamless content creation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Team Collaboration Hub
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Manage multiple authors with role-based permissions. Streamline
                your workflow with draft reviews, content approval, and team
                activity tracking all in one place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              {/* Note: Title in image said "Team Collaboration Hub" again but text was about Optimization */}
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                SEO Optimization
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Optimize every post with AI friendly metadata, automatic
                sitemaps and analytics integration. Get your content discovered
                and track what's working.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Pricing />
      <Footer />
    </main>
  );
}
