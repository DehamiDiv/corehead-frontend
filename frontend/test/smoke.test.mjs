import assert from "node:assert/strict";
import test from "node:test";

import { createMemoryStorage, createMockFetch } from "./support/testDoubles.mjs";

test("frontend unit-test harness runs with browser storage isolated", () => {
  const storage = createMemoryStorage({ currentSiteId: "7" });

  assert.equal(storage.getItem("currentSiteId"), "7");
  storage.setItem("layout", JSON.stringify({ blocks: [] }));
  assert.deepEqual(JSON.parse(storage.getItem("layout")), { blocks: [] });
  storage.clear();
  assert.equal(storage.length, 0);
});

test("frontend HTTP test double records calls without network access", async () => {
  const fetchMock = createMockFetch({ success: true });
  const response = await fetchMock("/api/layouts", { method: "POST" });

  assert.deepEqual(await response.json(), { success: true });
  assert.equal(fetchMock.calls.length, 1);
  assert.equal(fetchMock.calls[0].input, "/api/layouts");
  assert.equal(fetchMock.calls[0].init.method, "POST");
});
