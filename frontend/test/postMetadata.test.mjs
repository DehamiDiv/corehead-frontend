import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("published post metadata uses editor SEO fields with tenant-route fallbacks", async () => {
  const page = await readFile(
    new URL("../app/s/[siteSlug]/blog/[postSlug]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(page, /post\.metaTitle \|\| post\.meta_title \|\| post\.title/);
  assert.match(page, /post\.metaDescription \|\| post\.meta_description \|\| post\.excerpt/);
  assert.match(page, /safeCanonicalUrl/);
  assert.match(page, /sitePostPath\(site\.slug, post\.slug \|\| postSlug\)/);
  assert.match(page, /openGraph:\s*\{/);
  assert.match(page, /type: "article"/);
  assert.match(page, /twitter:\s*\{/);
  assert.match(page, /summary_large_image/);
});

test("non-public post metadata is marked noindex", async () => {
  const page = await readFile(
    new URL("../app/s/[siteSlug]/blog/[postSlug]/page.tsx", import.meta.url),
    "utf8",
  );
  assert.match(page, /!post \|\| !isPublishedPost\(post\)/);
  assert.match(page, /robots: \{ index: false, follow: false \}/);
});
