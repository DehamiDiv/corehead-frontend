import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("admin profile image opens an accessible account and logout menu", async () => {
  const header = await readFile(
    new URL("../components/admin/Header.tsx", import.meta.url),
    "utf8",
  );

  assert.match(header, /aria-haspopup="menu"/);
  assert.match(header, /aria-expanded=\{isProfileMenuOpen\}/);
  assert.match(header, /role="menu"/);
  assert.match(header, /My Account/);
  assert.match(header, />\s*Logout\s*</);
  assert.match(header, /clearSession\(\)/);
  assert.match(header, /router\.replace\("\/login"\)/);
  assert.match(header, /event\.key === "Escape"/);
  assert.match(header, /profileMenuRef\.current\?\.contains/);
});
