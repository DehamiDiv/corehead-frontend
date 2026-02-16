"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for hobby projects and experiments.",
    features: [
      "1 Blog",
      "1,000 Monthly Views",
      "Community Support",
      "Basic Themes",
    ],
    cta: "Start for Free",
    popular: false,
  },
  {
    name: "Growth",
    price: "$29",
    period: "/mo",
    description: "For serious bloggers and growing publications.",
    features: [
      "Unlimited Blogs",
      "50,000 Monthly Views",
      "Priority Support",
      "Advanced Analytics",
      "Custom Domains",
      "Remove Branding",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large media companies and organizations.",
    features: [
      "Unlimited Everything",
      "24/7 Dedicated Support",
      "SLA Guarantee",
      "SSO & Security",
      "Custom Themes",
      "API Access",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your needs. Always transparent, no
            hidden fees.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${!isAnnual ? "text-blue-600" : "text-slate-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 bg-slate-200 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all ${isAnnual ? "left-7" : "left-1"}`}
              />
            </button>
            <span
              className={`text-sm font-medium ${isAnnual ? "text-blue-600" : "text-slate-500"}`}
            >
              Yearly{" "}
              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full ml-1">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl bg-white border ${plan.popular ? "border-blue-500 ring-4 ring-blue-500/10" : "border-slate-200"} shadow-lg hover:shadow-xl transition-all flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-slate-500">{plan.period}</span>
                  )}
                </div>
                <p className="text-slate-600 text-sm">{plan.description}</p>
              </div>

              <div className="flex-grow mb-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm text-slate-700"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
