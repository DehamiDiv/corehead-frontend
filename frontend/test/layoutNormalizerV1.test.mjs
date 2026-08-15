import assert from "node:assert/strict";
import test from "node:test";

import normalizer from "../../../contracts/layout-normalizer-v1.js";
import validator from "../../../contracts/layout-validator-v1.js";

const { normalizeLayoutDocumentV1 } = normalizer;
const { validateLayoutDocumentV1 } = validator;

test("frontend normalizes legacy placeholders through the shared adapter", () => {
  const result = normalizeLayoutDocumentV1({
    type: "Single Post",
    name: "Legacy",
    sections: [
      { id: "header", type: "hero-section", props: { title: "{post.title}", image: "{post.coverImage}" } },
      { id: "body", type: "rich-text", props: { content: "{post.contentHtml}" } },
    ],
  });

  assert.equal(result.document.schemaVersion, "1.0");
  assert.equal(validateLayoutDocumentV1(result.document).valid, true);
});

test("normalization of raw blocks is idempotent after canonicalization", () => {
  const first = normalizeLayoutDocumentV1([
    { id: "heading", type: "Heading", content: "Posts" },
    { id: "posts", type: "Collection List", content: { limit: 6, category: "" } },
  ], { name: "Archive" });
  const second = normalizeLayoutDocumentV1(first.document);

  assert.deepEqual(second.document, first.document);
  assert.equal(second.sourceFormat, "layout-document-v1");
});
