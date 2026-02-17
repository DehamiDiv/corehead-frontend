"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is CoreHead?",
    answer:
      "CoreHead is an ultra-lightweight, high-performance CMS built on Go and Next.js, designed for speed and ease of use.",
  },
  {
    question: "Do I need technical knowledge to use CoreHead?",
    answer:
      "No, CoreHead offers a visual builder and intuitive interface that allows non-technical users to create and manage content easily.",
  },
  {
    question: "Does CoreHead support SEO features?",
    answer:
      "Yes, CoreHead comes with built-in SEO controls, automatic sitemaps, and optimized metadata management to help your content rank better.",
  },
  {
    question: "Can I manage multiple authors?",
    answer:
      "Absolutely. CoreHead supports role-based access control, allowing you to manage authors, editors, and admins with different permissions.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 md:px-12 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              FAQs
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
              Frequently Asked Questions?
            </h2>

            <p className="text-lg text-slate-500 leading-relaxed max-w-md">
              Get answers to common questions about deployment, the tech stack,
              and managing your content with CoreHead.
            </p>

            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
              More Questions
            </button>
          </div>

          {/* Right Column - Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                >
                  <span
                    className={`font-semibold text-lg transition-colors ${openIndex === index ? "text-blue-600" : "text-slate-900"}`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 ml-4 p-1 rounded-full transition-colors ${openIndex === index ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-400 group-hover:text-slate-600"}`}
                  >
                    {openIndex === index ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </span>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
