"use client";

import { motion } from "framer-motion";

export default function PricingCTA() {
  return (
    <section className="py-32 px-6 bg-[#2563EB] text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Ready to Build Something Faster?
        </h2>

        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed opacity-90">
          Stop fighting legacy systems. Start with the modern, decoupled
          CoreHead with security, speed, and confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white/10 text-white border border-white/20 font-semibold rounded-md hover:bg-white/20 transition-all backdrop-blur-sm">
            Get Started Now
          </button>
          <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-md hover:bg-slate-100 transition-all shadow-lg">
            Get a Demo
          </button>
        </div>
      </div>
    </section>
  );
}
