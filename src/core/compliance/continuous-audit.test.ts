import assert from "node:assert/strict";
import test from "node:test";
import { auditConformidadeContinua } from "./continuous-audit.ts";

test("a rodada seguinte repete o resultado e não promove a norma", () => {
  const first = auditConformidadeContinua();
  const second = auditConformidadeContinua(first);
  assert.equal(first.isoControls, 34);
  assert.equal(first.catalogControls, 7);
  assert.equal(first.catalogRefused, 7);
  assert.equal(first.semanticFailClosed, true);
  assert.equal(first.gateUnsigned, true);
  assert.equal(first.adherentToInternalControl, true);
  assert.equal(first.stable, true);
  assert.deepEqual(second.drift, []);
  assert.equal(second.stable, true);
  assert.equal(second.isoControls, first.isoControls);
});
