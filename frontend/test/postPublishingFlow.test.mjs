import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";


test("post list waits for and refetches with the active site", async () => {
  const page = await readFile(
    new URL("../app/admin/posts/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(page, /if \(siteLoading\) return/);
  assert.match(page, /api\.getPosts\(currentSiteId\)/);
  assert.match(page, /\[currentSiteId, siteLoading\]/);
  assert.match(page, /Failed to fetch posts for the selected site/);
});


test("post creation is explicitly scoped to the selected site", async () => {
  const page = await readFile(
    new URL("../app/admin/posts/create/page.tsx", import.meta.url),
    "utf8",
  );
  const api = await readFile(new URL("../lib/api.ts", import.meta.url), "utf8");

  assert.match(page, /Create or select a site before creating a post/);
  assert.match(page, /api\.createPost\(finalData, currentSiteId\)/);
  assert.match(page, /metaTitle: formData\.metaTitle/);
  assert.match(page, /metaDescription: formData\.metaDescription/);
  assert.match(api, /async createPost\(data: any, siteId\?: number \| null\)/);
  assert.match(api, /'X-Site-Id': String\(siteId\)/);
});


test("public tenant pages request published posts using the resolved site", async () => {
  const home = await readFile(
    new URL("../app/s/[siteSlug]/page.tsx", import.meta.url),
    "utf8",
  );
  const blog = await readFile(
    new URL("../app/s/[siteSlug]/blog/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(home, /api\.getPreviewPosts\(12, site\.id\)/);
  assert.match(home, /filter\(isPublishedPost\)/);
  assert.match(blog, /api\.getPreviewPosts\(100, site\.id\)/);
  assert.match(blog, /filter\(isPublishedPost\)/);
});
