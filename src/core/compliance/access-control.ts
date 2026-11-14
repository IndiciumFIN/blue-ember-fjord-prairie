import { assertProductionAuth } from "../../lib/publish-guard.ts";
import type { NormativeRule } from "./frameworks.ts";
import { hiddenConformityClaim } from "./semantic.ts";
import type { ValidationResult } from "./validators.ts";

const INTERNAL_POLICY = "politica-27001";

function result(rule: NormativeRule, ok: boolean, reason?: string): ValidationResult {
  return {
    ok,
    ruleId: rule.id,
    framework: rule.framework,
    reason,
    requiredEvidence: rule.requiredEvidence,
    severity: rule.severity,
    onFail: rule.onFail,
    outcome: ok ? "approved" : "rejected",
  };
}

/** Obrigação interna da politica-27001. Não lê a norma e não certifica. */
export function validateAccessControl(
  rule: NormativeRule,
  evidence: Record<string, unknown>,
  env: NodeJS.ProcessEnv = process.env,
): ValidationResult {
  if (hiddenConformityClaim(evidence)) return result(rule, false, "catalogo:afirmacao");
  if (evidence["internal-policy"] !== INTERNAL_POLICY) {
    return result(rule, false, "access-control:internal-policy");
  }
  if (evidence.role !== "admin") {
    return result(rule, false, "access-control:role");
  }
  try {
    assertProductionAuth(env);
  } catch {
    return result(rule, false, "access-control:auth-disabled");
  }
  return result(rule, true);
}
