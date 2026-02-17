"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoCloud from "@/components/LogoCloud";
import Features from "@/components/Features";
import GridFeatures from "@/components/GridFeatures";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import DetailedFooter from "@/components/DetailedFooter";
import FAQ from "@/components/FAQ";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <LogoCloud />
      <Features />
      <GridFeatures />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <DetailedFooter />
    </main>
  );
}
