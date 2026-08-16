"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import DetailedFooter from "@/components/DetailedFooter";
import FAQ from "@/components/FAQ";
import GuidesPreview from "@/components/GuidesPreview";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <GuidesPreview />
      <FAQ />
      <CTA />
      <DetailedFooter />
    </main>
  );
}
