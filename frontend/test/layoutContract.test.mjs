import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const contractUrl = new URL("../../../contracts/layout-document-v1.schema.json", import.meta.url);
const validSingleUrl = new URL("../../../contracts/fixtures/valid-single-post.json", import.meta.url);
const validArchiveUrl = new URL("../../../contracts/fixtures/valid-blog-archive.json", import.meta.url);
const validHomeUrl = new URL("../../../contracts/fixtures/valid-home-page.json", import.meta.url);
const invalidSingleUrl = new URL("../../../contracts/fixtures/invalid-single-post.json", import.meta.url);

async function readJson(url) {
  return JSON.parse(await readFile(url, "utf8"));
}

test("LayoutDocument v1 schema exposes the canonical kinds and block variants", async () => {
  const schema = await readJson(contractUrl);
  const blockTypes = schema.$defs.block.oneOf.map((entry) => {
    const name = entry.$ref.split("/").at(-1);
    return schema.$defs[name].properties.type.const;
  });

  assert.deepEqual(schema.properties.kind.enum, ["single-post", "blog-archive", "home-page"]);
  assert.equal(blockTypes.length, 17);
  assert.ok(blockTypes.includes("Collection List"));
  assert.ok(blockTypes.includes("Html"));
});

test("canonical fixtures declare their kind and required dynamic structures", async () => {
  const single = await readJson(validSingleUrl);
  const archive = await readJson(validArchiveUrl);
  const home = await readJson(validHomeUrl);

  assert.equal(single.schemaVersion, "1.0");
  assert.ok(single.blocks.some((block) => block.bindings?.content === "post.title"));
  assert.ok(single.blocks.some((block) => block.bindings?.content === "post.contentHtml"));
  assert.equal(archive.kind, "blog-archive");
  assert.ok(archive.blocks.some((block) => block.type === "Collection List"));
  assert.equal(home.kind, "home-page");
  assert.ok(home.blocks.some((block) => block.bindings?.content === "site.tagline"));
});

test("invalid fixture demonstrates both structural and semantic violations", async () => {
  const schema = await readJson(contractUrl);
  const invalid = await readJson(invalidSingleUrl);
  const knownTypes = new Set(
    schema.$defs.block.oneOf.map((entry) => {
      const name = entry.$ref.split("/").at(-1);
      return schema.$defs[name].properties.type.const;
    }),
  );

  assert.ok(invalid.blocks.some((block) => !knownTypes.has(block.type)));
  assert.ok(!invalid.blocks.some((block) => block.bindings?.content === "post.contentHtml"));
});
