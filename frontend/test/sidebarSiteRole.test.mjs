import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const api = readFileSync(new URL("../lib/api.ts", import.meta.url), "utf8");
const storage = readFileSync(new URL("../lib/siteStorage.ts", import.meta.url), "utf8");
const context = readFileSync(
  new URL("../components/admin/SiteContext.tsx", import.meta.url),
  "utf8",
);
const sidebar = readFileSync(
  new URL("../components/admin/Sidebar.tsx", import.meta.url),
  "utf8",
);

test("site membership role is preserved from the API to selected-site storage", () => {
  assert.match(api, /siteRole\?:/);
  assert.match(storage, /siteRole\?:/);
  assert.match(storage, /siteRole:\s*site\.siteRole\s*\?\?\s*null/);
  assert.match(context, /siteRole:\s*site\.siteRole\s*\?\?\s*null/);
});

test("sidebar displays selected-site role while preserving platform admin role", () => {
  assert.match(sidebar, /isPlatformAdmin\(user\?\.role\)/);
  assert.match(sidebar, /currentSite\?\.siteRole\s*\|\|\s*user\?\.role/);
  assert.match(sidebar, /\{displayRole\}/);
});
