import { validateAccessControl } from "./access-control.ts";
import { hiddenConformityClaim } from "./semantic.ts";
import type { NormativeRule } from "./frameworks.ts";
import type { ValidationResult } from "./validators.ts";

export const isoAgents = ["seguranca", "dado", "governanca", "produto"] as const;
export type IsoAgent = (typeof isoAgents)[number];

export type IsoKind = "access" | "maker-checker" | "quality-partial" | "risk-hold" | "ai-absent" | "no-certificate" | "metadata-only";

export type IsoFicha = {
  id: string;
  agent: IsoAgent;
  priority: string;
  kind: IsoKind;
};

/** Identificadores públicos. O texto da norma não entra aqui. */
export const isoFichas: readonly IsoFicha[] = [
  { id: "STD-ISO-10007", agent: "produto", priority: "P1", kind: "metadata-only" },
  { id: "STD-ISO-10015", agent: "produto", priority: "P1", kind: "metadata-only" },
  { id: "STD-ISO-11179-1", agent: "dado", priority: "P0", kind: "metadata-only" },
  { id: "STD-ISO-11179-3", agent: "dado", priority: "P0", kind: "metadata-only" },
  { id: "STD-ISO-11179-31", agent: "dado", priority: "P0", kind: "metadata-only" },
  { id: "STD-ISO-12207", agent: "produto", priority: "P0", kind: "metadata-only" },
  { id: "STD-ISO-15489-1", agent: "dado", priority: "P0", kind: "metadata-only" },
  { id: "STD-ISO-19011", agent: "governanca", priority: "P0", kind: "metadata-only" },
  { id: "STD-ISO-25010", agent: "produto", priority: "P0", kind: "quality-partial" },
  { id: "STD-ISO-25012", agent: "dado", priority: "P1", kind: "metadata-only" },
  { id: "STD-ISO-25964-1", agent: "dado", priority: "Não avaliada", kind: "metadata-only" },
  { id: "STD-ISO-25964-2", agent: "dado", priority: "Não avaliada", kind: "metadata-only" },
  { id: "STD-ISO-27001", agent: "seguranca", priority: "P0", kind: "access" },
  { id: "STD-ISO-27002", agent: "seguranca", priority: "P0", kind: "maker-checker" },
  { id: "STD-ISO-27701", agent: "seguranca", priority: "P1", kind: "metadata-only" },
  { id: "STD-ISO-30401", agent: "produto", priority: "P1", kind: "metadata-only" },
  { id: "STD-ISO-31000", agent: "governanca", priority: "P0", kind: "risk-hold" },
  { id: "STD-ISO-37301", agent: "governanca", priority: "P1", kind: "metadata-only" },
  { id: "STD-ISO-38500", agent: "governanca", priority: "Não avaliada", kind: "no-certificate" },
  { id: "STD-ISO-38505-1", agent: "governanca", priority: "P0", kind: "metadata-only" },
  { id: "STD-ISO-42001", agent: "seguranca", priority: "P1", kind: "ai-absent" },
  { id: "STD-ISO-42010", agent: "produto", priority: "P0", kind: "metadata-only" },
  { id: "STD-ISO-45001", agent: "produto", priority: "P2", kind: "metadata-only" },
  { id: "STD-ISO-8000-100", agent: "dado", priority: "P0", kind: "metadata-only" },
  { id: "STD-ISO-8000-110", agent: "dado", priority: "P0", kind: "metadata-only" },
  { id: "STD-ISO-8000-115", agent: "dado", priority: "P0", kind: "metadata-only" },
  { id: "STD-ISO-8000-130", agent: "dado", priority: "P1", kind: "metadata-only" },
  { id: "STD-ISO-8000-140", agent: "dado", priority: "P1", kind: "metadata-only" },
  { id: "STD-ISO-8000-61", agent: "dado", priority: "Não avaliada", kind: "metadata-only" },
  { id: "STD-ISO-80000-1", agent: "dado", priority: "P1", kind: "metadata-only" },
  { id: "STD-ISO-9001", agent: "governanca", priority: "P1", kind: "no-certificate" },
  { id: "WATCH-ISO-31000-ED3", agent: "governanca", priority: "Observação", kind: "metadata-only" },
  { id: "WATCH-ISO-9001-ED6", agent: "governanca", priority: "Observação", kind: "metadata-only" },
  { id: "WATCH-ISO-DIS-30401", agent: "produto", priority: "Observação", kind: "metadata-only" },
];

