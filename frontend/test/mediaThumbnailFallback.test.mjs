import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const thumbnail = readFileSync(
  new URL("../components/admin/MediaThumbnail.tsx", import.meta.url),
  "utf8",
);
const mediaPage = readFileSync(
  new URL("../app/admin/media/page.tsx", import.meta.url),
  "utf8",
);
const mediaModal = readFileSync(
  new URL("../components/admin/MediaLibraryModal.tsx", import.meta.url),
  "utf8",
);

test("broken media thumbnails render an accessible unavailable state", () => {
  assert.match(thumbnail, /onError=\{\(\) => setFailed\(true\)\}/);
  assert.match(thumbnail, /Image unavailable/);
  assert.match(thumbnail, /aria-label=\{`\$\{alt\} is unavailable`\}/);
});

test("media page and picker share the broken-thumbnail fallback", () => {
  assert.match(mediaPage, /<MediaThumbnail/);
  assert.match(mediaModal, /<MediaThumbnail/);
});
