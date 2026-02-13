"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How does Corehead compare to Vercel or Netlify?",
    answer:
      "Corehead provides a more granular control over your infrastructure while maintaining the ease of use you expect. We offer specialized tools for Go and Next.js hybrid deployments that give you better performance at scale.",
  },
  {
    question: "Can I host my own database?",
    answer:
      "Absolutely. While we offer managed PostgreSQL, you can easily connect to any external database or host your own within your private VPC on our platform.",
  },
  {
    question: "Is there a free trial for the Pro plan?",
    answer:
      "Yes, we offer a 14-day free trial for all paid plans. No credit card is required to start your trial.",
  },
  {
    question: "Do you offer migration assistance?",
    answer:
      "Yes! Our enterprise plan includes dedicated migration support. For other plans, we have comprehensive documentation and community guides to help you switch.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "All plans include community support. Pro plans get priority email support with 24h response time, and Enterprise plans receive 24/7 dedicated phone and Slack support.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 mb-16">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-semibold text-slate-900 text-lg">
                  {faq.question}
                </span>
                <span
                  className={`p-2 rounded-full transition-colors ${openIndex === index ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
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
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">
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
