import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("dashboard site switcher remains above the hero content", async () => {
  const navbar = await readFile(
    new URL("../components/admin/Navbar.tsx", import.meta.url),
    "utf8",
  );
  const switcher = await readFile(
    new URL("../components/admin/SiteSwitcher.tsx", import.meta.url),
    "utf8",
  );

  assert.match(navbar, /relative z-\[100\] isolate/);
  assert.match(switcher, /z-\[120\]/);
  assert.match(switcher, /bg-white/);
  assert.match(switcher, /max-h-\[min\(16rem,42vh\)\]/);
});

test("dashboard site switcher exposes accessible menu behavior", async () => {
  const switcher = await readFile(
    new URL("../components/admin/SiteSwitcher.tsx", import.meta.url),
    "utf8",
  );

  assert.match(switcher, /aria-expanded=\{open\}/);
  assert.match(switcher, /aria-haspopup="menu"/);
  assert.match(switcher, /role="menuitemradio"/);
  assert.match(switcher, /if \(e\.key === "Escape"\) setOpen\(false\)/);
  assert.match(switcher, /if \(!active\) setSite\(site\)/);
});
