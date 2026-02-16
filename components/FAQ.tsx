"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Do I need to know how to code?",
    answer:
      "Not at all! Corehead is designed for content creators. You can build beautiful posts using our visual drag-and-drop editor without writing a single line of code.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Yes, you can connect your custom domain to your Corehead blog on all paid plans. We handle the SSL certificates and hosting for you.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, we offer a 14-day free trial for all paid plans. You can also start with our Free forever plan to explore the features.",
  },
  {
    question: "Can I export my content?",
    answer:
      "Absolutely. Your content belongs to you. You can export your posts to Markdown, JSON, or HTML at any time.",
  },
  {
    question: "Do you support multiple team members?",
    answer:
      "Yes! Our Team and Enterprise plans allow you to invite editors, writers, and administrators with different permission levels.",
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
