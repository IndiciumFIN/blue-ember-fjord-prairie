import { normativeCatalog } from "./frameworks.ts";
import { internalEvidence, isoAgents, isoFichas, type IsoFicha } from "./iso-fichas.ts";
import { runRule } from "./run-rule.ts";

export type IsoAuditRow = {
  id: string;
  agent: IsoFicha["agent"];
  wired: boolean;
  rejectsConformityClaim: boolean;
  acceptsInternalFact: boolean;
};

export type IsoAudit = {
  fichas: number;
  controlsPassing: number;
  adherentToInternalControl: boolean;
  rows: IsoAuditRow[];
};

/** Mede o controle interno. O texto licenciado não faz parte deste controle. */
export function auditIsoControls(env: NodeJS.ProcessEnv = {}): IsoAudit {
  const rows = isoFichas.map((ficha) => {
    const rule = normativeCatalog[ficha.id];
    const wired = rule?.validator === "iso-ficha-validator" && isoAgents.includes(ficha.agent);
    const claim = { ...internalEvidence(ficha), claimsConformity: true };
    const rejectsConformityClaim = wired && runRule(rule, claim, env).ok === false;
    const acceptsInternalFact = wired && runRule(rule, internalEvidence(ficha), env).ok === true;
    return {
      id: ficha.id,
      agent: ficha.agent,
      wired,
      rejectsConformityClaim,
      acceptsInternalFact,
    };
  });
  const controlsPassing = rows.filter((row) => row.wired && row.rejectsConformityClaim && row.acceptsInternalFact).length;
  return {
    fichas: rows.length,
    controlsPassing,
    adherentToInternalControl: controlsPassing === rows.length && rows.length === 34,
    rows,
  };
}
