import assert from "node:assert/strict";
import test from "node:test";
import { auditIdentityLayer } from "./identity-layer.ts";
import { auditPlatformConclusion } from "./platform-conclusion.ts";

test("a camada 1 fecha a identidade e a plataforma continua aberta", async () => {
  const layer = auditIdentityLayer();
  assert.equal(layer.user, true);
  assert.equal(layer.session, true);
  assert.equal(layer.account, true);
  assert.equal(layer.verification, true);
  assert.equal(layer.relations, true);
  assert.equal(layer.verificationAlone, true);
  assert.equal(layer.concluded, true);
  const platform = await auditPlatformConclusion();
  assert.equal(platform.concluded, false);
});
