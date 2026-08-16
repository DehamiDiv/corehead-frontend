"use client";

import Navbar from "@/components/Navbar";
import PricingHero from "@/components/PricingHero";
import Pricing from "@/components/Pricing";
import PricingTestimonials from "@/components/PricingTestimonials";
import PricingFAQ from "@/components/PricingFAQ";
import PricingCTA from "@/components/PricingCTA";
import DetailedFooter from "@/components/DetailedFooter";
import { PenTool, Users, Search } from "lucide-react";

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
