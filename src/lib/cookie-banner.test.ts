import assert from "node:assert/strict";
import test from "node:test";
import { categoryOn, parseConsent, serializeConsent } from "./cookie-banner.ts";

test("cada finalidade é lida sozinha", () => {
  assert.equal(parseConsent(null), "unknown");
  assert.deepEqual(parseConsent("rejected"), { translation: false, audience: false, memory: false });
  const saved = serializeConsent({ translation: true, audience: false, memory: true });
  assert.deepEqual(parseConsent(saved), { translation: true, audience: false, memory: true });
  assert.deepEqual(parseConsent('{"translation":false,"audience":true}'), { translation: false, audience: true, memory: false });
  assert.equal(categoryOn("unknown", "memory"), false);
  assert.equal(categoryOn({ translation: false, audience: false, memory: true }, "memory"), true);
  assert.equal(categoryOn({ translation: true, audience: false, memory: false }, "audience"), false);
});
