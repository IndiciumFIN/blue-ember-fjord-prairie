/**
 * Canonical presentation-family registry (v1). Structural only:
 * no clinical content, no second design system, no publication authority.
 * Runtime surfaces consume the existing ArticlePage and theme tokens.
 */
export const canonicalContentFamilies = [
  { id: "checklist", name: "Checklist", kind: "editorial", blocks: ["Identificação da versão", "Itens verificáveis", "Evidências e responsável", "Resultado e pendências"] },
  { id: "mapa-mental", name: "Mapa mental", kind: "editorial", blocks: ["Conceito central", "Ramos semânticos", "Relações e referências", "Revisão editorial"] },
  { id: "podcast", name: "Podcast", kind: "editorial", blocks: ["Ficha do episódio", "Arquivo e direitos", "Transcrição acessível", "Referências verificadas"] },
  { id: "video", name: "Vídeo", kind: "editorial", blocks: ["Ficha do vídeo", "Fonte e direitos", "Legendas e transcrição", "Descrição acessível"] },
  { id: "curso", name: "Curso", kind: "editorial", blocks: ["Objetivos", "Unidades", "Atividades de aprendizagem", "Avaliação e evidências"] },
  { id: "protocolo", name: "Protocolo", kind: "editorial", blocks: ["Escopo e população", "Fonte normativa", "Etapas versionadas", "Revisão e aprovação"] },
] as const;

export type CanonicalContentFamily = (typeof canonicalContentFamilies)[number];
export type CanonicalContentFamilyId = CanonicalContentFamily["id"];

export function canonicalFamilyById(id: string): CanonicalContentFamily | undefined {
  return canonicalContentFamilies.find((item) => item.id === id);
}

export type FamilyCandidateEvidence = {
  familyId: string;
  canonicalId: string;
  sourceRefs: readonly string[];
  rightsVerified: boolean;
  humanReviewed: boolean;
  kernelAdmitted: boolean;
  releaseGatesPassed: boolean;
};

/** Evidence completeness ONLY, never a publication decision. */
export function auditFamilyCandidate(evidence: FamilyCandidateEvidence): {
  status: "HOLD" | "CANDIDATE_EVIDENCE_COMPLETE";
  holds: string[];
  clinicalPublicationAuthorized: false;
} {
  const holds: string[] = [];
  if (!canonicalFamilyById(evidence.familyId)) holds.push("HOLD_FAMILY_UNKNOWN");
  if (!/^[-a-z0-9_:.]{3,120}$/.test(evidence.canonicalId)) holds.push("HOLD_CANONICAL_ID");
  if (evidence.sourceRefs.length === 0 || evidence.sourceRefs.some((ref) => ref.trim().length === 0)) holds.push("HOLD_SOURCE");
  if (!evidence.rightsVerified) holds.push("HOLD_RIGHTS");
  if (!evidence.humanReviewed) holds.push("HOLD_HUMAN");
  if (!evidence.kernelAdmitted) holds.push("HOLD_KERNEL");
  if (!evidence.releaseGatesPassed) holds.push("HOLD_RELEASE");
  return {
    status: holds.length === 0 ? "CANDIDATE_EVIDENCE_COMPLETE" : "HOLD",
    holds,
    clinicalPublicationAuthorized: false,
  };
}
