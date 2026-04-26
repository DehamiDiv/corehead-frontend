import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["50 Assets", "Unlimited users", "Email Support"],
    cta: "Get Started Now",
    variant: "light",
  },
  {
    name: "Premium",
    price: "$20",
    period: "/month",
    features: [
      "50 Assets",
      "Unlimited Users",
      "Email Support",
      "Chat Support",
      "API & Integrations",
    ],
    cta: "Start 14-day Trial",
    variant: "premium",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "Unlimited Assets",
      "Unlimited users",
      "24/7 Priority Support",
      "Custom SLA",
      "Dedicated Success Manager",
    ],
    cta: "Contact Sales",
    variant: "light",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 px-6 bg-[#2563EB]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Plans & Pricing
          </h2>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto leading-relaxed">
            Simple, transparent pricing. No setup fees or contracts.
            Try without a credit card, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-[40px] overflow-hidden bg-white shadow-2xl transition-transform duration-300 hover:-translate-y-2 ${
                plan.variant === "premium" ? "scale-105 z-10" : "scale-100 opacity-95"
              }`}
            >
              {plan.variant === "premium" && (
                <div className="h-28 bg-gradient-to-r from-blue-400 to-cyan-300 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Premium
                  </h3>
                </div>
              )}

              <div className="p-10">
                {plan.variant === "light" && (
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    {plan.name}
                  </h3>
                )}

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-6xl font-bold text-slate-900 tracking-tighter">
                    {plan.price}
                  </span>
                  <span className="text-xl text-slate-500 font-medium">{plan.period}</span>
                </div>

                <div className="space-y-5 mb-10">
                  {plan.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 text-base font-semibold text-slate-700"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-blue-600" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <Link 
                    href="/signup"
                    className="block w-full py-4 px-8 rounded-full bg-[#111111] text-white font-bold text-lg text-center hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
