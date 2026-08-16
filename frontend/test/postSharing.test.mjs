import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("published tenant post renders sharing controls with its tenant path", async () => {
  const postPage = await readFile(
    new URL("../app/s/[siteSlug]/blog/[postSlug]/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(postPage, /<PostShareButtons/);
  assert.match(postPage, /sharePath=\{sitePostPath\(site\.slug, post\.slug\)\}/);
  assert.match(postPage, /if \(!post \|\| !isPublishedPost\(post\)\)/);
});

test("share component supports native, copied, and social share destinations", async () => {
  const component = await readFile(
    new URL("../components/blog/PostShareButtons.tsx", import.meta.url),
    "utf8",
  );

  assert.match(component, /navigator\.share/);
  assert.match(component, /navigator\.clipboard\.writeText\(shareUrl\)/);
  assert.match(component, /facebook\.com\/sharer/);
  assert.match(component, /wa\.me/);
  assert.match(component, /linkedin\.com\/sharing/);
  assert.match(component, /twitter\.com\/intent\/tweet/);
  assert.match(component, /new URL\(sharePath, window\.location\.origin\)/);
});
