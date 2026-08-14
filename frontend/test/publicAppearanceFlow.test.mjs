import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("all tenant public pages inherit one Appearance-powered site shell", async () => {
  const segmentLayout = await source("../app/s/[siteSlug]/layout.tsx");
  const shell = await source("../components/public/PublicSiteShell.tsx");

  assert.match(segmentLayout, /<PublicSiteShell site=\{site\}>\{children\}<\/PublicSiteShell>/);
  assert.match(shell, /resolvePublicBranding\(site\.branding\)/);
  assert.match(shell, /brandingToCssVars\(branding\)/);
  assert.match(shell, /data-theme=\{branding\.themeId \|\| "default"\}/);
  assert.match(shell, /<PublicSiteHeader site=\{siteWithBranding\}/);
  assert.match(shell, /<PublicSiteFooter site=\{siteWithBranding\}/);
});

test("homepage, archive, and single-post pages use shared Appearance tokens", async () => {
  const [home, archive, post] = await Promise.all([
    source("../app/s/[siteSlug]/page.tsx"),
    source("../app/s/[siteSlug]/blog/page.tsx"),
    source("../app/s/[siteSlug]/blog/[postSlug]/page.tsx"),
  ]);

  assert.match(home, /var\(--site-primary\)/);
  assert.match(archive, /resolvePublicBranding\(site\.branding\)/);
  assert.match(post, /var\(--site-primary/);
  assert.match(post, /var\(--site-ink\)/);
  assert.match(post, /var\(--site-muted\)/);
});

test("single-post bodies use a constrained theme-aware reading surface", async () => {
  const [post, renderer, styles] = await Promise.all([
    source("../app/s/[siteSlug]/blog/[postSlug]/page.tsx"),
    source("../components/Renderer/PublicPageRenderer.tsx"),
    source("../app/globals.css"),
  ]);

  assert.match(post, /prose-public post-reading-surface/);
  assert.match(renderer, /className="cms-post-body/);
  assert.match(styles, /\.post-reading-surface \.cms-post-body/);
  assert.match(styles, /max-width: 46rem !important/);
  assert.match(styles, /var\(--site-ink, #0f172a\) 82%/);
  assert.match(styles, /line-height: 1\.85 !important/);
  assert.match(styles, /overflow-wrap: anywhere/);
});

test("Appearance theme activation remains independent from homepage layout selection", async () => {
  const appearance = await source("../app/admin/settings/appearance/page.tsx");

  assert.match(appearance, /preserveHomeLayoutForThemeChange/);
  assert.match(appearance, /api\.updateSetting\("active_theme", \{ themeId \}\)/);
  assert.match(appearance, /api\.updateSetting\("home_layout"/);
});

test("public and Appearance-preview headers keep logo, navigation, and actions aligned", async () => {
  const [header, appearance] = await Promise.all([
    source("../components/public/PublicSiteHeader.tsx"),
    source("../app/admin/settings/appearance/page.tsx"),
  ]);

  assert.match(header, /inline-flex h-10 items-center justify-center/);
  assert.match(header, /group flex h-12[^\"]*items-center/);
  assert.match(header, /block h-auto max-h-10/);
  assert.match(
    header,
    /lg:grid-cols-\[minmax\(0,1fr\)_auto_minmax\(0,1fr\)\]/,
  );
  assert.match(header, /grid h-\[72px\] w-full/);
  assert.doesNotMatch(header, /max-w-6xl/);
  assert.match(header, /items-center justify-center[^\"]*justify-self-center lg:flex/);
  assert.match(header, /items-center justify-end justify-self-end lg:flex/);
  assert.match(
    appearance,
    /grid min-h-16 grid-cols-\[minmax\(0,1fr\)_auto_minmax\(0,1fr\)\] items-center/,
  );
  assert.match(appearance, /justify-self-center text-\[10px\]/);
  assert.match(appearance, /justify-self-end rounded-full/);
});
