import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageUrl = new URL("../app/admin/settings/website/page.tsx", import.meta.url);

test("Website Settings loads and updates the canonical selected site name", async () => {
  const page = await readFile(pageUrl, "utf8");

  assert.match(page, /useSite\(\)/);
  assert.match(page, /setSiteName\(currentSite\?\.name \|\| ""\)/);
  assert.match(page, /api\.updateSite\(currentSiteId, \{ name \}\)/);
  assert.match(page, /await refreshSites\(\)/);
  assert.match(page, /Site name is required/);
  assert.match(page, /Site name must be 255 characters or less/);
});

test("site identity keeps the public slug unchanged and separate from SEO metadata", async () => {
  const page = await readFile(pageUrl, "utf8");

  assert.match(page, /siteHomePath\(currentSite\.slug\)/);
  assert.match(page, /The URL slug remains unchanged when the site name is updated/);
  assert.match(page, /api\.updateSetting\("website_metadata", formData\)/);
});

test("website metadata defaults are derived from the selected site without demo tenant data", async () => {
  const page = await readFile(pageUrl, "utf8");

  assert.match(page, /metadataDefaults\(currentSite\?\.name\)/);
  assert.match(page, /SEO Site Name/);
  assert.match(page, /Add a social sharing image/);
  assert.doesNotMatch(page, /SeekaHost\.com|SeekaHost Technologies|images\.unsplash\.com/);
});
