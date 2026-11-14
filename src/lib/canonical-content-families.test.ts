import assert from "node:assert/strict";
import test from "node:test";
import { canonicalContentFamilies, canonicalFamilyById, auditFamilyCandidate } from "./canonical-content-families.ts";
import { templateCatalog } from "./template-catalog.ts";

test("famílias novas têm identidade única e usam contrato visual existente", () => {
  assert.equal(canonicalContentFamilies.length, 6);
  assert.equal(new Set(canonicalContentFamilies.map((row) => row.id)).size, canonicalContentFamilies.length);
  for (const family of canonicalContentFamilies) {
    assert.equal(family.kind, "editorial");
    assert.ok(family.blocks.length >= 4);
    assert.equal(canonicalFamilyById(family.id), family);
    const matches = templateCatalog.filter((row) => row.id === family.id);
    assert.equal(matches.length, 1, `template duplicado: ${family.id}`);
    assert.equal(matches[0]?.href, `/modelos/${family.id}`);
    assert.equal(matches[0]?.situacao, "molde");
  }
});

test("evidência ausente nunca vira aprovação clínica", () => {
  const missing = auditFamilyCandidate({
    familyId: "protocolo", canonicalId: "cko:protocolo:001", sourceRefs: [],
    rightsVerified: false, humanReviewed: false, kernelAdmitted: false, releaseGatesPassed: false,
  });
  assert.equal(missing.status, "HOLD");
  assert.ok(missing.holds.includes("HOLD_SOURCE"));
  assert.ok(missing.holds.includes("HOLD_KERNEL"));
  assert.equal(missing.clinicalPublicationAuthorized, false);
  const complete = auditFamilyCandidate({
    familyId: "checklist", canonicalId: "cko:checklist:001", sourceRefs: ["source:001"],
    rightsVerified: true, humanReviewed: true, kernelAdmitted: true, releaseGatesPassed: true,
  });
  assert.equal(complete.status, "CANDIDATE_EVIDENCE_COMPLETE");
  assert.equal(complete.clinicalPublicationAuthorized, false);
});

test("famílias desconhecidas falham fechadas", () => {
  const unknown = auditFamilyCandidate({
    familyId: "calculadora-clinica-inventada", canonicalId: "cko:unknown:001", sourceRefs: ["source:001"],
    rightsVerified: true, humanReviewed: true, kernelAdmitted: true, releaseGatesPassed: true,
  });
  assert.equal(unknown.status, "HOLD");
  assert.ok(unknown.holds.includes("HOLD_FAMILY_UNKNOWN"));
});
