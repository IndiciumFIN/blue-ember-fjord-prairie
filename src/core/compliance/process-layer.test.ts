import assert from "node:assert/strict";
import test from "node:test";
import { auditProcessSpine } from "./process-layer.ts";
import { auditPlatformConclusion } from "./platform-conclusion.ts";

test("a espinha do processo fecha e o resto da camada 3 continua aberto", async () => {
  const layer = auditProcessSpine();
  assert.equal(layer.described, true);
  assert.equal(layer.relations, true);
  assert.equal(layer.leavesRemainder, true);
  assert.equal(layer.priorFlow, true);
  assert.equal(layer.spine, true);
  assert.equal(layer.wholeLayer, false);
  const platform = await auditPlatformConclusion();
  assert.equal(platform.concluded, false);
});
