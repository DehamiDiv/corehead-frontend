"use client";

import React, { useEffect, useState } from "react";
import { Inbox, Mail, Trash2, CheckCircle2, Archive, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

interface Submission {
  id: number;
  formTitle?: string | null;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "archived">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getFormSubmissions(filter);
      setSubmissions(Array.isArray(res?.submissions) ? res.submissions : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load form submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [filter]);

  const handleStatusChange = async (id: number, status: "unread" | "read" | "archived") => {
    try {
      await api.updateFormSubmissionStatus(id, status);
      setSubmissions((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item)),
      );
    } catch {
      /* ignore */
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteFormSubmission(id);
      setSubmissions((prev) => prev.filter((item) => item.id !== id));
    } catch {
      /* ignore */
    }
  };

  const unreadCount = submissions.filter((s) => s.status === "unread").length;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-blue-600" />
            Form Inbox
            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage messages submitted through Contact Form blocks on your site.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSubmissions}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl shadow-xs transition"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(["all", "unread", "read", "archived"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              filter === tab
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-400">
          Loading submissions...
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-16 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
          <Mail className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No form submissions yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Add a Contact Form block in the Visual Builder. Any messages visitors submit will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition ${
                item.status === "unread"
                  ? "bg-blue-50/30 border-blue-200 shadow-xs"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                    <span className="text-xs text-slate-500">&lt;{item.email}&gt;</span>
                    {item.formTitle && (
                      <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {item.formTitle}
                      </span>
                    )}
                    {item.status === "unread" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  {item.subject && (
                    <p className="text-sm font-semibold text-slate-800">{item.subject}</p>
                  )}
                  <p className="text-sm text-slate-600 whitespace-pre-wrap pt-1">
                    {item.message}
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.status !== "read" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, "read")}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="Mark as Read"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  {item.status !== "archived" && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, "archived")}
                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                      title="Archive"
                    >
                      <Archive size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
