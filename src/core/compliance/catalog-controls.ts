import { defaultRolePolicy, type Role } from "../admin/role-policy.ts";
import type { NormativeRule } from "./frameworks.ts";
import { hiddenConformityClaim } from "./semantic.ts";
import type { ValidationResult } from "./validators.ts";

const roles = new Set<string>(Object.keys(defaultRolePolicy));
const approvers = new Set(
  Object.values(defaultRolePolicy).filter((item) => item.canApprove).map((item) => item.role),
);
const risks = new Set(["risco-auth", "risco-primeiro-admin", "risco-ficha", "risco-wcag"]);
const policies = new Set([
  "politica-25010",
  "politica-27001",
  "politica-38500",
  "politica-acesso",
  "politica-cobit",
  "politica-coso",
  "politica-dado",
  "politica-escopo-normativo",
  "politica-ia",
  "politica-iso-suporte",
  "politica-seguranca",
]);
const tools = new Set(["apgar", "braden", "gotejamento", "imc", "morse"]);
const controls = new Set([
  "access-control-validator",
  "iso-ficha-validator",
  "risk-owner-validator",
  "control-evidence-validator",
  "governance-validator",
  "risk-treatment-validator",
  "asset-risk-validator",
  "change-approval-validator",
]);

function finish(rule: NormativeRule, ok: boolean, reason: string | undefined, outcome: ValidationResult["outcome"] = ok ? "approved" : "rejected"): ValidationResult {
  return {
    ok,
    ruleId: rule.id,
    framework: rule.framework,
    reason,
    requiredEvidence: rule.requiredEvidence,
    severity: rule.severity,
    onFail: rule.onFail,
    outcome,
  };
}

function person(value: unknown) {
  return value === "owner" || (typeof value === "string" && (roles.has(value) || /^pessoa-[a-z0-9-]{1,40}$/.test(value)));
}

function noClaim(rule: NormativeRule, evidence: Record<string, unknown>): ValidationResult | null {
  return hiddenConformityClaim(evidence) ? finish(rule, false, "catalogo:afirmacao") : null;
}

export function validateRiskOwner(rule: NormativeRule, evidence: Record<string, unknown>): ValidationResult {
  const claim = noClaim(rule, evidence);
  if (claim) return claim;
  if (!person(evidence["risk-owner"]) || evidence["risk-owner"] === "kernel") return finish(rule, false, "catalogo:owner");
  if (!risks.has(String(evidence["risk-register"] ?? ""))) return finish(rule, false, "catalogo:registro");
  return finish(rule, true, undefined);
}

export function validateControlEvidence(rule: NormativeRule, evidence: Record<string, unknown>): ValidationResult {
  const claim = noClaim(rule, evidence);
  if (claim) return claim;
  if (!controls.has(String(evidence["control-evidence"] ?? ""))) return finish(rule, false, "catalogo:controle");
  if (evidence["approval-log"] !== "sem-aprovacao") return finish(rule, false, "catalogo:aprovacao");
  return finish(rule, true, undefined);
}

export function validateGovernance(rule: NormativeRule, evidence: Record<string, unknown>): ValidationResult {
  const claim = noClaim(rule, evidence);
  if (claim) return claim;
  if (!policies.has(String(evidence["governance-policy"] ?? ""))) return finish(rule, false, "catalogo:politica");
  if (!approvers.has(evidence["approver-role"] as Role)) return finish(rule, false, "catalogo:aprovador");
  return finish(rule, true, undefined);
}

export function validateRiskTreatment(rule: NormativeRule, evidence: Record<string, unknown>): ValidationResult {
  const claim = noClaim(rule, evidence);
  if (claim) return claim;
  const plan = evidence["risk-treatment-plan"];
  if (plan === undefined || plan === "") return finish(rule, false, "catalogo:tratamento-hold", "hold");
  if (plan !== "plano-interno") return finish(rule, false, "catalogo:tratamento");
  if (!person(evidence["risk-owner"]) || evidence["risk-owner"] === "kernel") return finish(rule, false, "catalogo:owner");
  return finish(rule, true, undefined);
}

export function validateAssetRisk(rule: NormativeRule, evidence: Record<string, unknown>): ValidationResult {
  const claim = noClaim(rule, evidence);
  if (claim) return claim;
  if (!tools.has(String(evidence["asset-register"] ?? ""))) return finish(rule, false, "catalogo:ativo");
  if (!risks.has(String(evidence["risk-log"] ?? ""))) return finish(rule, false, "catalogo:registro");
  return finish(rule, true, undefined);
}

export function validateChangeApproval(rule: NormativeRule, evidence: Record<string, unknown>): ValidationResult {
  const claim = noClaim(rule, evidence);
  if (claim) return claim;
  if (typeof evidence["change-request"] !== "string" || !/^mudanca-[a-z0-9-]{3,40}$/.test(evidence["change-request"])) {
    return finish(rule, false, "catalogo:mudanca");
  }
  if (evidence["approval-record"] !== "nao-aprovado") return finish(rule, false, "catalogo:aprovacao");
  return finish(rule, true, undefined);
}
