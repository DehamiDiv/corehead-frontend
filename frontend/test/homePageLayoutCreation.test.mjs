import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const createPageUrl = new URL("../app/admin/layouts/new/page.tsx", import.meta.url);
const editPageUrl = new URL("../app/admin/layouts/[id]/edit/page.tsx", import.meta.url);
const templateLayoutUrl = new URL("../lib/templateLayout.ts", import.meta.url);
const homeStartersUrl = new URL("../lib/homePageLayoutStarters.ts", import.meta.url);

test("Create New Layout and Edit Layout expose Home Page without removing existing types", async () => {
  const [createPage, editPage] = await Promise.all([
    readFile(createPageUrl, "utf8"),
    readFile(editPageUrl, "utf8"),
  ]);

  for (const source of [createPage, editPage]) {
    assert.match(source, /value="Single Post"/);
    assert.match(source, /value="Blog Archive"/);
    assert.match(source, /value="Home Page"/);
  }
});

test("Home Page creation offers professional starters and canonical site binding controls", async () => {
  const [page, starters] = await Promise.all([
    readFile(createPageUrl, "utf8"),
    readFile(homeStartersUrl, "utf8"),
  ]);

  assert.match(page, /Starter composition/);
  assert.match(page, /Add dynamic site field/);
  assert.match(page, /insertHomeBindingBlock/);
  assert.match(starters, /Editorial Hero/);
  assert.match(starters, /Magazine Spotlight/);
  assert.match(starters, /Newsletter First/);
  for (const binding of ["site.name", "site.tagline", "site.description", "site.logo", "site.heroImage"]) {
    assert.ok(starters.includes(binding));
  }
});

test("layout creation previews desktop, tablet, and mobile with the public renderer", async () => {
  const page = await readFile(createPageUrl, "utf8");

  assert.match(page, /PublicPageRenderer/);
  assert.match(page, /Uses the same renderer as the published site/);
  assert.match(page, /"desktop" \| "tablet" \| "mobile"/);
  assert.match(page, /aria-label="Responsive layout preview"/);
  assert.match(page, /openPreview/);
});

test("layout editing exposes real draft status and an explicit validation publish action", async () => {
  const editPage = await readFile(editPageUrl, "utf8");

  assert.match(editPage, /status === "published" \? "Published" : "Draft"/);
  assert.match(editPage, /Validate & Publish/);
  assert.match(editPage, /handleSave\("published"\)/);
  assert.match(editPage, /setVersion\(updated\.version\)/);
});

test("AI options and history support Home Page generation and restoration", async () => {
  const [options, history] = await Promise.all([
    readFile(new URL("../app/ai-options/page.jsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ai-history/page.jsx", import.meta.url), "utf8"),
  ]);

  assert.match(options, /id: 'home-page'/);
  assert.match(options, /name: 'Home Page'/);
  assert.match(history, /'home-page': '🏠'/);
  assert.match(history, /normalized\.document\.kind === 'home-page'/);
  assert.match(history, /\? 'Home Page'/);
});

test("visual builder preserves Home Page type and exposes canonical site bindings", async () => {
  const [context, settings, header] = await Promise.all([
    readFile(new URL("../components/admin/builder/BuilderContext.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/admin/builder/SettingsPanel.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/admin/builder/EditorHeader.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(context, /"Single Post" \| "Blog Archive" \| "Home Page"/);
  assert.match(context, /kindToTemplateType\(templateTypeToKind\(type\)\)/);
  assert.match(settings, /value="Home Page"/);
  assert.match(settings, /value="site\.tagline"/);
  assert.match(settings, /value="site\.heroImage"/);
  assert.match(header, /\["Single Post", "Blog Archive", "Home Page"\]/);
});

test("the manual Home Page starter uses canonical dynamic identity and post blocks", async () => {
  const source = await readFile(templateLayoutUrl, "utf8");

  assert.match(source, /kind === "home-page"/);
  assert.match(source, /content: "site\.name"/);
  assert.match(source, /content: "site\.tagline"/);
  assert.match(source, /type: "Collection List"/);
});
