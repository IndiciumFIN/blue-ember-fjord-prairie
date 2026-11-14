import { admitStep } from "../../core/runtime/admit.ts";
import type { ToolFailure, ToolSuccess } from "./engine.ts";

export type EngineVerdict = { outcome: "admit" } | { outcome: "stop"; reason: string } | { outcome: "reject"; reason: string };

function finite(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

/** Sucesso só é admissão. Falta de dado é parada. Forma inválida é recusa. */
export function validateEngineResult(result: ToolSuccess | ToolFailure): EngineVerdict {
  if (!result.ok) {
    return result.message.trim() ? { outcome: "stop", reason: "engine:parada" } : { outcome: "reject", reason: "engine:parada-sem-motivo" };
  }
  if (result.rounding !== undefined && result.rounding !== "roundTiesToEven") return { outcome: "reject", reason: "engine:atributo" };
  if (result.reduced === true && result.rounding !== "roundTiesToEven") return { outcome: "reject", reason: "engine:reducao" };
  if (!finite(result.total)) return { outcome: "reject", reason: "engine:total" };
  if (result.max !== undefined && !finite(result.max)) return { outcome: "reject", reason: "engine:max" };
  if (!Array.isArray(result.rows) || result.rows.some((row) => row.label.trim() === "" || row.value.trim() === "")) {
    return { outcome: "reject", reason: "engine:memoria" };
  }
  for (const output of result.outputs ?? []) {
    if (!finite(output.value)) return { outcome: "reject", reason: "engine:valor" };
    if (output.unit.trim() === "" && !(output.text && output.text.trim())) return { outcome: "reject", reason: "engine:unidade" };
    if (!Number.isInteger(output.digits) || output.digits < 0 || output.digits > 12) return { outcome: "reject", reason: "engine:casas" };
  }
  return { outcome: "admit" };
}

export function admitEngineResult(result: ToolSuccess | ToolFailure): ToolSuccess | ToolFailure {
  const step = admitStep("engine", result, (value) => validateEngineResult(value));
  if (step.outcome === "stop") return step.value;
  if (step.outcome === "reject") return { ok: false, message: "O motor recusou o resultado." };
  return step.value;
}

export function renderAdmittedResult(result: ToolSuccess | ToolFailure): ToolSuccess | null {
  const step = admitStep("renderer", result, (value) => validateEngineResult(value));
  if (step.outcome !== "admit" || !step.value.ok) return null;
  return step.value;
}