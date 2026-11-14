/**
 * Inventory imported only from the user's historical 2026-11-01 audit ZIP.
 * Not a normative source, tool definition, source of clinical truth or approval.
 * Labor calculators and editorial-only pages are intentionally excluded.
 */
import { tools, candidateTools } from "./tools/catalog.ts";

const historicalClinicalCandidateSlugs = [
  "aldrete",
  "exames-laboratoriais",
  "aspiracao-insulina",
  "balanco-hidrico",
  "dimensionamento-cofen",
  "gasometria-arterial",
  "idade-gestacional",
  "medicamentos",
  "tabela-vacinas",
  "aldrete-kroulik",
  "apache-ii",
  "asa",
  "ballard",
  "barthel",
  "bps",
  "berg",
  "bishop",
  "cam-icu",
  "capurro",
  "cincinnati",
  "wifi-svs",
  "copsoq-ii",
  "copsoq-iii",
  "cornell",
  "cries",
  "curb-65",
  "downton",
  "elpo",
  "fast",
  "flacc",
  "four",
  "fugulin",
  "gds",
  "glasgow",
  "gosnell",
  "hamilton",
  "hendrich-ii",
  "humpty-dumpty",
  "johns",
  "jouvet",
  "katz",
  "lachs",
  "lanss",
  "lawton",
  "manchester",
  "meem",
  "meows",
  "moca",
  "news",
  "nihss",
  "nips",
  "norton",
  "dor-numerica",
  "ofras",
  "painad",
  "pelod",
  "pews",
  "perroca",
  "prism",
  "qsofa",
  "ramsay",
  "rancho-los-amigos",
  "richmond",
  "saps-iii",
  "silverman-anderson",
  "sinbad",
  "sofa",
  "tinetti",
  "waterlow",
  "wood-downes",
  "zarit",
] as const;

export type ToolBacklogEntry = {
  slug: string;
  canonicalId: string;
  state: "CANDIDATE_RUNTIME" | "MISSING_RUNTIME";
  clinicalRelease: "NO_GO";
  source: "historical-audit-2026-11-01";
  workOrder: "PENDING_FIND_POLICY_VALIDATOR_WO";
};

export function clinicalToolBacklog(): ToolBacklogEntry[] {
  const live = new Set(tools.map((tool) => tool.slug));
  const candidates = new Set(candidateTools.map((tool) => tool.slug));
  return historicalClinicalCandidateSlugs.map((slug) => ({
    slug,
    canonicalId: `ce:tool-candidate:${slug}`,
    state: candidates.has(slug) || live.has(slug) ? "CANDIDATE_RUNTIME" as const : "MISSING_RUNTIME" as const,
    clinicalRelease: "NO_GO" as const,
    source: "historical-audit-2026-11-01" as const,
    workOrder: "PENDING_FIND_POLICY_VALIDATOR_WO" as const,
  }));
}
