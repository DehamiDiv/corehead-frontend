import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const profileSource = readFileSync(
  new URL("../app/admin/settings/profile/page.tsx", import.meta.url),
  "utf8",
);
const sessionSource = readFileSync(
  new URL("../lib/authSession.ts", import.meta.url),
  "utf8",
);
const sidebarSource = readFileSync(
  new URL("../components/admin/Sidebar.tsx", import.meta.url),
  "utf8",
);
const headerSource = readFileSync(
  new URL("../components/admin/Header.tsx", import.meta.url),
  "utf8",
);

test("saving a profile synchronizes the cached user across admin chrome", () => {
  assert.match(profileSource, /const savedUser = await api\.updateUser/);
  assert.match(profileSource, /updateStoredUser\(savedUser\)/);
  assert.match(profileSource, /updateStoredUser\(dbUser\)/);
  assert.match(sessionSource, /localStorage\.setItem\("user", JSON\.stringify\(updatedUser\)\)/);
  assert.match(sessionSource, /dispatchEvent\(new Event\("local-storage-update"\)\)/);
  assert.match(sidebarSource, /addEventListener\('local-storage-update', handleStorageChange\)/);
  assert.match(sidebarSource, /fetch\(`\$\{getApiBaseUrl\(\)\}\/auth\/me`/);
  assert.match(headerSource, /addEventListener\("local-storage-update", syncStoredUser\)/);
});
