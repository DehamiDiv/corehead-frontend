import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import renderable from "../../../contracts/renderable-layout-v1.js";

const { prepareRenderableLayout } = renderable;

async function fixture(name) {
  return JSON.parse(await readFile(new URL(`../../../contracts/fixtures/${name}`, import.meta.url), "utf8"));
}

test("preview and public preparation accept the same canonical layout", async () => {
  const single = await fixture("valid-single-post.json");
  const preview = prepareRenderableLayout(single, { semantic: false });
  const publicResult = prepareRenderableLayout(single, { semantic: true });

  assert.equal(preview.valid, true);
  assert.equal(publicResult.valid, true);
  assert.deepEqual(preview.document, publicResult.document);
});

test("public preparation rejects semantic gaps while draft preview remains renderable", () => {
  const draft = [{ id: "heading", type: "Heading", content: "Draft title" }];
  const preview = prepareRenderableLayout(draft, { name: "Draft", kind: "single-post", semantic: false });
  const publicResult = prepareRenderableLayout(draft, { name: "Draft", kind: "single-post", semantic: true });

  assert.equal(preview.valid, true);
  assert.equal(publicResult.valid, false);
  assert.ok(publicResult.issues.some((issue) => issue.code === "semantic.single_post_content"));
});
