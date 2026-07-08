import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("highlights the AI notebook product copy on the result page", () => {
  const pageSource = readFileSync("app/result/[id]/page.tsx", "utf8");

  assert.match(
    pageSource,
    /<span[^>]+className="[^"]*font-extrabold[^"]*"[^>]*>\s*自研 AI 错题本工具\s*<\/span>/
  );
});
