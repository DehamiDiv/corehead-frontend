import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import normalizer from "../../../contracts/layout-normalizer-v1.js";
import validator from "../../../contracts/layout-validator-v1.js";

const { normalizeLayoutDocumentV1 } = normalizer;
const { validateLayoutDocumentV1 } = validator;

function prepareLikeFrontend(input, { name, type, status }) {
  const normalizedType = String(type).toLowerCase();
  const kind = normalizedType.includes("home")
    ? "home-page"
    : normalizedType.includes("archive")
      ? "blog-archive"
      : "single-post";
  const normalized = normalizeLayoutDocumentV1(input, { name, kind, origin: "manual" });
  const document = { ...normalized.document, name, kind };
  const validation = validateLayoutDocumentV1(document, { semantic: status === "published" });
  return { document, validation };
}

test("manual and visual block input produce a canonical persisted document", async () => {
  const fixtureUrl = new URL("../../../contracts/fixtures/valid-single-post.json", import.meta.url);
  const fixture = JSON.parse(await readFile(fixtureUrl, "utf8"));
  const prepared = prepareLikeFrontend(fixture.blocks, {
    name: "Builder Post",
    type: "Single Post",
    status: "published",
  });

  assert.equal(prepared.document.schemaVersion, "1.0");
  assert.equal(prepared.document.name, "Builder Post");
  assert.equal(prepared.validation.valid, true);
});

test("manual Home Page input saves with the canonical kind", () => {
  const prepared = prepareLikeFrontend([
    { id: "site-name", type: "Heading", content: "", bindings: { content: "site.name" } },
    { id: "posts", type: "Collection List", content: { limit: 6, category: "" } },
  ], { name: "Custom Home", type: "Home Page", status: "published" });

  assert.equal(prepared.document.kind, "home-page");
  assert.equal(prepared.validation.valid, true);
});

test("draft validation is structural while publication is semantic", () => {
  const blocks = [{ id: "heading", type: "Heading", content: "Work in progress" }];
  const draft = prepareLikeFrontend(blocks, { name: "Draft", type: "Single Post", status: "draft" });
  const published = prepareLikeFrontend(blocks, { name: "Published", type: "Single Post", status: "published" });

  assert.equal(draft.validation.valid, true);
  assert.equal(published.validation.valid, false);
});
