"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

type PartKey =
  | "navbar"
  | "footer"
  | "featuredImage"
  | "postContent"
  | "authorInfo"
  | "postDate"
  | "categoryLink"
  | "tagLinks"
  | "postsListing"
  | "pagination";

type Group = {
  title: string;
  subtitle?: string;
  items: { key: PartKey; label: string; hint?: string }[];
};

const GROUPS: Group[] = [
  {
    title: "Post Parts",
    subtitle: "5 fields",
    items: [
      { key: "navbar", label: "Navbar" },
      { key: "footer", label: "Footer" },
      { key: "featuredImage", label: "Featured Image" },
      { key: "postContent", label: "Post Content" },
      { key: "authorInfo", label: "Author Info" },
    ],
  },
  {
    title: "Post Meta",
    subtitle: "3 fields",
    items: [
      { key: "postDate", label: "Post Date" },
      { key: "categoryLink", label: "Category Link" },
      { key: "tagLinks", label: "Tag Links" },
    ],
  },
  {
    title: "Archive Parts",
    subtitle: "2 fields",
    items: [
      { key: "postsListing", label: "Posts Listing" },
      { key: "pagination", label: "Pagination" },
    ],
  },
];

const DEFAULT_SELECTED: Record<PartKey, boolean> = {
  navbar: true,
  footer: true,
  featuredImage: true,
  postContent: true,
  authorInfo: true,
  postDate: true,
  categoryLink: true,
  tagLinks: true,
  postsListing: true,
  pagination: true,
};

