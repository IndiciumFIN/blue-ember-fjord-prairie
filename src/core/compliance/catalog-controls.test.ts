import assert from "node:assert/strict";
import test from "node:test";
import { normativeCatalog } from "./frameworks.ts";
import { auditIsoControls } from "./iso-audit.ts";
import { runRule } from "./run-rule.ts";

const cases: Record<string, Record<string, unknown>> = {
  "cso-risk-ownership": { "risk-owner": "pessoa-1", "risk-register": "risco-wcag" },
  "cso-control-evidence": { "control-evidence": "access-control-validator", "approval-log": "sem-aprovacao" },
  "cobit-governance": { "governance-policy": "politica-cobit", "approver-role": "approver" },
  "iso31000-risk-treatment": { "risk-treatment-plan": "plano-interno", "risk-owner": "owner" },
  "nist-csf-identify": { "asset-register": "braden", "risk-log": "risco-auth" },
  "itil-change-approval": { "change-request": "mudanca-capa-braden", "approval-record": "nao-aprovado" },
  "iso27001-access-control": { "internal-policy": "politica-27001", role: "admin" },
};

test("os sete controles nomeados executam e recusam texto solto", () => {
  for (const [id, evidence] of Object.entries(cases)) {
    const rule = normativeCatalog[id];
    assert.equal(runRule(rule, evidence, {}).ok, true, id);
    assert.equal(runRule(rule, { ...evidence, note: "estamos certificados" }, {}).reason, "catalogo:afirmacao");
  }
  const risk = normativeCatalog["iso31000-risk-treatment"];
  assert.equal(runRule(risk, { "risk-owner": "owner" }, {}).outcome, "hold");
  assert.equal(runRule(risk, { "risk-treatment-plan": "outro-plano", "risk-owner": "owner" }, {}).reason, "catalogo:tratamento");
  assert.equal(runRule(risk, { "risk-treatment-plan": "norma-cumprida", "risk-owner": "owner" }, {}).reason, "catalogo:afirmacao");
  const change = normativeCatalog["itil-change-approval"];
  assert.equal(runRule(change, { ...cases["itil-change-approval"], "approval-record": "aprovado" }, {}).ok, false);
});

test("o controle interno segue sem indicador de texto licenciado", () => {
  const audit = auditIsoControls();
  assert.equal(audit.adherentToInternalControl, true);
});
