"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { PartKey, Group } from "./types";
import { saveBindings, getBindings } from "./actions";

// Empty groups as requested
const GROUPS: Group[] = [];

const DEFAULT_SELECTED: Record<PartKey, boolean> = {};

export default function BindingsPage() {
  const [mode, setMode] = useState<"dynamic" | "static">("dynamic");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<PartKey, boolean>>(
    DEFAULT_SELECTED
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBindings().then((data) => {
      if (data) {
        setMode(data.mode);
        // Ensure we handle potential existing data gracefully, 
        // essentially resetting or keeping it is fine, but UI shows nothing.
        setSelected(data.selected || {}); 
      }
      setLoading(false);
    });
  }, []);

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
    // Since we have no known keys in code, we can't really set all.
    // If we had a list of all potential keys, we'd use that.
    // For now, doing nothing or clearing is appropriate.
    if (!val) {
        setSelected({});
    }
  }

  async function onSave() {
    const result = await saveBindings(mode, selected);
    if (result.success) {
      alert("Bindings saved successfully!");
    } else {
      alert("Failed to save bindings.");
    }
  }

  if (loading) {
    return <div className="p-10 text-center text-white">Loading...</div>;
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
              {/* Select All is disabled as we have no items */}
              <button
                 disabled
                className="flex-1 rounded-xl border bg-neutral-100 px-3 py-2 text-sm text-neutral-400"
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
              {/* No groups to render */}
              {filteredGroups.length === 0 && (
                <div className="p-4 text-center text-sm text-neutral-500">
                    No parts available for binding.
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-6">

            {/* Post Preview - CLEARED */}
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border bg-neutral-50 text-neutral-500">
               <div className="text-xl font-medium">No Preview Available</div>
               <p className="text-sm">Select parts to see a preview.</p>
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
