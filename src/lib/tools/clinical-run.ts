import { matchesSyntax } from "../../core/compliance/semantic.ts";
import { acceptedCatalogTool } from "./catalog-list.ts";
import { evaluateFormula, evaluateScale, type ToolFailure, type ToolSuccess } from "./engine.ts";
import { parseClinicalSubmission, type ClinicalSubmission } from "./input-schema.ts";
import type { ClinicalTool } from "./types.ts";

/** Sintaxe gravada, separada do schema de envio. */
export function clinicalSyntax(tool: ClinicalTool, submission: ClinicalSubmission): ToolFailure | null {
  if (!matchesSyntax("escala ou calculadora", tool.kind).ok) {
    return { ok: false, message: "O tipo da ferramenta não é escala nem calculadora." };
  }
  if (tool.kind === "escala") {
    for (const [id, value] of Object.entries(submission.answers)) {
      if (!matchesSyntax("numérico", value).ok) {
        return { ok: false, message: "A resposta precisa ser um número.", fieldErrors: { [id]: "A resposta precisa ser um número." }, missing: [id] };
      }
    }
    return null;
  }
  for (const field of tool.fields ?? []) {
    const text = (submission.raw[field.id] ?? "").trim().replace(",", ".");
    const value = text === "" || Number.isNaN(Number(text)) ? text : Number(text);
    if (!matchesSyntax("numérico", value).ok) {
      return { ok: false, message: "Revise os campos marcados antes de calcular.", fieldErrors: { [field.id]: "Informe um número." } };
    }
  }
  return null;
}

/** Catálogo, envio, sintaxe e motor. Qualquer falha para antes do cálculo. */
export function runClinical(tool: ClinicalTool, submission: ClinicalSubmission): ToolSuccess | ToolFailure {
  if (!acceptedCatalogTool(tool)) return { ok: false, message: "Esta ferramenta não passou no catálogo." };
  const parsed = parseClinicalSubmission(tool, submission);
  if (!parsed.ok) return parsed;
  const syntax = clinicalSyntax(tool, submission);
  if (syntax) return syntax;
  return tool.kind === "escala" ? evaluateScale(tool, submission.answers) : evaluateFormula(tool, submission.raw);
}
