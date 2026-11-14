import assert from "node:assert/strict";
import test from "node:test";
import { normativeCatalog } from "../compliance/frameworks.ts";
import { registeredValidators, runRule } from "../compliance/run-rule.ts";
import { admitSyntax } from "./admit.ts";
import { renderAdmittedResult } from "../../lib/tools/engine-guard.ts";
import type { ToolSuccess } from "../../lib/tools/engine.ts";

test("schema, validador e renderer usam a mesma admissão", () => {
  const registered = new Set(registeredValidators());
  for (const rule of Object.values(normativeCatalog)) {
    assert.equal(registered.has(rule.validator), true, rule.id);
  }
  const orphan = { ...normativeCatalog["cso-risk-ownership"], id: "orfao", validator: "nao-existe" };
  assert.equal(runRule(orphan, { "risk-owner": "pessoa-1", "risk-register": "risco-wcag" }).reason, "runtime:validador-ausente");
  const held = runRule(normativeCatalog["iso31000-risk-treatment"], { "risk-owner": "owner" });
  assert.equal(held.ok, false);
  assert.equal(held.outcome, "hold");
  assert.equal(admitSyntax("frase que não está no dicionário", "qualquer").outcome, "reject");
  assert.equal(admitSyntax("booleano", true).outcome, "admit");
  const broken: ToolSuccess = {
    ok: true,
    totalLabel: "Resultado",
    total: Number.NaN,
    rows: [{ label: "Volume", value: "1", max: "—" }],
  };
  assert.equal(renderAdmittedResult(broken), null);
});
