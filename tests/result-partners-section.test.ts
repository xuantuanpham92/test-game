import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("renders the partners section below the personality card", () => {
  const pageSource = readFileSync("app/result/[id]/page.tsx", "utf8");

  assert.match(pageSource, /function PartnersSection\(/);
  assert.match(pageSource, /与优秀伙伴，共赴成长/);
  assert.match(pageSource, /xx书店/);
  assert.match(pageSource, /学习成长伙伴/);
  assert.match(pageSource, /技术共创伙伴/);
  assert.match(pageSource, /grid-cols-1 md:grid-cols-3/);
  assert.match(pageSource, /bg-white\/\[0\.07\]/);
  assert.match(pageSource, /backdrop-blur-xl/);
  assert.match(pageSource, /hover:-translate-y-2/);
  assert.match(pageSource, /shadow-\[0_30px_80px_rgba\(20,12,75,0\.38\)\]/);
  assert.match(pageSource, /bg-white\/\[0\.18\]/);

  const partnersPosition = pageSource.indexOf("<PartnersSection />");
  const contactPosition = pageSource.indexOf("<ContactSection />");
  const personalityCardPosition = pageSource.indexOf(
    "<PersonalityCardSection report={data} />"
  );
  assert.ok(partnersPosition > -1, "partners section should be mounted");
  assert.ok(contactPosition < partnersPosition, "contact section should precede partners section");
  assert.ok(
    personalityCardPosition < partnersPosition,
    "personality card should precede partners section"
  );
});
