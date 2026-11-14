import { admitStep } from "../runtime/admit.ts";
import { validateAccessControl } from "./access-control.ts";
import {
  validateAssetRisk,
  validateChangeApproval,
  validateControlEvidence,
  validateGovernance,
  validateRiskOwner,
  validateRiskTreatment,
} from "./catalog-controls.ts";
import type { NormativeRule } from "./frameworks.ts";
import { validateIsoFicha } from "./iso-fichas.ts";
import type { ValidationResult } from "./validators.ts";

const executable: Record<
  string,
  (rule: NormativeRule, evidence: Record<string, unknown>, env: NodeJS.ProcessEnv) => ValidationResult
> = {
  "access-control-validator": validateAccessControl,
  "iso-ficha-validator": validateIsoFicha,
  "risk-owner-validator": (rule, evidence) => validateRiskOwner(rule, evidence),
  "control-evidence-validator": (rule, evidence) => validateControlEvidence(rule, evidence),
  "governance-validator": (rule, evidence) => validateGovernance(rule, evidence),
  "risk-treatment-validator": (rule, evidence) => validateRiskTreatment(rule, evidence),
  "asset-risk-validator": (rule, evidence) => validateAssetRisk(rule, evidence),
  "change-approval-validator": (rule, evidence) => validateChangeApproval(rule, evidence),
};

/** A função ausente é recusa. Hold é parada. Só resultado aceito é admissão. */
export function runRule(
  rule: NormativeRule,
  evidence: Record<string, unknown>,
  env: NodeJS.ProcessEnv = process.env,
): ValidationResult {
  const check = executable[rule.validator];
  if (!check) {
    return {
      ok: false,
      ruleId: rule.id,
      framework: rule.framework,
      reason: "runtime:validador-ausente",
      requiredEvidence: rule.requiredEvidence,
      severity: rule.severity,
      onFail: rule.onFail,
      outcome: "rejected",
    };
  }
  const result = check(rule, evidence, env);
  const admitted = admitStep("validator", result, (value) => {
    if (value.ok) return { outcome: "admit" };
    if (value.outcome === "hold") return { outcome: "stop", reason: value.reason };
    return { outcome: "reject", reason: value.reason };
  });
  if (admitted.outcome === "admit") return result;
  return { ...result, ok: false, outcome: admitted.outcome === "stop" ? "hold" : "rejected" };
}

export function registeredValidators() {
  return Object.keys(executable);
}
