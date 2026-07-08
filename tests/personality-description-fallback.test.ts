import assert from "node:assert/strict";
import test from "node:test";
import { getDisplayLongDescription } from "../lib/personality-description-fallback";

test("uses canonical long description when database description is an old short variant", () => {
  const description = getDisplayLongDescription(
    "variant_lost",
    "你对原题的掌握很扎实，但面对变式题时缺乏模式识别能力。"
  );

  const titles = [...description.matchAll(/【([^】]+)】/g)].map((match) => match[1]);

  assert.deepEqual(titles, [
    "核心诊断",
    "失分机制",
    "为什么会出现这种情况",
    "典型考试场景",
    "预测与发展",
  ]);
});

test("uses canonical long description for stale expression offline descriptions", () => {
  const description = getDisplayLongDescription(
    "expression_offline",
    "你能在脑海中形成解题思路，甚至口头能讲清楚，但落到纸面上时过程跳跃、关键步骤缺失、格式不规范。"
  );

  const titles = [...description.matchAll(/【([^】]+)】/g)].map((match) => match[1]);

  assert.deepEqual(titles, [
    "核心诊断",
    "失分机制",
    "为什么你会跳步",
    "典型考试场景",
    "预测与发展",
  ]);
});

test("keeps structured database descriptions unchanged", () => {
  const structured = "【核心诊断】第一段\n\n【失分机制】第二段";

  assert.equal(getDisplayLongDescription("variant_lost", structured), structured);
});

test("keeps unknown unstructured descriptions when no canonical fallback exists", () => {
  assert.equal(getDisplayLongDescription("unknown", "短描述"), "短描述");
});
