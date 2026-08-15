import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("the application mounts one accessible global toast provider", async () => {
  const [layout, provider] = await Promise.all([
    source("../app/layout.tsx"),
    source("../components/ui/ToastProvider.tsx"),
  ]);

  assert.match(layout, /<ToastProvider \/>/);
  assert.match(provider, /aria-live="polite"/);
  assert.match(provider, /role=\{message\.tone === "error" \? "alert" : "status"\}/);
  assert.match(provider, /Dismiss notification/);
});

test("Appearance actions use non-blocking typed toast notifications", async () => {
  const appearance = await source("../app/admin/settings/appearance/page.tsx");

  assert.doesNotMatch(appearance, /\balert\s*\(/);
  assert.match(appearance, /toast\.success\(/);
  assert.match(appearance, /toast\.error\(/);
  assert.match(appearance, /toast\.warning\(/);
});
