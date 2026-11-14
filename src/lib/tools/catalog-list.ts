import { z } from "zod";
import { typeErrorMessage } from "./type-error.ts";
import type { ClinicalTool } from "./types.ts";

const text = z.string().trim().min(1);
const choice = z.object({ value: z.number().finite(), label: text }).strict();
const stringChoice = z.object({ value: text, label: text }).strict();

const criterion = z.object({
  id: text,
  label: text,
  help: z.string(),
  choices: z.array(choice).min(2),
}).strict();
const numericField = z.object({
  id: text,
  label: text,
  unit: z.string(),
  min: z.number().finite(),
  max: z.number().finite(),
  step: z.number().finite().positive(),
}).strict();
const shared = {
  slug: text,
  category: text,
  title: text,
  lead: text,
  nandaMode: z.enum(["sugerir", "nao-fechar"]),
  selects: z.array(z.object({ id: text, label: text, options: z.array(choice).min(1) }).strict()).optional(),
  metaFields: z.array(z.object({ id: text, label: text, options: z.array(stringChoice).min(1) }).strict()).optional(),
  outputs: z.array(z.object({
    id: text,
    label: text,
    unit: z.string(),
    digits: z.number().int().min(0).max(12),
  }).strict()).optional(),
  bands: z.array(z.object({
    min: z.number().finite(),
    max: z.number().finite(),
    label: text,
    tone: z.enum(["ok", "info", "warn", "danger"]),
    note: text,
    nanda: z.array(text),
  }).strict()).optional(),
  howTo: z.array(text).min(1),
  faqs: z.array(z.object({ q: text, a: text }).strict()),
  references: z.array(text).min(1),
  related: z.array(text),
};

const catalogToolSchema = z.discriminatedUnion("kind", [
  z.object({ ...shared, kind: z.literal("escala"), criteria: z.array(criterion).min(1) }).passthrough(),
  z.object({ ...shared, kind: z.literal("calculadora"), fields: z.array(numericField).min(1) }).passthrough(),
]);

export function catalogListIssues(tool: unknown) {
  const parsed = catalogToolSchema.safeParse(tool);
  if (parsed.success) return [];
  return parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: typeErrorMessage(issue) }));
}

/** Objeto dentro da lista inválido: a ferramenta não entra. */
export function acceptedCatalogTool(tool: ClinicalTool): ClinicalTool | null {
  return catalogListIssues(tool).length === 0 ? tool : null;
}
