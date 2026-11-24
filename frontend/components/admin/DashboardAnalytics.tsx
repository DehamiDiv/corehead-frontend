"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, TrendingUp, FileText, Users, BarChart3, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";

interface DailyViewPoint {
  date: string;
  label: string;
  views: number;
}

interface TopPost {
  id: number;
  title: string;
  slug: string;
  category?: string | null;
  status: string;
  views: number;
  publishedAt?: string | null;
}

interface AnalyticsOverview {
  summary: {
    totalViews: number;
    todayViews: number;
    totalPosts: number;
    publishedPosts: number;
    totalSubscribers: number;
  };
  dailyViews: DailyViewPoint[];
  topPosts: TopPost[];
}

export default function DashboardAnalytics() {
  const [days, setDays] = useState<7 | 14 | 30>(14);
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getAnalyticsOverview(days)
      .then((res) => {
        if (active && res?.summary) {
          setData(res);
        }
      })
      .catch(() => {
        /* ignore if no site selected yet */
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [days]);

  const maxViews = Math.max(
    1,
    ...(data?.dailyViews?.map((d) => d.views) || [1]),
  );

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Traffic &amp; Reader Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time post views, daily reader trends, and newsletter growth for your active site.
          </p>
        </div>
        <div className="inline-flex bg-white border border-slate-200 p-1 rounded-xl shadow-xs">
          {([7, 14, 30] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                days === d
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Post Views</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {loading ? "—" : (data?.summary.totalViews ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Views Today</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {loading ? "—" : (data?.summary.todayViews ?? 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Published Posts</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {loading
              ? "—"
              : `${data?.summary.publishedPosts ?? 0} / ${data?.summary.totalPosts ?? 0}`}
          </p>
        </div>

        <Link
          href="/admin/newsletter"
          className="bg-white border border-slate-200/80 hover:border-blue-300 rounded-2xl p-5 shadow-xs transition group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Newsletter Subscribers</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-extrabold text-slate-900">
              {loading ? "—" : (data?.summary.totalSubscribers ?? 0).toLocaleString()}
            </p>
            <span className="text-[11px] font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition flex items-center gap-0.5">
              Manage <ArrowUpRight size={12} />
            </span>
          </div>
        </Link>
      </div>

      {/* Daily Views Chart + Top Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Views Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daily Post Views</h3>
              <p className="text-xs text-slate-400">Last {days} days reader traffic</p>
            </div>
          </div>

          {loading ? (
            <div className="h-52 flex items-center justify-center text-xs text-slate-400">
              Loading chart...
            </div>
          ) : !data || data.dailyViews.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-xs text-slate-400">
              No traffic data available yet.
            </div>
          ) : (
            <div className="h-52 flex items-end gap-1.5 sm:gap-2 pt-6">
              {data.dailyViews.map((point) => {
                const pct = Math.max(4, Math.round((point.views / maxViews) * 100));
                return (
                  <div
                    key={point.date}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative"
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap pointer-events-none z-10">
                      {point.label}: {point.views} views
                    </div>
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        point.views > 0
                          ? "bg-blue-600 group-hover:bg-blue-700"
                          : "bg-slate-100"
                      }`}
                      style={{ height: `${point.views > 0 ? pct : 6}%` }}
                    />
                    <span className="text-[9px] text-slate-400 mt-2 truncate max-w-full hidden sm:block">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Most Read Posts */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Most Read Posts</h3>
            <Link
              href="/admin/posts"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              All Posts
            </Link>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Loading posts...
            </div>
          ) : !data || data.topPosts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400 text-center py-8">
              Publish posts to start tracking reader views.
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
              {data.topPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/posts/edit/${post.id}`}
                        className="text-xs font-bold text-slate-800 hover:text-blue-600 truncate block"
                      >
                        {post.title}
                      </Link>
                      <p className="text-[10px] text-slate-400 truncate">
                        {post.category || "General"} • {post.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 shrink-0 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                    <Eye size={12} />
                    {post.views}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
