import assert from "node:assert/strict";
import test from "node:test";
import { getPersonalityCardLine } from "../lib/personality-card-copy";

const typeKeys = [
  "condition_leaker",
  "formula_sleeper",
  "variant_lost",
  "calculation_crasher",
  "review_disconnected",
  "expression_offline",
  "final_boss_lost",
  "time_blackhole",
  "perfect",
];

test("provides shareable copy for every personality card type", () => {
  for (const typeKey of typeKeys) {
    const line = getPersonalityCardLine(typeKey);

    assert.ok(line.length >= 8, `${typeKey} should have a memorable line`);
    assert.notEqual(line, "这是一份属于你的学习人格画像。");
  }
});

test("falls back to existing short description for unknown personality types", () => {
  assert.equal(
    getPersonalityCardLine("new_type", "这是一句已有的人格描述。"),
    "这是一句已有的人格描述。"
  );
});

test("falls back to a generic line when no type or description exists", () => {
  assert.equal(getPersonalityCardLine(null), "这是一份属于你的学习人格画像。");
});
