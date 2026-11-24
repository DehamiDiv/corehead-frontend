"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Download,
  Search,
  Trash2,
  Send,
  CalendarClock,
  Users,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";

interface Subscriber {
  id: number;
  email: string;
  status: string;
  createdAt: string;
}

interface Campaign {
  id: number;
  subject: string;
  contentHtml: string;
  status: string;
  scheduledAt?: string | null;
  sentAt?: string | null;
  recipientCount: number;
  createdAt: string;
}

export default function NewsletterAdminPage() {
  const [tab, setTab] = useState<"subscribers" | "campaigns">("subscribers");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Campaign composer state
  const [subject, setSubject] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [scheduleMode, setScheduleMode] = useState<"now" | "schedule">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subRes, campRes] = await Promise.all([
        api.getNewsletterSubscribers(search),
        api.getNewsletterCampaigns(),
      ]);
      setSubscribers(Array.isArray(subRes?.subscribers) ? subRes.subscribers : []);
      setCampaigns(Array.isArray(campRes?.campaigns) ? campRes.campaigns : []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const blob = await api.exportNewsletterSubscribersCsv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "newsletter-subscribers.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setFeedback(err?.message || "Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteSubscriber = async (id: number) => {
    try {
      await api.deleteNewsletterSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch {
      /* ignore */
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !contentHtml.trim()) return;
    setSending(true);
    setFeedback(null);
    try {
      const res = await api.createNewsletterCampaign({
        subject: subject.trim(),
        contentHtml: contentHtml.includes("<")
          ? contentHtml
          : `<div style="font-family:sans-serif;line-height:1.6;">${contentHtml.replace(/\n/g, "<br/>")}</div>`,
        scheduledAt: scheduleMode === "schedule" && scheduledAt ? scheduledAt : undefined,
      });
      if (res?.campaign) {
        setCampaigns((prev) => [res.campaign, ...prev]);
        setSubject("");
        setContentHtml("");
        setScheduledAt("");
        setFeedback(
          res.scheduled
            ? "Campaign scheduled successfully!"
            : `Campaign sent to ${res.campaign.recipientCount} subscriber(s)!`,
        );
      }
    } catch (err: any) {
      setFeedback(err?.message || "Failed to send campaign");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    try {
      await api.deleteNewsletterCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-blue-600" />
            Newsletter Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your email subscribers, export CSV lists, and send or schedule campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl shadow-xs transition disabled:opacity-60"
          >
            <Download size={15} />
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
          <button
            type="button"
            onClick={loadData}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-xs transition"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setTab("subscribers")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            tab === "subscribers"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users size={14} />
          Subscribers ({subscribers.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("campaigns")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            tab === "campaigns"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Send size={14} />
          Email Campaigns ({campaigns.length})
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm font-medium">
          {feedback}
        </div>
      )}

      {tab === "subscribers" ? (
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subscriber email..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
            >
              Search
            </button>
          </form>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            {loading ? (
              <div className="py-12 text-center text-sm text-slate-400">
                Loading subscribers...
              </div>
            ) : subscribers.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">
                No subscribers found yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Subscribed Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-medium text-slate-900">{sub.email}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 capitalize">
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubscriber(sub.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Remove subscriber"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Campaign Composer */}
          <form
            onSubmit={handleCreateCampaign}
            className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 h-fit"
          >
            <h2 className="text-base font-bold text-slate-900">
              Compose Campaign
            </h2>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Weekly Digest: Top Stories"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Email Body (Text or HTML)
              </label>
              <textarea
                required
                rows={7}
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
                placeholder="Write your newsletter update here..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-slate-600 block">
                Delivery Timing
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleMode("now")}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                    scheduleMode === "now"
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <Send size={13} /> Send Now
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleMode("schedule")}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                    scheduleMode === "schedule"
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <CalendarClock size={13} /> Schedule
                </button>
              </div>
              {scheduleMode === "schedule" && (
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-60"
            >
              {sending
                ? "Processing..."
                : scheduleMode === "schedule"
                  ? "Schedule Campaign"
                  : `Send to ${subscribers.length} Subscriber(s)`}
            </button>
          </form>

          {/* Campaign History */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              Campaign History
            </h2>
            {campaigns.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-12 text-center text-sm text-slate-400">
                No campaigns created yet.
              </div>
            ) : (
              campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        {camp.subject}
                      </h3>
                      {camp.status === "sent" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={11} /> Sent ({camp.recipientCount})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                          <Clock size={11} /> Scheduled
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {camp.contentHtml.replace(/<[^>]+>/g, " ").trim()}
                    </p>
                    <p className="text-[11px] text-slate-400 pt-1">
                      {camp.status === "scheduled" && camp.scheduledAt
                        ? `Scheduled for: ${new Date(camp.scheduledAt).toLocaleString()}`
                        : camp.sentAt
                          ? `Sent at: ${new Date(camp.sentAt).toLocaleString()}`
                          : `Created: ${new Date(camp.createdAt).toLocaleString()}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCampaign(camp.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                    title="Delete campaign"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
