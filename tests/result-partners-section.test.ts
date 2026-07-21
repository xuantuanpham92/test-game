import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("renders the partners section between the team copy and contact section", () => {
  const pageSource = readFileSync("app/result/[id]/page.tsx", "utf8");

  assert.match(pageSource, /function PartnersSection\(/);
  assert.match(pageSource, /与优秀伙伴，共赴成长/);
  assert.match(pageSource, /教育创新伙伴/);
  assert.match(pageSource, /学习成长伙伴/);
  assert.match(pageSource, /技术共创伙伴/);
  assert.match(pageSource, /grid-cols-1 md:grid-cols-3/);

  const partnersPosition = pageSource.indexOf("<PartnersSection />");
  const contactPosition = pageSource.indexOf("<ContactSection />");
  assert.ok(partnersPosition > -1, "partners section should be mounted");
  assert.ok(partnersPosition < contactPosition, "partners section should precede contact section");
});
