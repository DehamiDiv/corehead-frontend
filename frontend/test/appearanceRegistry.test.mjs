import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import registry from "../../../contracts/appearance-registry-v1.js";

const {
  HOME_LAYOUT_REGISTRY,
  THEME_PREVIEW_ASSETS,
  THEME_REGISTRY,
  getHomeLayoutRegistration,
  validateAppearanceRegistry,
} = registry;

test("shared appearance registry is complete and uses meaningful names", () => {
  const result = validateAppearanceRegistry();
  assert.deepEqual(result, { valid: true, errors: [] });
  assert.equal(Object.keys(HOME_LAYOUT_REGISTRY).length, 8);
  assert.equal(Object.keys(THEME_REGISTRY).length, 12);

  for (const theme of Object.values(THEME_REGISTRY)) {
    assert.doesNotMatch(theme.name, /^Theme\s+\d+$/i);
    assert.ok(THEME_PREVIEW_ASSETS[theme.id]);
    assert.ok(theme.tokens.radius);
    assert.ok(theme.tokens.containerWidth);
    assert.ok(theme.tokens.sectionSpacing);
  }
  for (const layout of Object.values(HOME_LAYOUT_REGISTRY)) {
    assert.doesNotMatch(layout.name, /^Layout\s+\d+$/i);
    assert.equal(layout.defaultContentKey, layout.id);
    assert.ok(layout.previewAsset);
  }
});

test("public branding exposes standardized structural theme tokens", async () => {
  const brandingSource = await readFile(
    new URL("../lib/siteBranding.ts", import.meta.url),
    "utf8",
  );
  for (const cssVariable of [
    "--site-radius",
    "--site-shadow",
    "--site-container",
    "--site-section-space",
    "--site-button-radius",
  ]) {
    assert.match(brandingSource, new RegExp(cssVariable));
  }
});

test("all registered homepage layouts have a public renderer path", async () => {
  const rendererSource = await readFile(
    new URL("../components/public/homeLayoutRegistry.ts", import.meta.url),
    "utf8",
  );
  const pageSource = await readFile(
    new URL("../app/s/[siteSlug]/page.tsx", import.meta.url),
    "utf8",
  );

  for (const registration of Object.values(HOME_LAYOUT_REGISTRY)) {
    const hasDedicatedRenderer = rendererSource.includes(
      `${registration.renderer}:`,
    );
    const hasSharedRenderer = ["classic", "nature"].includes(
      registration.renderer,
    ) && pageSource.includes("DedicatedHomeLayout");
    assert.equal(
      hasDedicatedRenderer || hasSharedRenderer,
      true,
      `Missing renderer for ${registration.id}`,
    );
  }
});

test("legacy homepage IDs resolve through the canonical registry", () => {
  assert.equal(getHomeLayoutRegistration("magazine").id, "paper");
  assert.equal(getHomeLayoutRegistration("dark").id, "studio");
  assert.equal(getHomeLayoutRegistration("unknown").id, "classic");
});

test("homepage layouts expose professional use cases and distinct selector previews", async () => {
  const gallerySource = await readFile(
    new URL("../components/admin/appearance/AppearanceHomeLayoutGallery.tsx", import.meta.url),
    "utf8",
  );
  const starterCopySource = await readFile(
    new URL("../lib/homeDemoContent.ts", import.meta.url),
    "utf8",
  );

  for (const [id, layout] of Object.entries(HOME_LAYOUT_REGISTRY)) {
    assert.ok(layout.description.length >= 70, `${id} needs a useful description`);
    assert.ok(layout.suitableFor.length >= 2, `${id} needs professional use cases`);
  }
  for (const id of ["nature", "bloom", "portals", "bento", "studio", "paper", "glass"]) {
    assert.match(gallerySource, new RegExp(`id === ["']${id}["']`));
  }
  assert.doesNotMatch(starterCopySource, /Nature Is Essential For The Survival/i);
  assert.doesNotMatch(starterCopySource, /Seamless swaps|Historical data|AI-ready stack/i);
});
