import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("admin header replaces redundant global search with location and quick actions", async () => {
  const header = await readFile(
    new URL("../components/admin/Header.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(header, /Search blogs and posts/);
  assert.match(header, /aria-label="Current admin location"/);
  assert.match(header, /Settings.*Appearance/s);
  assert.match(header, />Quick Create</);
  assert.match(header, /aria-label="Quick create"/);
  assert.match(header, /href: "\/admin\/posts\/create"/);
  assert.match(header, /href: "\/admin\/pages"/);
  assert.match(header, /href: "\/admin\/layouts\/new"/);
  assert.match(header, /href: "\/ai-prompt"/);
  assert.match(header, /href: "\/admin\/media"/);
  assert.match(header, /event\.key === "Escape"/);
  assert.match(header, /quickCreateRef\.current\?\.contains/);
});
