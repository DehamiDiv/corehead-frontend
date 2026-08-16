import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const registry = readFileSync(
  new URL("../components/public/homeLayoutRegistry.ts", import.meta.url),
  "utf8",
);
const publicHome = readFileSync(
  new URL("../app/s/[siteSlug]/page.tsx", import.meta.url),
  "utf8",
);
const themePresets = readFileSync(
  new URL("../lib/themePresets.ts", import.meta.url),
  "utf8",
);

test("legacy appearance registrations route by canonical layout ID", () => {
  assert.match(
    registry,
    /const rendererKey = registration\.renderer \|\| registration\.id/,
  );
  assert.match(registry, /DEDICATED_HOME_RENDERERS\[rendererKey\]/);
});

test("professional homepage presets retain distinct public renderer paths", () => {
  for (const renderer of ["bento", "bloom", "glass", "paper", "portals", "studio"]) {
    assert.match(registry, new RegExp(`\\b${renderer}: [A-Z][A-Za-z]+HomeLayout`));
  }

  assert.match(publicHome, /homeStyle === "nature"/);
  assert.match(publicHome, /<VerduraEditorialHero/);
  assert.match(publicHome, /getDedicatedHomeRenderer\(homeStyle\)/);
  assert.match(publicHome, /data-home-layout=\{homeStyle\}/);
});

test("Appearance uses specific professional homepage layout names", () => {
  for (const name of [
    "Executive Editorial",
    "Immersive Storyscape",
    "Wellness & Services",
    "Digital Innovation",
    "Modern Bento Showcase",
    "Creative Portfolio Studio",
    "Professional Newsroom",
    "Executive Newsletter",
  ]) {
    assert.ok(themePresets.includes(name), `Missing homepage name: ${name}`);
  }

  assert.match(
    themePresets,
    /name:\s*HOME_LAYOUT_DISPLAY_NAMES\[layout\.id as HomeStyle\]\s*\|\|\s*layout\.name/,
  );
});
