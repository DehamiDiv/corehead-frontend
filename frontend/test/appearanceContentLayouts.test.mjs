import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Appearance exposes homepage, single-post, and archive layout selection", async () => {
  const [appearance, gallery, sidebar] = await Promise.all([
    readFile(new URL("../app/admin/settings/appearance/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL(
        "../components/admin/appearance/AppearanceContentLayoutGallery.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../components/admin/Sidebar.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(appearance, /<AppearanceHomeLayoutGallery/);
  assert.match(appearance, /<AppearanceContentLayoutGallery siteId=\{currentSiteId\}/);
  assert.match(appearance, /"Post Layouts"/);
  assert.match(gallery, /"single-post"/);
  assert.match(gallery, /"blog-archive"/);
  assert.match(gallery, /role="tablist"/);
  assert.match(gallery, /setActiveKind\(kind\)/);
  assert.match(gallery, /Active: \$\{activeLayout\.name\}/);
  assert.match(sidebar, /Template Assign/);
  assert.match(sidebar, /\/admin\/template-assignment/);
});

test("Appearance lists only published templates and assigns selected defaults", async () => {
  const [gallery, assignments, shared] = await Promise.all([
    readFile(
      new URL(
        "../components/admin/appearance/AppearanceContentLayoutGallery.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../app/admin/template-assignment/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/contentLayoutAssignments.ts", import.meta.url), "utf8"),
  ]);

  assert.match(gallery, /publishedContentLayouts\(raw\)/);
  assert.match(gallery, /groupContentLayouts\(layouts\)/);
  assert.match(gallery, /layoutKindFromTemplate/);
  assert.match(gallery, /api\.assignTemplate\(String\(layout\.id\), \{ isGlobalDefault: true \}\)/);
  assert.match(gallery, /metadata\?\.origin/);
  assert.match(gallery, /AI generated/);
  assert.match(assignments, /globalLayoutFor/);
  assert.match(assignments, /categoryLayoutOverrides/);
  assert.match(shared, /layout\.category === "global_default"/);
  assert.match(gallery, /Advanced global and category-specific assignments remain available/);
  assert.match(gallery, /href="\/admin\/template-assignment"/);
});

test("Appearance previews published layouts from their canonical blocks", async () => {
  const [gallery, preview] = await Promise.all([
    readFile(
      new URL("../components/admin/appearance/AppearanceContentLayoutGallery.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../components/admin/appearance/ContentLayoutMiniPreview.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(gallery, /<ContentLayoutMiniPreview/);
  assert.match(gallery, /blocks=\{layout\.layoutJson\?\.blocks\}/);
  assert.match(preview, /aria-label="Layout structure preview"/);
  assert.match(preview, /binding === "post\.title"/);
  assert.match(preview, /binding\.includes\("content"\)/);
  assert.doesNotMatch(preview, /dangerouslySetInnerHTML/);
});