const byId = new Map(isoFichas.map((ficha) => [ficha.id, ficha]));

export function isoFichaRule(ficha: IsoFicha): NormativeRule {
  return {
    id: ficha.id,
    framework: "INTERNO",
    ruleCode: `INTERNO-${ficha.id}`,
    description: "Controle interno do identificador. Não copia a norma e não certifica.",
    requiredEvidence: ["fichaId", "supportId", "claimsConformity", "right", "priority"],
    validator: "iso-ficha-validator",
    severity: "blocker",
    onFail: ficha.kind === "risk-hold" ? "hold" : "reject",
  };
}

export const isoFichaRules: Record<string, NormativeRule> = Object.fromEntries(
  isoFichas.map((ficha) => [ficha.id, isoFichaRule(ficha)]),
);

function finish(rule: NormativeRule, ok: boolean, reason: string | undefined, outcome: ValidationResult["outcome"]): ValidationResult {
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

export function internalEvidence(ficha: IsoFicha, envReady = true): Record<string, unknown> {
  const base: Record<string, unknown> = {
    fichaId: ficha.id,
    supportId: "politica-iso-suporte",
    claimsConformity: false,
    right: "Só metadado",
    priority: ficha.priority,
  };
  if (ficha.kind === "access") {
    base["internal-policy"] = "politica-27001";
    base.role = "admin";
  }
  if (ficha.kind === "maker-checker") {
    base.owner = "pessoa-1";
    base.approver = "pessoa-2";
  }
  if (ficha.kind === "quality-partial") base.measured = "migration-repeat,five-tools";
  if (ficha.kind === "risk-hold") base.treatmentPlan = "plano-interno";
  if (ficha.kind === "ai-absent") base.aiInventory = "ausente";
  if (ficha.kind === "no-certificate") base.certificate = false;
  if (!envReady) base.role = "subscriber";
  return base;
}

/** Recusa declaração de conformidade. Não lê cláusula. */
export function validateIsoFicha(
  rule: NormativeRule,
  evidence: Record<string, unknown>,
  env: NodeJS.ProcessEnv = process.env,
): ValidationResult {
  const ficha = byId.get(rule.id);
  if (!ficha) return finish(rule, false, "ficha:desconhecida", "rejected");
  if (evidence.fichaId !== ficha.id) return finish(rule, false, "ficha:id", "rejected");
  if (evidence.supportId !== "politica-iso-suporte") return finish(rule, false, "ficha:support", "rejected");
  if (evidence.claimsConformity !== false) return finish(rule, false, "ficha:conformity", "rejected");
  if (evidence.right !== "Só metadado") return finish(rule, false, "ficha:right", "rejected");
  if (evidence.priority !== ficha.priority) return finish(rule, false, "ficha:priority", "rejected");
  if (hiddenConformityClaim(evidence)) return finish(rule, false, "ficha:semantic-claim", "rejected");
  if (ficha.kind === "access") return validateAccessControl(rule, evidence, env);
  if (ficha.kind === "maker-checker") {
    const owner = evidence.owner;
    const approver = evidence.approver;
    if (typeof owner !== "string" || typeof approver !== "string" || owner.trim() === "" || approver.trim() === "" || owner === approver) {
      return finish(rule, false, "ficha:maker-checker", "rejected");
    }
  }
  if (ficha.kind === "quality-partial" && evidence.measured !== "migration-repeat,five-tools") {
    return finish(rule, false, "ficha:measured", "rejected");
  }
  if (ficha.kind === "risk-hold") {
    if (evidence.treatmentPlan !== "plano-interno") {
      const empty = evidence.treatmentPlan === undefined || evidence.treatmentPlan === "";
      return finish(rule, false, empty ? "ficha:treatment-hold" : "ficha:treatment", empty ? "hold" : "rejected");
    }
  }
  if (ficha.kind === "ai-absent" && evidence.aiInventory !== "ausente") {
    return finish(rule, false, "ficha:ai-inventory", "rejected");
  }
  if (ficha.kind === "no-certificate" && evidence.certificate !== false) {
    return finish(rule, false, "ficha:certificate", "rejected");
  }
  return finish(rule, true, undefined, "approved");
}
