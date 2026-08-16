import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("published pages can be assigned to header, footer, both, or neither", async () => {
  const pages = await source("../app/admin/pages/page.tsx");

  assert.match(pages, /type PageMenuLocation = "header" \| "footer" \| "both" \| "none"/);
  assert.match(pages, /<option value="header">Header<\/option>/);
  assert.match(pages, /<option value="footer">Footer<\/option>/);
  assert.match(pages, /<option value="both">Header and Footer<\/option>/);
  assert.match(pages, /<option value="none">Do not add to navigation<\/option>/);
});

test("page publication synchronizes canonical and active-theme navigation settings", async () => {
  const pages = await source("../app/admin/pages/page.tsx");

  assert.match(pages, /api\.updateSetting\("site_header", \{ \.\.\.siteHeader, navLinks \}\)/);
  assert.match(pages, /api\.updateSetting\(`theme_\$\{themeId\}_header`/);
  assert.match(pages, /api\.updateSetting\("site_footer", \{ \.\.\.siteFooter, quickLinks \}\)/);
  assert.match(pages, /api\.updateSetting\(`theme_\$\{themeId\}_footer`/);
});

test("configured public footer navigation never exposes dashboard or logout", async () => {
  const footer = await source("../components/public/PublicSiteFooter.tsx");

  assert.match(footer, /name !== "dashboard"/);
  assert.match(footer, /name !== "logout"/);
  assert.match(footer, /!link\.startsWith\("\/admin"\)/);
  assert.match(footer, /link !== "\/logout"/);
});
