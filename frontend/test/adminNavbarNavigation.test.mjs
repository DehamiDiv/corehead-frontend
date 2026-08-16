import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("welcome navbar Dashboard opens the sidebar admin content panel", async () => {
  const navbar = await readFile(
    new URL("../components/admin/Navbar.tsx", import.meta.url),
    "utf8",
  );

  assert.match(navbar, /const adminPanelPath = "\/admin\/posts"/);
  assert.match(navbar, /href=\{adminPanelPath\}/);
  assert.match(navbar, /Open the admin content panel/);
});

test("All Blogs opens the selected site's published public archive", async () => {
  const navbar = await readFile(
    new URL("../components/admin/Navbar.tsx", import.meta.url),
    "utf8",
  );

  assert.match(navbar, /const slug = siteCtx\?\.currentSite\?\.slug/);
  assert.match(navbar, /const publicBlogsPath = slug \? siteBlogPath\(slug\) : "\/admin\/sites"/);
  assert.match(navbar, /href=\{publicBlogsPath\}/);
  assert.match(navbar, /View published posts for/);
  assert.doesNotMatch(navbar, /<span>All Blogs<\/span>[\s\S]{0,200}href="\/admin\/posts"/);
});
