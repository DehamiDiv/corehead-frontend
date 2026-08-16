import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import validator from "../../../contracts/layout-validator-v1.js";

const { validateLayoutDocumentV1 } = validator;

async function fixture(name) {
  const url = new URL(`../../../contracts/fixtures/${name}`, import.meta.url);
  return JSON.parse(await readFile(url, "utf8"));
}

test("frontend consumes the same validator as the backend", async () => {
  const single = await fixture("valid-single-post.json");
  const archive = await fixture("valid-blog-archive.json");
  const home = await fixture("valid-home-page.json");

  assert.equal(validateLayoutDocumentV1(single).valid, true);
  assert.equal(validateLayoutDocumentV1(archive).valid, true);
  assert.equal(validateLayoutDocumentV1(home).valid, true);
});

test("frontend receives actionable validation paths", async () => {
  const invalid = await fixture("invalid-single-post.json");
  const result = validateLayoutDocumentV1(invalid);

  assert.equal(result.valid, false);
  assert.ok(result.errors.every((error) => error.code && error.path && error.message));
  assert.ok(result.errors.some((error) => error.path.includes("blocks")));
});

test("Home Page publication requires site identity and a post collection while drafts remain valid", async () => {
  const home = await fixture("valid-home-page.json");
  home.blocks = home.blocks.filter(
    (block) => block.bindings?.content !== "site.name" && block.type !== "Collection List",
  );

  const published = validateLayoutDocumentV1(home);
  const codes = published.errors.map((error) => error.code);
  assert.ok(codes.includes("semantic.home_page_site_name"));
  assert.ok(codes.includes("semantic.home_page_collection"));
  assert.equal(validateLayoutDocumentV1(home, { semantic: false }).valid, true);
});
