import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const appearancePage = readFileSync(
  new URL("../app/admin/settings/appearance/page.tsx", import.meta.url),
  "utf8",
);
const branding = readFileSync(
  new URL("../lib/siteBranding.ts", import.meta.url),
  "utf8",
);
const publicHeader = readFileSync(
  new URL("../components/public/PublicSiteHeader.tsx", import.meta.url),
  "utf8",
);
const publicFooter = readFileSync(
  new URL("../components/public/PublicSiteFooter.tsx", import.meta.url),
  "utf8",
);

test("Appearance saves responsive header and footer sizing with site chrome settings", () => {
  for (const field of [
    "headerHeight",
    "headerMobileHeight",
    "footerPadding",
    "footerMobilePadding",
  ]) {
    assert.match(appearancePage, new RegExp(`\\b${field}\\b`));
  }

  assert.match(appearancePage, /headerHeight,\s*headerMobileHeight,/);
  assert.match(appearancePage, /footerPadding,\s*footerMobilePadding,/);
});

test("public chrome consumes bounded responsive size variables", () => {
  assert.match(branding, /boundedPixels\(full\.header\?\.headerHeight, 72, 56, 120\)/);
  assert.match(branding, /boundedPixels\(full\.header\?\.headerMobileHeight, 64, 52, 88\)/);
  assert.match(branding, /boundedPixels\(full\.footer\?\.footerPadding, 56, 24, 96\)/);
  assert.match(branding, /boundedPixels\(full\.footer\?\.footerMobilePadding, 40, 20, 72\)/);
  assert.match(publicHeader, /--site-header-mobile-height/);
  assert.match(publicHeader, /--site-header-height/);
  assert.match(publicFooter, /--site-footer-mobile-padding/);
  assert.match(publicFooter, /--site-footer-padding/);
});
