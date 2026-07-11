"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { api } from "@/lib/api";
import { useSite } from "@/components/admin/SiteContext";

type PlanCard = {
  id: string;
  label: string;
  priceMonthly: number | null;
  customDomain: boolean;
  features: string[];
  current?: boolean;
};

/**
 * R6 — Demo billing / plan selection per site (no Stripe).
 */
export default function BillingSettingsPage() {
  const { currentSite, currentSiteId, loading: siteLoading, refreshSites } =
    useSite();
  const [plans, setPlans] = useState<PlanCard[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [planStatus, setPlanStatus] = useState("active");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyPlan, setBusyPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const siteId = currentSiteId;

  const load = useCallback(async () => {
    if (!siteId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.getSiteBilling(siteId);
      setPlans(Array.isArray(res.plans) ? res.plans : []);
      setCurrentPlan(res.site?.plan || "free");
      setPlanStatus(res.site?.planStatus || "active");
      setNote(res.note || "");
    } catch (e: any) {
      setError(e?.message || "Failed to load billing");
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSelect = async (planId: string) => {
    if (!siteId || planId === currentPlan) return;
    if (
      planId === "free" &&
      !confirm(
        "Downgrade to Free? Custom domain will be removed if configured.",
      )
    ) {
      return;
    }
    setBusyPlan(planId);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.updateSitePlan(siteId, {
        plan: planId,
        planStatus: planId === "premium" ? "trial" : "active",
      });
      setSuccess(res.message || "Plan updated");
      setCurrentPlan(res.site?.plan || planId);
      setPlanStatus(res.site?.planStatus || "active");
      if (res.billing?.plans) setPlans(res.billing.plans);
      await refreshSites().catch(() => {});
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to update plan");
    } finally {
      setBusyPlan(null);
    }
  };

  if (siteLoading || loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        Loading billing…
      </div>
    );
  }

  if (!siteId || !currentSite) {
    return (
      <p className="p-8 text-center text-slate-500">Select a site first.</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Settings
        </Link>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
          R6 · Billing
        </p>
        <h1 className="text-2xl font-black text-slate-900">
          Plan & billing — {currentSite.name}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Current plan:{" "}
          <span className="font-bold capitalize text-slate-800">
            {currentPlan}
          </span>
          {planStatus !== "active" && (
            <span className="ml-2 text-xs font-bold uppercase tracking-wider text-amber-600">
              {planStatus}
            </span>
          )}
        </p>
      </div>

      {note && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800 flex gap-2">
          <CreditCard className="w-4 h-4 shrink-0 mt-0.5" />
          {note}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan || plan.current;
          const isPremium = plan.id === "premium";
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-white p-6 shadow-sm flex flex-col ${
                isPremium
                  ? "border-blue-300 ring-2 ring-blue-100"
                  : "border-slate-200"
              }`}
            >
              {isPremium && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                  Popular
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                {plan.id === "enterprise" ? (
                  <Sparkles className="w-5 h-5 text-purple-500" />
                ) : plan.id === "premium" ? (
                  <Zap className="w-5 h-5 text-blue-500" />
                ) : (
                  <CreditCard className="w-5 h-5 text-slate-400" />
                )}
                <h3 className="text-lg font-black text-slate-900">
                  {plan.label}
                </h3>
              </div>
              <div className="mb-4">
                {plan.priceMonthly === null ? (
                  <span className="text-2xl font-black text-slate-900">
                    Custom
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-black text-slate-900">
                      ${plan.priceMonthly}
                    </span>
                    <span className="text-slate-400 text-sm font-medium">
                      /mo
                    </span>
                  </>
                )}
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {(plan.features || []).map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isCurrent || busyPlan !== null}
                onClick={() => handleSelect(plan.id)}
                className={`h-11 rounded-xl text-sm font-bold transition-colors inline-flex items-center justify-center gap-2 ${
                  isCurrent
                    ? "bg-slate-100 text-slate-500 cursor-default"
                    : isPremium
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                } disabled:opacity-60`}
              >
                {busyPlan === plan.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isCurrent ? (
                  "Current plan"
                ) : plan.id === "free" ? (
                  "Downgrade"
                ) : (
                  "Select plan"
                )}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 text-center">
        After upgrading, configure a custom domain under{" "}
        <Link
          href="/admin/settings/domain"
          className="font-semibold text-blue-600 hover:underline"
        >
          Domain settings
        </Link>
        .
      </p>
    </div>
  );
}
