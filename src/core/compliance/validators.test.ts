import { test } from "node:test";
import assert from "node:assert/strict";
import { normativeCatalog } from "./frameworks.ts";
import { runRule } from "./run-rule.ts";
import { validateRequiredEvidence } from "./validators.ts";

const rule = normativeCatalog["cso-risk-ownership"];
const good = { "risk-owner": "owner-1", "risk-register": "registry://2026-11" };

test("required evidence presence passes for nonempty real values, without claiming provenance", () => {
  assert.equal(validateRequiredEvidence(rule, good).ok, true);
  assert.equal(validateRequiredEvidence(rule, { ...good, "risk-register": { ref: "registry://2026-11" } }).ok, true);
  assert.equal(validateRequiredEvidence(rule, { ...good, "risk-register": 0 }).ok, true);
});

test("empty placeholders, blanks and non-finite values do not satisfy evidence", () => {
  const missing = [null, undefined, "", "   ", false, [], {}, { ref: "" }, NaN, Infinity, [""], [null]];
  for (const value of missing) {
    const result = validateRequiredEvidence(rule, { ...good, "risk-register": value });
    assert.equal(result.ok, false, "unexpected evidence accepted: " + String(value));
    assert.equal(result.outcome, "rejected");
    assert.match(result.reason ?? "", /missing-evidence:risk-register/);
  }
});

test("evidence must be owned, not inherited from Object.prototype", () => {
  const proto = Object.create({ "risk-owner": "pretend" });
  proto["risk-register"] = "registry://2026-11";
  assert.equal(validateRequiredEvidence(rule, proto).ok, false);
});

test("arrays containing empty items are not sufficient evidence", () => {
  assert.equal(validateRequiredEvidence(rule, { ...good, "risk-register": ["ok", ""] }).ok, false);
  assert.equal(validateRequiredEvidence(rule, { ...good, "risk-register": ["ok", "another"] }).ok, true);
});

test("policy-defined HOLD rather than an inferred PASS is preserved", () => {
  const hold = normativeCatalog["iso31000-risk-treatment"];
  const result = validateRequiredEvidence(hold, { "risk-owner": "reviewer" });
  assert.equal(result.ok, false);
  assert.equal(result.outcome, "hold");
});

test("a regra interna de acesso não aceita o número antigo da norma como prova", () => {
  const access = normativeCatalog["iso27001-access-control"];
  assert.equal(access.ruleCode, "INTERNO-politica-27001");
  const good = { "internal-policy": "politica-27001", role: "admin" };
  assert.equal(runRule(access, good, {}).ok, true);
  assert.equal(runRule(access, { ...good, "internal-policy": "ISO27001-A.5.1" }, {}).reason, "access-control:internal-policy");
  assert.equal(runRule(access, { ...good, role: "subscriber" }, {}).reason, "access-control:role");
  assert.equal(runRule(access, good, { VERCEL: "1", VITE_AUTH_ENABLED: "false" }).reason, "access-control:auth-disabled");
  assert.equal(runRule(access, { "internal-policy": "politica-27001" }, {}).ok, false);
});
