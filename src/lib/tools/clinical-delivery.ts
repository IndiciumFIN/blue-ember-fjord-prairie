import { getTool } from "./catalog.ts";
import { runClinical } from "./clinical-run.ts";
import { auditPhase1 } from "./phase1-audit.ts";

const patient = { nome: "Ana", idade: "", setor: "Leito 2", data: "2026-11-13", meta: {} };

/** Auditoria das fases do cálculo antes de seguir. Não declara a IEEE. */
export function auditClinicalPhases() {
  const phase1 = auditPhase1();
  const imc = getTool("imc");
  const gate = imc ? runClinical(imc, { patient, raw: { peso: "70", altura: "170" }, answers: {} }) : { ok: false as const };
  const refused = imc ? runClinical(imc, { patient, raw: { peso: "abc", altura: "170" }, answers: {} }) : { ok: true as const };
  return {
    phase1Deliver: phase1.deliver,
    gateAdmits: gate.ok === true,
    gateStopsText: refused.ok === false,
    deliver: phase1.deliver && gate.ok === true && refused.ok === false,
  };
}
