"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Globe,
  Loader2,
  ShieldCheck,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useSite } from "@/components/admin/SiteContext";

type DnsInfo = {
  type: string;
  host: string;
  value: string;
  note?: string;
};

/**
 * R6 — Custom domain for the current site (Premium+).
 */
export default function DomainSettingsPage() {
  const { currentSite, currentSiteId, loading: siteLoading, refreshSites } =
    useSite();
  const [domainInput, setDomainInput] = useState("");
  const [customDomain, setCustomDomain] = useState<string | null>(null);
  const [domainStatus, setDomainStatus] = useState("unconfigured");
  const [plan, setPlan] = useState("free");
  const [dns, setDns] = useState<DnsInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const siteId = currentSiteId;

  const load = useCallback(async () => {
    if (!siteId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [siteRes, billingRes] = await Promise.all([
        api.getSiteById(siteId),
        api.getSiteBilling(siteId).catch(() => null),
      ]);
      const site = siteRes?.site || siteRes;
      setCustomDomain(site?.customDomain || null);
      setDomainStatus(site?.domainStatus || "unconfigured");
      setDomainInput(site?.customDomain || "");
      setPlan(
        billingRes?.site?.plan ||
          site?.plan ||
          "free",
      );
      if (site?.customDomain && site?.domainVerifyToken) {
        setDns({
          type: "TXT",
          host: `_corehead.${site.customDomain}`,
          value: `corehead-verify=${site.domainVerifyToken}`,
        });
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load domain settings");
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    load();
  }, [load]);

  const canUseDomain = plan === "premium" || plan === "enterprise";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteId) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.setSiteDomain(siteId, domainInput.trim() || null);
      setSuccess(res.message || "Saved");
      setCustomDomain(res.site?.customDomain || null);
      setDomainStatus(res.site?.domainStatus || "unconfigured");
      if (res.dns) setDns(res.dns);
      else if (!res.site?.customDomain) setDns(null);
      await refreshSites().catch(() => {});
    } catch (err: any) {
      setError(err?.message || "Failed to save domain");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    if (!siteId) return;
    if (!confirm("Remove custom domain from this site?")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await api.setSiteDomain(siteId, null);
      setSuccess(res.message || "Domain removed");
      setCustomDomain(null);
      setDomainStatus("unconfigured");
      setDomainInput("");
      setDns(null);
      await refreshSites().catch(() => {});
    } catch (err: any) {
      setError(err?.message || "Failed to remove domain");
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async (force = false) => {
    if (!siteId) return;
    setVerifying(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.verifySiteDomain(siteId, { force });
      setSuccess(res.message || "Verified");
      setDomainStatus(res.site?.domainStatus || "verified");
      await refreshSites().catch(() => {});
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const copyDns = async () => {
    if (!dns) return;
    const text = `${dns.type} ${dns.host} ${dns.value}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (siteLoading || loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        Loading…
      </div>
    );
  }

  if (!siteId || !currentSite) {
    return (
      <p className="p-8 text-center text-slate-500">Select a site first.</p>
    );
  }

  const statusBadge =
    domainStatus === "verified"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : domainStatus === "pending"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : "bg-slate-50 text-slate-500 border-slate-100";

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Settings
        </Link>
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
          R6 · Domain
        </p>
        <h1 className="text-2xl font-black text-slate-900">Custom domain</h1>
        <p className="text-sm text-slate-500 mt-1">
          Point your own domain at{" "}
          <span className="font-semibold">{currentSite.name}</span> (currently{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">
            /s/{currentSite.slug}
          </code>
          ).
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {!canUseDomain && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-3">
          <p className="text-sm font-bold text-amber-900">
            Custom domains require Premium or Enterprise
          </p>
          <p className="text-sm text-amber-800">
            Your plan is <strong className="capitalize">{plan}</strong>. Upgrade
            under Billing to attach a domain.
          </p>
          <Link
            href="/admin/settings/billing"
            className="inline-flex h-10 px-4 items-center rounded-xl bg-amber-600 text-white text-sm font-bold hover:bg-amber-700"
          >
            Open billing
          </Link>
        </div>
      )}

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-slate-900">Domain</h2>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusBadge}`}
          >
            {domainStatus}
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Hostname
            </label>
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              disabled={!canUseDomain || saving}
              placeholder="blog.acme.com"
              className="mt-1 w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:opacity-50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={!canUseDomain || saving}
              className="h-11 px-5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Save domain
            </button>
            {customDomain && (
              <button
                type="button"
                onClick={handleClear}
                disabled={saving}
                className="h-11 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 inline-flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>
        </form>
      </section>

      {customDomain && domainStatus !== "verified" && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            DNS setup
          </h2>
          <p className="text-sm text-slate-500">
            Add this TXT record at your DNS provider, then verify. (Demo: verify
            confirms ownership without live DNS lookup.)
          </p>
          {dns && (
            <div className="rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs space-y-1 relative">
              <p>
                <span className="text-slate-400">Type:</span> {dns.type}
              </p>
              <p>
                <span className="text-slate-400">Host:</span> {dns.host}
              </p>
              <p className="break-all">
                <span className="text-slate-400">Value:</span> {dns.value}
              </p>
              <button
                type="button"
                onClick={copyDns}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleVerify(false)}
              disabled={verifying}
              className="h-11 px-5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {verifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              Verify DNS
            </button>
            <button
              type="button"
              onClick={() => handleVerify(true)}
              disabled={verifying}
              className="h-11 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              title="Skip live DNS check (local demo)"
            >
              Force verify (demo)
            </button>
          </div>
        </section>
      )}

      {domainStatus === "verified" && customDomain && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
          <p className="font-bold">Domain active</p>
          <p className="mt-1">
            Requests to <strong>{customDomain}</strong> rewrite to{" "}
            <code className="bg-white/60 px-1 rounded">/s/{currentSite.slug}</code>{" "}
            when the app is reached on that host.
          </p>
        </div>
      )}
    </div>
  );
}
