import assert from "node:assert/strict";
import test from "node:test";

import classification from "../../../contracts/template-classification-v1.js";

const {
  isPublishedTemplate,
  layoutKindFromTemplate,
  templateOrigin,
} = classification;

test("classifies templates by canonical document kind before legacy type aliases", () => {
  assert.equal(layoutKindFromTemplate({ type: "Archive", layoutJson: { kind: "single-post" } }), "single-post");
  assert.equal(layoutKindFromTemplate({ type: "blog-loop" }), "blog-archive");
  assert.equal(layoutKindFromTemplate({ type: "Single Post" }), "single-post");
});

test("classifies publication status and provenance", () => {
  assert.equal(isPublishedTemplate({ status: "Published" }), true);
  assert.equal(isPublishedTemplate({ status: "draft" }), false);
  assert.equal(templateOrigin({ layoutJson: { metadata: { origin: "ai" } } }), "ai");
  assert.equal(templateOrigin({ layoutJson: { sections: [] } }), "migrated");
});
