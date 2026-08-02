import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("shows seconds in user-management timestamps", () => {
  const pageSource = readFileSync("app/admin/users/page.tsx", "utf8");

  assert.match(pageSource, /hour:\s*"2-digit"/);
  assert.match(pageSource, /minute:\s*"2-digit"/);
  assert.match(pageSource, /second:\s*"2-digit"/);
});
