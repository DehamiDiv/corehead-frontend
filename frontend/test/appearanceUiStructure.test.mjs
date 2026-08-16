import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Appearance uses separate theme and homepage gallery components", async () => {
  const page = await readFile(
    new URL("../app/admin/settings/appearance/page.tsx", import.meta.url),
    "utf8",
  );
  assert.match(page, /<AppearanceThemeGallery/);
  assert.match(page, /<AppearanceHomeLayoutGallery/);
  assert.match(page, /Theme styling and homepage structure are saved independently/);
});

test("visible theme previews are generated from real theme tokens", async () => {
  const gallery = await readFile(
    new URL(
      "../components/admin/appearance/AppearanceThemeGallery.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(gallery, /preset\.colours\.primary/);
  assert.match(gallery, /preset\.header\.headerBg/);
  assert.doesNotMatch(gallery, /<img/);
  assert.match(gallery, /homepage layout and its content remain unchanged/);
});

test("Use theme follows the primary Create Page button colour system", async () => {
  const [gallery, pages] = await Promise.all([
    readFile(
      new URL(
        "../components/admin/appearance/AppearanceThemeGallery.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../app/admin/pages/page.tsx", import.meta.url), "utf8"),
  ]);

  for (const source of [gallery, pages]) {
    assert.match(source, /bg-blue-600/);
    assert.match(source, /hover:bg-blue-700/);
    assert.match(source, /shadow-blue-200/);
  }
});

test("Home Page layout actions follow the primary Create Page button colour system", async () => {
  const [gallery, pages] = await Promise.all([
    readFile(
      new URL(
        "../components/admin/appearance/AppearanceHomeLayoutGallery.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../app/admin/pages/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(gallery, /Use layout/);
  assert.match(gallery, /Use custom layout/);
  for (const source of [gallery, pages]) {
    assert.match(source, /bg-blue-600/);
    assert.match(source, /hover:bg-blue-700/);
    assert.match(source, /shadow-blue-200/);
  }
});

test("homepage gallery exposes site-safe selection and content editing actions", async () => {
  const gallery = await readFile(
    new URL(
      "../components/admin/appearance/AppearanceHomeLayoutGallery.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(gallery, /onSelect\(layout\)/);
  assert.match(gallery, /onEdit\(layout\.id\)/);
  assert.match(gallery, /Best for:/);
});

test("homepage gallery includes published custom Home Page templates and preserves preset fallback", async () => {
  const gallery = await readFile(new URL("../components/admin/appearance/AppearanceHomeLayoutGallery.tsx", import.meta.url), "utf8");
  const appearance = await readFile(new URL("../app/admin/settings/appearance/page.tsx", import.meta.url), "utf8");

  assert.match(gallery, /Published custom layouts/);
  assert.match(gallery, /layoutKindFromTemplate\(template\) === "home-page"/);
  assert.match(gallery, /isPublishedTemplate\(template\)/);
  assert.match(gallery, /isGlobalDefault: true/);
  assert.match(gallery, /isGlobalDefault: false/);
  assert.match(appearance, /siteId=\{currentSite\?\.id\}/);
});
