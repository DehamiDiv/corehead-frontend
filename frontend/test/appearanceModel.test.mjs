import assert from "node:assert/strict";
import test from "node:test";

import appearance from "../../../contracts/appearance-model-v1.js";

const {
  APPEARANCE_SETTING_OWNERSHIP,
  extractHomeStyle,
  preserveHomeLayoutForThemeChange,
  selectHomeLayout,
  selectTheme,
} = appearance;

test("theme and homepage settings have separate ownership", () => {
  assert.ok(APPEARANCE_SETTING_OWNERSHIP.theme.includes("active_theme"));
  assert.ok(APPEARANCE_SETTING_OWNERSHIP.homepage.includes("home_layout"));
  assert.equal(APPEARANCE_SETTING_OWNERSHIP.theme.includes("home_layout"), false);
});

test("selecting a theme preserves layout and homepage content", () => {
  const current = {
    themeId: "theme-1",
    homeStyle: "paper",
    home: { heroTitle: "Owner copy" },
    colours: { primary: "#123456" },
  };
  const next = selectTheme(current, "theme-6");

  assert.equal(next.themeId, "theme-6");
  assert.equal(next.homeStyle, "paper");
  assert.deepEqual(next.home, current.home);
  assert.deepEqual(next.colours, current.colours);
});

test("selecting a homepage layout preserves theme customizations", () => {
  const current = {
    themeId: "theme-4",
    homeStyle: "classic",
    colours: { primary: "#123456" },
  };
  const next = selectHomeLayout(current, "studio");

  assert.equal(next.homeStyle, "studio");
  assert.equal(next.themeId, "theme-4");
  assert.deepEqual(next.colours, current.colours);
});

test("theme activation preserves explicit home layout and owner content", () => {
  const existing = { homeStyle: "bento", heroTitle: "Keep this" };
  const result = preserveHomeLayoutForThemeChange(existing, "classic");

  assert.equal(result.changed, false);
  assert.equal(result.homeStyle, "bento");
  assert.equal(result.value, existing);
});

test("theme activation establishes the current layout when legacy settings omit it", () => {
  const result = preserveHomeLayoutForThemeChange(
    { heroTitle: "Legacy owner copy" },
    "magazine",
  );

  assert.equal(result.changed, true);
  assert.deepEqual(result.value, {
    heroTitle: "Legacy owner copy",
    homeStyle: "paper",
  });
  assert.equal(extractHomeStyle(result.value), "paper");
});
