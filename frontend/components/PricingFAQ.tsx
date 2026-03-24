"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is CoreHead?",
    answer:
      "CoreHead is a modern, headless CMS designed for performance and flexibility. It separates your content from your frontend code, allowing you to build faster and more secure websites.",
  },
  {
    question: "Do I need technical knowledge to use CoreHead?",
    answer:
      "No, CoreHead provides a visual editor that allows content creators to work without code. However, developers will love our API-first approach.",
  },
  {
    question: "Does CoreHead support SEO features?",
    answer:
      "Yes, we include built-in SEO tools, automatic sitemap generation, and metadata management to ensure your content ranks well.",
  },
  {
    question: "Can I manage multiple authors?",
    answer:
      "Absolutely. You can invite unlimited team members and assign specific roles and permissions to control access.",
  },
];

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 md:px-12 bg-slate-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Left Side */}
        <div className="lg:w-1/3">
          <div className="inline-block px-4 py-2 bg-slate-200/60 rounded-full text-slate-600 font-medium text-xs tracking-wide uppercase mb-6">
            FAQs
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions?
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Get answers to common questions about deployment, the tech stack,
            and managing your content with CoreHead.
          </p>
          <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-full text-sm hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-700/20 active:scale-95">
            More Questions
          </button>
        </div>

        {/* Right Side - Accordion */}
        <div className="lg:w-2/3 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-semibold text-slate-900 text-sm md:text-base">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-45" : ""}`}
                >
                  <Plus
                    className={`w-5 h-5 ${openIndex === index ? "text-slate-400" : "text-slate-400"}`}
                  />
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
