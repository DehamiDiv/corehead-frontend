"use client";

import { motion } from "framer-motion";

export default function PricingHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-blue-100">
      <div className="absolute inset-x-0 top-0 h-full w-full bg-gradient-to-b from-blue-300 to-blue-200 opacity-50"></div>
      {/* Background Blur Effects similar to Landing Hero but adjusted */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/4 w-[70%] aspect-square rounded-full bg-blue-400/20 blur-3xl"></div>
        <div className="absolute top-[20%] right-0 w-[50%] aspect-square rounded-full bg-purple-300/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl px-6 mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight"
        >
          Powerful features to help you manage all
          <br />
          your leads
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto text-slate-600 text-lg"
        >
          We make crypto simple, secure, and accessible for everyone. Our
          platform help you grow confidently in the digital economy.
        </motion.p>
      </div>
    </section>
  );
}
