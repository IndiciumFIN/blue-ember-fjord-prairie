import assert from "node:assert/strict";
import test from "node:test";
import { auditAccessLayer } from "./access-layer.ts";
import { auditIdentityLayer } from "./identity-layer.ts";
import { auditPlatformConclusion } from "./platform-conclusion.ts";

test("a camada 2 fecha o acesso sem ligar o papel ao kernel", async () => {
  const layer = auditAccessLayer();
  assert.equal(layer.member, true);
  assert.equal(layer.subscription, true);
  assert.equal(layer.communityPost, true);
  assert.equal(layer.relations, true);
  assert.equal(layer.notKernel, true);
  assert.equal(layer.concluded, true);
  assert.equal(auditIdentityLayer().concluded, true);
  const platform = await auditPlatformConclusion();
  assert.equal(platform.concluded, false);
});
