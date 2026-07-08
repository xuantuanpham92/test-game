import assert from "node:assert/strict";
import test from "node:test";
import { parseDescriptionSections } from "../lib/description";

test("parses bracketed diagnosis sections", () => {
  assert.deepEqual(
    parseDescriptionSections("【核心诊断】第一段\n\n【失分机制】第二段"),
    [
      { title: "核心诊断", body: "第一段" },
      { title: "失分机制", body: "第二段" },
    ]
  );
});

test("keeps all detailed analysis sections visible", () => {
  const sections = parseDescriptionSections(`【核心诊断】
第一段

【失分机制】
第二段

【为什么会出现这种情况】
第三段

【典型考试场景】
第四段

【预测与发展】
第五段`);

  assert.equal(sections.length, 5);
  assert.deepEqual(
    sections.map((section) => section.title),
    ["核心诊断", "失分机制", "为什么会出现这种情况", "典型考试场景", "预测与发展"]
  );
  assert.deepEqual(
    sections.map((section) => section.body),
    ["第一段", "第二段", "第三段", "第四段", "第五段"]
  );
});

test("ignores intro text before bracketed diagnosis sections", () => {
  const sections = parseDescriptionSections(
    "以下是你的详细分析。\n\n【核心诊断】第一段\n\n【失分机制】第二段"
  );

  assert.deepEqual(sections, [
    { title: "核心诊断", body: "第一段" },
    { title: "失分机制", body: "第二段" },
  ]);
});

test("keeps unsectioned long descriptions visible", () => {
  assert.deepEqual(parseDescriptionSections("这是一段没有分段标题的详细分析。"), [
    { title: "详细分析", body: "这是一段没有分段标题的详细分析。" },
  ]);
});

test("returns no sections for empty descriptions", () => {
  assert.deepEqual(parseDescriptionSections("   "), []);
});
