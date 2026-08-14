import assert from "node:assert/strict";
import test from "node:test";

import data from "../../../contracts/home-layout-data-v1.js";

const { normalizeHomeLayoutData } = data;

test("homepage data normalization handles empty and missing optional content", () => {
  const normalized = normalizeHomeLayoutData({
    siteName: "",
    siteSlug: " demo ",
    posts: null,
    heroImage: "",
  });
  assert.equal(normalized.siteName, "Site");
  assert.equal(normalized.siteSlug, "demo");
  assert.equal(normalized.heroImage, null);
  assert.deepEqual(normalized.posts, []);
});

test("homepage data normalization preserves long content and valid post gaps", () => {
  const title = "A".repeat(500);
  const normalized = normalizeHomeLayoutData({
    siteName: title,
    posts: [
      { id: 1, title, slug: "long", coverImage: null, excerpt: null },
      null,
      { id: 2, title: "No slug" },
    ],
  });
  assert.equal(normalized.siteName, title);
  assert.equal(normalized.posts.length, 2);
  assert.equal(normalized.posts[0].coverImage, null);
  assert.equal(normalized.posts[0].excerpt, null);
});
