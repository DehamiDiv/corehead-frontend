"use client";

import { motion } from "framer-motion";

export default function PricingHero() {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden bg-gradient-to-b from-blue-50 to-white text-slate-900 border-b border-slate-100">
      {/* Subtle light grid background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>

      {/* Decorative Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] left-1/4 w-[60%] aspect-square rounded-full bg-blue-400/10 blur-[130px]"></div>
        <div className="absolute top-[10%] right-[-10%] w-[40%] aspect-square rounded-full bg-indigo-300/10 blur-[130px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl px-6 mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-none tracking-tight"
        >
          Scale your writing with the
          <br />
          power of CoreHead Pro
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-normal leading-relaxed"
        >
          Bring layout templates, SEO tools, and AI generation to your site. Choose
          your favorite plan and deploy anywhere instantaneously.
        </motion.p>
      </div>
    </section>
  );
}
