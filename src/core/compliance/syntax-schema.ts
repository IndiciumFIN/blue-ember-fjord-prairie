import { z } from "zod";

/** Um schema por frase gravada. Tipo errado não é convertido. Frase fora da lista não tem schema. */
export function syntaxSchema(syntax: string) {
  if (syntax === "booleano") return z.boolean();
  if (syntax === "numérico") return z.number().finite();
  if (syntax === "texto") return z.string().trim().min(1);
  if (syntax === "escala ou calculadora") return z.enum(["escala", "calculadora"]);
  if (syntax === "rascunho ou aprovado") return z.enum(["rascunho", "aprovado"]);
  const range = syntax.match(/^texto de (\d+) a (\d+) caracteres$/);
  if (range) return z.string().trim().min(Number(range[1])).max(Number(range[2]));
  if (syntax === "letras minúsculas, números e hífen, até 80") {
    return z.string().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
  return null;
}

export function syntaxReason(syntax: string, value: unknown) {
  const schema = syntaxSchema(syntax);
  if (!schema) return "syntax:unknown";
  if (schema.safeParse(value).success) return "";
  if (syntax === "booleano") return "syntax:boolean";
  if (syntax === "numérico") return "syntax:number";
  if (syntax === "texto" || syntax.startsWith("texto de ")) return typeof value === "string" ? "syntax:length" : "syntax:text";
  if (syntax === "escala ou calculadora" || syntax === "rascunho ou aprovado") return "syntax:enum";
  return "syntax:slug";
}
