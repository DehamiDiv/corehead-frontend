"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["50 Assets", "Unlimited users", "Email Support"],
    cta: "Start Now",
    variant: "light",
  },
  {
    name: "Premium",
    price: "$20",
    period: "/month",
    features: [
      "50 Assets",
      "Unlimited Users",
      "Email Supports",
      "Chat Supports",
      "API & Integrations",
    ],
    cta: "Start 14-day trial",
    variant: "premium",
  },
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["50 Assets", "Unlimited users", "Email Support"],
    cta: "Start Now",
    variant: "light",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-[#2563EB]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Plans & Pricing
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Simple, transparent pricing. No setup fees or contracts.
            <br />
            Try without a credit card, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-3xl overflow-hidden ${
                plan.variant === "premium"
                  ? "bg-white transform scale-105 shadow-2xl z-10"
                  : "bg-white"
              }`}
            >
              {plan.variant === "premium" && (
                <div className="bg-gradient-to-r from-blue-700 to-indigo-600 p-6 text-white">
                  <h3 className="text-sm font-semibold uppercase tracking-wider opacity-90">
                    Premium
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-white/80">{plan.period}</span>
                  </div>
                </div>
              )}

              <div
                className={`p-8 ${plan.variant === "premium" ? "pt-6" : ""}`}
              >
                {plan.variant === "light" && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900">
                        {plan.price}
                      </span>
                      <span className="text-slate-500">{plan.period}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm font-medium text-slate-700"
                    >
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <button className="w-full py-3 px-6 rounded-full bg-black text-white font-bold text-sm hover:bg-slate-800 transition-colors">
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
