import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const createPostPath = new URL("../app/admin/posts/create/page.tsx", import.meta.url);

test("post creation keeps the manual editor and removes AI writing controls", async () => {
  const source = await readFile(createPostPath, "utf8");

  assert.match(source, /<ReactQuill/);
  assert.match(source, /api\.createPost\(/);
  assert.match(source, /words \|/);
  assert.doesNotMatch(source, /AIBlogWriterModal/);
  assert.doesNotMatch(source, /AI Assist/);
  assert.doesNotMatch(source, /AI Assistant/);
  assert.doesNotMatch(source, /handleInlineRefine/);
  assert.doesNotMatch(source, /\/ai\/refine/);
  assert.doesNotMatch(source, /Polish Grammar|Make Longer|Summarize Content/);
});
