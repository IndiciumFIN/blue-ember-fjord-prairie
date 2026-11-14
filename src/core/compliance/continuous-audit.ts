import { decide, evaluateCompliance } from "../kernel/kernel.ts";
import type { ExecutionGate } from "../kernel/gate.ts";
import { normativeCatalog } from "./frameworks.ts";
import { auditIsoControls } from "./iso-audit.ts";
import { matchesSyntax } from "./semantic.ts";
import { runRule } from "./run-rule.ts";

const facts: Record<string, Record<string, unknown>> = {
  "cso-risk-ownership": { "risk-owner": "pessoa-1", "risk-register": "risco-wcag" },
  "cso-control-evidence": { "control-evidence": "access-control-validator", "approval-log": "sem-aprovacao" },
  "cobit-governance": { "governance-policy": "politica-cobit", "approver-role": "approver" },
  "iso31000-risk-treatment": { "risk-treatment-plan": "plano-interno", "risk-owner": "owner" },
  "nist-csf-identify": { "asset-register": "braden", "risk-log": "risco-auth" },
  "itil-change-approval": { "change-request": "mudanca-capa-braden", "approval-record": "nao-aprovado" },
  "iso27001-access-control": { "internal-policy": "politica-27001", role: "admin" },
};

const gate: ExecutionGate = {
  id: "gate-continua",
  workOrderId: "WO-CONTINUA",
  sourceId: "source",
  toolId: "tool",
  templateId: "template",
  policyBundleId: "bundle",
  status: "approved",
  approvedBy: "reviewer",
  hash: "a".repeat(64),
};

export type ContinuousAudit = {
  isoControls: number;
  catalogControls: number;
  catalogRefused: number;
  semanticFailClosed: boolean;
  gateUnsigned: boolean;
  drift: string[];
  stable: boolean;
  adherentToInternalControl: boolean;
};

export type ContinuousPrevious = {
  isoControls?: number;
  catalogControls?: number;
};

/** Roda de novo os mesmos controles. */
export function auditConformidadeContinua(previous?: ContinuousPrevious, env: NodeJS.ProcessEnv = {}): ContinuousAudit {
  const iso = auditIsoControls(env);
  let catalogControls = 0;
  let catalogRefused = 0;
  for (const [id, evidence] of Object.entries(facts)) {
    const rule = normativeCatalog[id];
    if (runRule(rule, evidence, env).ok) catalogControls += 1;
    if (runRule(rule, { ...evidence, note: "documento certificado" }, env).ok === false) catalogRefused += 1;
  }
  const semanticFailClosed = matchesSyntax("frase que não está no dicionário", "qualquer").ok === false;
  const failed = evaluateCompliance(
    {
      id: "continua",
      name: "continua",
      version: "1",
      normativeIds: ["cso-risk-ownership"],
      owner: "owner",
      status: "active",
      createdAt: "2026-11-14T00:00:00Z",
      updatedAt: "2026-11-14T00:00:00Z",
      hash: "b".repeat(64),
    },
    { "risk-owner": "owner", "risk-register": "register" },
    env,
  );
  const decision = decide(gate, [], [], failed);
  const gateUnsigned = decision.outcome === "rejected" && decision.signature === "";
  const drift: string[] = [];
  if (previous?.isoControls !== undefined && previous.isoControls !== iso.controlsPassing) drift.push("iso-mudou");
  if (previous?.catalogControls !== undefined && previous.catalogControls !== catalogControls) drift.push("catalogo-mudou");
  const adherentToInternalControl = iso.adherentToInternalControl && catalogControls === 7 && catalogRefused === 7 && semanticFailClosed && gateUnsigned;
  return {
    isoControls: iso.controlsPassing,
    catalogControls,
    catalogRefused,
    semanticFailClosed,
    gateUnsigned,
    drift,
    stable: drift.length === 0 && adherentToInternalControl,
    adherentToInternalControl,
  };
}
