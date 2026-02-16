"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-white mb-6"
        >
          Ready to start blogging?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
        >
          Join thousands of writers who are building faster, better blogs with
          Corehead.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
            Start Writing for Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 bg-blue-700 text-white border border-blue-500 font-bold rounded-full hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl active:scale-95">
            View Pricing
          </button>
        </motion.div>

        <p className="mt-8 text-blue-200 text-sm">
          No credit card required. Free plan available forever.
        </p>
      </div>
    </section>
  );
}
