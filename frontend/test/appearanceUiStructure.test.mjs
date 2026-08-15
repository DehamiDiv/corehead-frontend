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
