import { z } from "zod";
import { admitStep } from "../../core/runtime/admit.ts";
import { typeErrorMessage } from "./type-error.ts";
import type { ClinicalTool, NumericField, SelectField } from "./types.ts";

function numberField(field: NumericField) {
  return z.string({ error: "O campo precisa ser texto." }).transform((value, ctx) => {
    const text = value.trim().replace(",", ".");
    if (!/^-?\d+(?:\.\d+)?$/.test(text)) {
      ctx.addIssue({ code: "custom", message: "Informe um número." });
      return z.NEVER;
    }
    const parsed = Number(text);
    if (parsed < field.min || parsed > field.max) {
      ctx.addIssue({ code: "custom", message: `Use um valor entre ${field.min} e ${field.max}.` });
      return z.NEVER;
    }
    return parsed;
  });
}

function choiceField(field: SelectField) {
  const allowed = new Set(field.options.map((option) => String(option.value)));
  return z.string({ error: "O campo precisa ser texto." }).transform((value, ctx) => {
    const text = value.trim();
    if (!allowed.has(text)) {
      ctx.addIssue({ code: "custom", message: "Escolha uma opção." });
      return z.NEVER;
    }
    return Number(text);
  });
}

function issues(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export function parseFormulaInput(tool: ClinicalTool, raw: Record<string, string>) {
  const shape: Record<string, z.ZodType<number, string>> = {};
  for (const field of tool.fields ?? []) shape[field.id] = numberField(field);
  for (const field of tool.selects ?? []) shape[field.id] = choiceField(field);
  const parsed = z.object(shape).safeParse(raw);
  const result = parsed.success
    ? { ok: true as const, values: parsed.data }
    : { ok: false as const, fieldErrors: issues(parsed.error), message: "Revise os campos marcados antes de calcular." };
  const step = admitStep("schema", result, (value) => (value.ok ? { outcome: "admit" } : { outcome: "stop", reason: "schema:campo" }));
  if (step.outcome === "stop") return step.value;
  if (step.outcome === "reject") return { ok: false as const, message: "O motor recusou o resultado." };
  return step.value;
}

export function parseScaleAnswers(tool: ClinicalTool, answers: Record<string, number>) {
  const shape: Record<string, z.ZodType<number>> = {};
  for (const criterion of tool.criteria ?? []) {
    const allowed = new Set(criterion.choices.map((choice) => choice.value));
    shape[criterion.id] = z.number({ error: "Escolha uma opção." }).refine((value) => allowed.has(value), "Escolha uma opção.");
  }
  const parsed = z.object(shape).safeParse(answers);
  if (parsed.success) {
    const step = admitStep("schema", { ok: true as const, values: parsed.data }, () => ({ outcome: "admit" as const }));
    return step.outcome === "admit" ? step.value : { ok: false as const, missing: [] as string[], message: "O motor recusou o resultado." };
  }
  const missing = Object.keys(issues(parsed.error));
  const result = {
    ok: false as const,
    missing,
    message: `Faltam ${missing.length} critério${missing.length === 1 ? "" : "s"}. O escore só aparece com a escala completa.`,
  };
  const step = admitStep("schema", result, () => ({ outcome: "stop" as const, reason: "schema:criterio" }));
  return step.outcome === "stop" ? step.value : result;
}

function limitedText(max: number) {
  return z.string().trim().max(max, `Use até ${max} caracteres.`);
}

function patientSchema(tool: ClinicalTool) {
  const known = new Map((tool.metaFields ?? []).map((field) => [field.id, new Set(field.options.map((option) => option.value))]));
  return z.object({
    nome: limitedText(120),
    idade: z.string().trim().refine((value) => value === "" || (/^\d{1,3}$/.test(value) && Number(value) <= 130), "Informe a idade em anos ou deixe em branco."),
    setor: limitedText(80),
    data: z.string().trim().refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), "Use a data do calendário."),
    meta: z.record(z.string(), z.string()).superRefine((meta, ctx) => {
      for (const [key, value] of Object.entries(meta)) {
        const options = known.get(key);
        if (!options) ctx.addIssue({ code: "custom", path: [key], message: "Campo não faz parte desta ferramenta." });
        else if (value !== "" && !options.has(value)) ctx.addIssue({ code: "custom", path: [key], message: "Escolha uma opção." });
      }
    }),
  }).strict();
}

function nestedIssues(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  const missing: string[] = [];
  for (const issue of error.issues) {
    const path = issue.path.map(String);
    const key = path[0] === "raw" || path[0] === "answers" ? path[1] : path.join(".");
    if (key && !fieldErrors[key]) fieldErrors[key] = typeErrorMessage(issue);
    if (path[0] === "answers" && path[1]) missing.push(path[1]);
  }
  return { fieldErrors, missing };
}

export type ClinicalSubmission = {
  patient: { nome: string; idade: string; setor: string; data: string; meta: Record<string, string> };
  raw: Record<string, string>;
  answers: Record<string, number>;
};

export function clinicalSchema(tool: ClinicalTool) {
  const scaleAnswers = z.object(Object.fromEntries((tool.criteria ?? []).map((criterion) => {
    const allowed = new Set(criterion.choices.map((choice) => choice.value));
    return [criterion.id, z.number({ error: "Escolha uma opção." }).refine((value) => allowed.has(value), "Escolha uma opção.")];
  }))).strict();
  const formulaRaw = z.object({
    ...Object.fromEntries((tool.fields ?? []).map((field) => [field.id, numberField(field)])),
    ...Object.fromEntries((tool.selects ?? []).map((field) => [field.id, choiceField(field)])),
  }).strict();
  return z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("escala"), patient: patientSchema(tool), answers: scaleAnswers }),
    z.object({ kind: z.literal("calculadora"), patient: patientSchema(tool), raw: formulaRaw }),
  ]);
}

/** Paciente, campos e critérios entram juntos. Dado inválido para o cálculo. */
export function parseClinicalSubmission(tool: ClinicalTool, submission: ClinicalSubmission) {
  const parsed = clinicalSchema(tool).safeParse({ ...submission, kind: tool.kind });
  if (parsed.success) {
    const step = admitStep("schema", { ok: true as const }, () => ({ outcome: "admit" as const }));
    return step.outcome === "admit" ? { ok: true as const } : { ok: false as const, message: "O motor recusou o resultado." };
  }
  const { fieldErrors, missing } = nestedIssues(parsed.error);
  const instrumentFailed = missing.length > 0 || Object.keys(fieldErrors).some((key) => !key.startsWith("patient."));
  const result = instrumentFailed && tool.kind === "escala"
    ? { ok: false as const, missing, fieldErrors, message: `Faltam ${missing.length} critério${missing.length === 1 ? "" : "s"}. O escore só aparece com a escala completa.` }
    : { ok: false as const, fieldErrors, missing, message: instrumentFailed ? "Revise os campos marcados antes de calcular." : "Revise os dados do paciente antes de calcular." };
  const step = admitStep("schema", result, () => ({ outcome: "stop" as const, reason: "schema:conjunto" }));
  return step.outcome === "stop" ? step.value : { ok: false as const, message: "O motor recusou o resultado." };
}
