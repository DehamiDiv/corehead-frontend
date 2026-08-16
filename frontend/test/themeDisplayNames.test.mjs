import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const themePresetsSource = readFileSync(
  new URL("../lib/themePresets.ts", import.meta.url),
  "utf8",
);

test("Appearance labels the twelve registered themes sequentially", () => {
  assert.match(
    themePresetsSource,
    /Object\.values\(THEME_PRESETS\)\.map\(\(theme, index\)/,
  );
  assert.match(themePresetsSource, /name: `Theme \$\{index \+ 1\}`/);
});
