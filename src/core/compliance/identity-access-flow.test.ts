import assert from "node:assert/strict";
import test from "node:test";
import { auditIdentityAccessFlow } from "./identity-access-flow.ts";
import { auditPlatformConclusion } from "./platform-conclusion.ts";

test("o fluxo da pessoa passa pelas camadas 1 e 2 e o pedido aponta para user", async () => {
  const flow = auditIdentityAccessFlow();
  assert.equal(flow.identity, true);
  assert.equal(flow.access, true);
  assert.equal(flow.sessionAccount, true);
  assert.equal(flow.accessKeys, true);
  assert.equal(flow.verificationAlone, true);
  assert.equal(flow.orderPointsToUser, true);
  assert.equal(flow.relations, true);
  assert.equal(flow.sameRoleWord, true);
  assert.equal(flow.flow, true);
  assert.equal(flow.layer3, false);
  const platform = await auditPlatformConclusion();
  assert.equal(platform.concluded, false);
});
