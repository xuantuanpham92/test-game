import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("renders the partners section below the personality card", () => {
  const pageSource = readFileSync("app/result/[id]/page.tsx", "utf8");

  assert.match(pageSource, /function PartnersSection\(/);
  assert.match(pageSource, /与优秀伙伴，共赴成长/);
  assert.match(pageSource, /getPartnerFromHostname/);
  assert.match(pageSource, /displayedPartners\.map/);
  assert.match(pageSource, /partner\.address/);
  assert.match(pageSource, /grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4/);
  assert.match(
    pageSource,
    /activePartner\s*\?\s*"mt-8 grid grid-cols-1 gap-4 mx-auto max-w-sm"/
  );
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
