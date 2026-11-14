import { syntaxReason } from "./syntax-schema.ts";

export type SemanticResult = { ok: boolean; reason?: string };

const claim = /certificad|conformidade|\bconforme\b|certified|cumprid[ao]/i;

const structural = new Set([
  "fichaId",
  "supportId",
  "priority",
  "right",
  "internal-policy",
  "role",
  "owner",
  "approver",
  "measured",
  "treatmentPlan",
  "aiInventory",
  "certificate",
  "claimsConformity",
]);

/** Lê a frase de sintaxe já gravada na especificação. Frase desconhecida não passa. */
export function matchesSyntax(syntax: string, value: unknown): SemanticResult {
  const reason = syntaxReason(syntax, value);
  return reason ? { ok: false, reason } : { ok: true };
}

/** Acha declaração de conformidade escondida em texto livre. Identificadores não entram. */
export function hiddenConformityClaim(evidence: Record<string, unknown>): boolean {
  return Object.entries(evidence).some(([key, value]) => !structural.has(key) && typeof value === "string" && claim.test(value));
}
