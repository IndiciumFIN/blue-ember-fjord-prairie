import assert from "node:assert/strict";
import test from "node:test";
import { clinicalToolBacklog } from "./clinical-tool-backlog.ts";

test("inventário histórico tem IDs únicos, não admite ferramentas e exclui trabalho", () => {
  const entries = clinicalToolBacklog();
  assert.equal(entries.length, 71);
  assert.equal(new Set(entries.map((entry) => entry.canonicalId)).size, entries.length);
  assert.equal(entries.filter((entry) => entry.state === "CANDIDATE_RUNTIME").length, 2);
  assert.equal(entries.filter((entry) => entry.state === "MISSING_RUNTIME").length, 69);
  for (const entry of entries) {
    assert.equal(entry.clinicalRelease, "NO_GO");
    assert.equal(entry.workOrder, "PENDING_FIND_POLICY_VALIDATOR_WO");
    assert.ok(!["ferias", "horas-extras", "rescisao", "adicional-noturno"].includes(entry.slug));
  }
});
