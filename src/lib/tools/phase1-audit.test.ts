import assert from "node:assert/strict";
import test from "node:test";
import { auditPhase1 } from "./phase1-audit.ts";

test("a fase 1 fecha contra o documento interno e não contra o texto licenciado", () => {
  const audit = auditPhase1();
  const failed = audit.checks.filter((check) => !check.ok).map((check) => check.id);
  assert.deepEqual(failed, []);
  assert.equal(audit.internalText, true);
  assert.equal(audit.nbrExamples, true);
  assert.equal(audit.deliver, true);
});