export default function BindingsPage() {
  const [mode, setMode] = useState<"dynamic" | "static">("dynamic");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<PartKey, boolean>>(
    DEFAULT_SELECTED
  );

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((it) => it.label.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  function toggleKey(key: PartKey) {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function setAll(val: boolean) {
    setSelected((prev) => {
      const next = { ...prev };
      (Object.keys(next) as PartKey[]).forEach((k) => (next[k] = val));
      return next;
    });
  }

  function onSave() {
    // Replace this with API call / persistence
    console.log("MODE:", mode);
    console.log("SELECTED:", selected);
    alert("Bindings saved (demo). Check console for output.");
  }

  return (
    <div className="min-h-screen bg-neutral-950/60 p-6">
      {/* Modal */}
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white font-bold">
              C
            </div>
            <div className="font-semibold text-neutral-800">CoreHead</div>
          </div>

          <Link
            href="#"
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full border text-neutral-500 hover:bg-neutral-50"
          >
            ✕
          </Link>
        </div>

        {/* Title */}
        <div className="px-6 pt-6">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            SELECT PARTS TO RENDER
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Bind template elements to render dynamic <b>Single</b> Post and{" "}
            <b>Archive</b> pages.
          </p>
        </div>

        {/* Body */}
        <div className="grid gap-6 px-6 pb-6 pt-6 md:grid-cols-[340px_1fr]">
          {/* Left panel */}
          <div className="space-y-4">
            {/* Mode tabs */}
            <div className="flex w-full overflow-hidden rounded-xl border bg-neutral-50">
              <button
                onClick={() => setMode("dynamic")}
                className={[
                  "flex-1 px-4 py-2 text-sm font-medium",
                  mode === "dynamic"
                    ? "bg-blue-600 text-white"
                    : "text-neutral-700 hover:bg-white",
                ].join(" ")}
              >
                ⚡ Dynamic
              </button>
              <button
                onClick={() => setMode("static")}
                className={[
                  "flex-1 px-4 py-2 text-sm font-medium",
                  mode === "static"
                    ? "bg-blue-600 text-white"
                    : "text-neutral-700 hover:bg-white",
                ].join(" ")}
              >
                📌 Static
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Fields..."
                className="w-full rounded-xl border bg-white px-11 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                🔎
              </span>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setAll(true)}
                className="flex-1 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-neutral-50"
              >
                Select all
              </button>
              <button
                onClick={() => setAll(false)}
                className="flex-1 rounded-xl border bg-white px-3 py-2 text-sm hover:bg-neutral-50"
              >
                Clear
              </button>
            </div>

            {/* Groups */}
            <div className="space-y-4">
              {filteredGroups.map((g) => (
                <div key={g.title} className="rounded-2xl border bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-neutral-800">
                      {g.title}
                    </div>
                    {g.subtitle ? (
                      <div className="text-xs text-neutral-500">
                        {g.subtitle}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-3 space-y-2">
                    {g.items.map((it) => (
                      <label
                        key={it.key}
                        className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-neutral-50"
                      >
                        <input
                          type="checkbox"
                          checked={selected[it.key]}
                          onChange={() => toggleKey(it.key)}
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span className="text-sm text-neutral-800">
                          {it.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-6">

            {/* Post Preview */}
            <div>
              <div className="mb-2 font-semibold text-neutral-800">
                Post Parts
              </div>

              <div className="overflow-hidden rounded-2xl border bg-white">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                      C
                    </div>
                    <div className="text-sm font-medium text-neutral-700">
                      CoreHead
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="h-2 w-10 rounded bg-neutral-200" />
                    <span className="h-2 w-10 rounded bg-neutral-200" />
                  </div>
                </div>

                {/* Navbar Preview */}
                {selected.navbar && (
                  <div className="border-b bg-white px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-20 rounded bg-neutral-200" />
                      <div className="flex gap-3">
                        <div className="h-4 w-12 rounded bg-neutral-100" />
                        <div className="h-4 w-12 rounded bg-neutral-100" />
                        <div className="h-4 w-12 rounded bg-neutral-100" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Featured image */}
                {selected.featuredImage && (
                  <div className="px-4 pt-4">
                    <div className="h-44 w-full rounded-2xl bg-neutral-200" />
                  </div>
                )}

                <div className="px-6 py-5">
                  <h2 className="text-2xl font-semibold leading-snug text-neutral-900">
                    How to Build a Modern Blog with Next.js and Headless CMS
                  </h2>

                  {/* meta row */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                    {selected.authorInfo && (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-7 w-7 rounded-full bg-neutral-300" />
                        John Doe
                      </span>
                    )}
                    {selected.postDate && <span>• April 12, 2024</span>}
                    <span>• 9 min</span>
                    {selected.categoryLink && (
                      <span className="text-blue-600">Web Development</span>
                    )}
                    {selected.tagLinks && (
                      <div className="flex gap-2">
                        <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                          #nextjs
                        </span>
                        <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                          #react
                        </span>
                      </div>
                    )}
                  </div>

                  {/* content */}
                  {selected.postContent && (
                    <div className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
                      <p>
                        In today’s fast-paced digital world, building a modern
                        blog requires flexible and fast technology.
                      </p>
                      <div className="rounded-xl bg-neutral-100 px-4 py-3 font-mono text-xs text-neutral-700">
                        npm install next
                      </div>
                      <p>
                        This section demonstrates dynamic rendering using a JSON
                        layout and binding resolver.
                      </p>
                    </div>
                  )}

                  {/* author card */}
                  {selected.authorInfo && (
                    <div className="mt-6 grid gap-4 md:grid-cols-[1fr_320px]">
                      <div className="rounded-2xl border bg-white p-4">
                        <div className="text-xs font-semibold text-neutral-500">
                          Share
                        </div>
                        <div className="mt-3 flex gap-2">
                          <div className="h-9 w-9 rounded-xl bg-neutral-100" />
                          <div className="h-9 w-9 rounded-xl bg-neutral-100" />
                          <div className="h-9 w-9 rounded-xl bg-neutral-100" />
                        </div>
                      </div>

                      <div className="rounded-2xl border bg-white p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-neutral-300" />
                          <div>
                            <div className="font-semibold text-neutral-900">
                              JOHN DOE
                            </div>
                            <div className="text-xs text-neutral-500">
                              Tech writer • Web developer
                            </div>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-neutral-600">
                          Tech blogger and web developer focused on building
                          modern web applications.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Preview */}
                {selected.footer && (
                  <div className="border-t bg-neutral-50 px-6 py-8">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <div className="h-5 w-24 rounded bg-neutral-200" />
                        <div className="h-3 w-full rounded bg-neutral-200" />
                        <div className="h-3 w-2/3 rounded bg-neutral-200" />
                      </div>
                      <div className="h-20 rounded bg-neutral-200" />
                      <div className="h-20 rounded bg-neutral-200" />
                      <div className="h-20 rounded bg-neutral-200" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Archive Preview */}
            <div>
              <div className="mb-2 font-semibold text-neutral-800">
                Archive Preview
              </div>

              <div className="rounded-2xl border bg-white p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  {(selected.postsListing ? [1, 2] : []).map((i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded-2xl border bg-white"
                    >
                      <div className="h-32 bg-neutral-200" />
                      <div className="p-4">
                        <div className="font-semibold text-neutral-900">
                          Example Blog Post Title
                        </div>
                        <div className="mt-2 text-sm text-neutral-500">
                          April 5, 2024 • 7 minute read
                        </div>
                        <p className="mt-2 text-sm text-neutral-600">
                          Get insights about the latest trends in web development
                          and how to stay ahead.
                        </p>
                        <div className="mt-3 text-sm text-neutral-700">
                          John Doe
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selected.pagination && (
                  <div className="mt-5 flex items-center justify-between text-sm text-neutral-600">
                    <button className="rounded-xl border px-3 py-2 hover:bg-neutral-50">
                      Prev
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-xl border bg-white">
                        1
                      </span>
                    </div>
                    <button className="rounded-xl border px-3 py-2 hover:bg-neutral-50">
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelected(DEFAULT_SELECTED)}
                className="rounded-xl border bg-white px-5 py-3 text-sm font-medium hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Save Bindings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
