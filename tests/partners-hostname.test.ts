import assert from "node:assert/strict";
import test from "node:test";
import { getPartnerFromHostname } from "../lib/partners";

test("maps each partner subdomain to its dedicated partner", () => {
  assert.equal(getPartnerFromHostname("qingbei.myfuyao.top")?.slug, "qingbei");
  assert.equal(getPartnerFromHostname("longmen.myfuyao.top")?.slug, "longmen");
  assert.equal(getPartnerFromHostname("jinze.myfuyao.top")?.slug, "jinze");
  assert.equal(getPartnerFromHostname("falv.myfuyao.top")?.slug, "falv");
  assert.equal(getPartnerFromHostname("mingyu.myfuyao.top")?.slug, "mingyu");
  assert.equal(getPartnerFromHostname("jiusi.myfuyao.top")?.slug, "jiusi");
  assert.equal(getPartnerFromHostname("xiangxiangli.myfuyao.top")?.slug, "xiangxiangli");
});

test("supports local subdomain previews and leaves the primary site unfiltered", () => {
  assert.equal(getPartnerFromHostname("qingbei.localhost:3110")?.slug, "qingbei");
  assert.equal(getPartnerFromHostname("myfuyao.top"), null);
  assert.equal(getPartnerFromHostname("localhost:3110"), null);
  assert.equal(getPartnerFromHostname("preview-123.vercel.app"), null);
});
