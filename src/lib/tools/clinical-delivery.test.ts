import assert from "node:assert/strict";
import test from "node:test";
import { auditClinicalPhases } from "./clinical-delivery.ts";

test("as fases do cálculo só seguem com o portão fechado e sem texto licenciado", () => {
  const audit = auditClinicalPhases();
  assert.equal(audit.phase1Deliver, true);
  assert.equal(audit.gateAdmits, true);
  assert.equal(audit.gateStopsText, true);
  assert.equal(audit.deliver, true);
});
