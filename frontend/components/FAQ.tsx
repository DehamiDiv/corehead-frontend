import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is CoreHead?",
    answer:
      "CoreHead is a high-performance headless CMS and blogging platform built for speed, collaboration, SEO, and scalable content management. It lets you create blogs, pages, authors, metadata, and more with ease.",
  },
  {
    question: "Do I need technical knowledge to use CoreHead?",
    answer:
      "No, CoreHead offers a visual builder and intuitive interface that allows non-technical users to create and manage content easily, while providing powerful APIs for developers.",
  },
  {
    question: "Does CoreHead support SEO features?",
    answer:
      "Yes, CoreHead comes with built-in SEO controls, automatic sitemaps, and optimized metadata management to help your content rank better on search engines.",
  },
  {
    question: "Can I manage multiple authors?",
    answer:
      "Absolutely. CoreHead supports role-based access control, allowing you to manage authors, editors, and admins with different permissions seamlessly.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Column */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
              Frequently <br />
              Asked Questions
            </h2>

            <p className="text-xl text-slate-500 leading-relaxed max-w-md">
              Get answers to common questions about deployment, the tech stack,
              and managing your content with CoreHead.
            </p>
          </div>

          {/* Right Column - Accordion */}
          <div className="divide-y divide-slate-100">
            {faqs.map((faq, index) => (
              <div key={index} className="py-8 first:pt-0 last:pb-0">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full flex items-start justify-between text-left focus:outline-none group"
                >
                  <span
                    className={`font-bold text-2xl transition-colors pr-8 ${openIndex === index ? "text-[#0066FF]" : "text-slate-900"}`}
                  >
                    {faq.question}
                  </span>
                  <span className="shrink-0 mt-2">
                    {openIndex === index ? (
                      <Minus className="w-8 h-8 text-slate-400" />
                    ) : (
                      <Plus className="w-8 h-8 text-slate-400 group-hover:text-slate-900 transition-colors" />
                    )}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="mt-6 text-xl text-slate-500 leading-relaxed max-w-2xl">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
