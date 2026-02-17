"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-24 px-6 relative bg-blue-600 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-blue-600" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-white mb-6"
        >
          Ready to Build Something Faster?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-blue-100 text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Stop fighting legacy systems. Start with the modern, decoupled
          CoreHead with security, speed, and confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="px-8 py-3.5 bg-blue-500/20 backdrop-blur-sm border border-blue-400 text-white font-semibold rounded-lg hover:bg-blue-500/30 transition-all">
            Get Started Now
          </button>

          <button className="px-8 py-3.5 bg-white text-slate-900 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg active:scale-95">
            Get a Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
