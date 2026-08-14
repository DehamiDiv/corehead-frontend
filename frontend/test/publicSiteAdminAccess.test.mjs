import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("public site dashboard is rendered only after backend membership verification", async () => {
  const [header, api] = await Promise.all([
    source("../components/public/PublicSiteHeader.tsx"),
    source("../lib/api.ts"),
  ]);

  assert.match(header, /api\.getManageableSite\(site\.id\)/);
  assert.match(header, /if \(isDashboard\) return Boolean\(manageableSite\)/);
  assert.match(header, /if \(isLogout\) return hasSession/);
  assert.match(header, /if \(!manageableSite\) return null/);
  assert.match(header, /router\.push\(`\/admin\/posts\?site=/);

  assert.match(api, /async getManageableSite/);
  assert.match(api, /fetch\(`\$\{BASE_URL\}\/sites\/\$\{id\}`/);
  assert.match(api, /res\.status === 401 \|\| res\.status === 403 \|\| res\.status === 404/);
  assert.doesNotMatch(api, /getManageableSite[\s\S]{0,800}window\.location\.href/);
});

test("public site dashboard stores only the membership-verified site", async () => {
  const header = await source("../components/public/PublicSiteHeader.tsx");

  assert.match(header, /id: manageableSite\.id/);
  assert.match(header, /slug: manageableSite\.slug/);
  assert.doesNotMatch(header, /if \(!token\)[\s\S]{0,200}router\.push/);
});

test("admin tenant deep links reject an unauthorized site without fallback", async () => {
  const [siteContext, adminLayout] = await Promise.all([
    source("../components/admin/SiteContext.tsx"),
    source("../app/admin/layout.tsx"),
  ]);

  assert.match(siteContext, /if \(requestedSite && !queryMatch\)/);
  assert.match(siteContext, /setAccessDeniedSiteSlug\(requestedSiteSlug\)/);
  assert.match(siteContext, /setAccessDeniedSite\(true\)/);
  assert.match(siteContext, /setCurrentSite\(null\)/);
  assert.match(adminLayout, /if \(siteCtx\.accessDeniedSite\)/);
  assert.match(adminLayout, /You cannot manage this site/);
  assert.match(adminLayout, /This dashboard is available only to the site owner and authorized team members/);
});
