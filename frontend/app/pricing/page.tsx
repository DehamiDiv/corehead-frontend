"use client";

import Navbar from "@/components/Navbar";
import PricingHero from "@/components/PricingHero";
import Pricing from "@/components/Pricing";
import DetailedFooter from "@/components/DetailedFooter";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <PricingHero />
      <Pricing />
      <DetailedFooter />
    </main>
  );
}
