import { createHash } from "node:crypto";
import { roundDecimalText } from "../../lib/tools/numeric-rule.ts";

export const adoptedRoundingText = [
  "Texto interno de arredondamento. Não reproduz cláusula da ABNT, da IEEE nem de nenhuma ISO.",
  "STD-ABNT-NBR5891. Nome público ABNT NBR 5891:2014. Domínio Arredondamento. Direito Uso interno. Prioridade P0.",
  "STD-IEEE-754. Nome público IEEE 754-2019. Domínio Aritmética de máquina. Direito Só metadado. Prioridade P1.",
  "Um número só entra se for finito.",
  "A redução de casas usa o texto decimal do conversor interno.",
  "Se o primeiro dígito descartado é menor que 5, o último dígito conservado fica.",
  "Se é maior que 5, o último dígito conservado sobe.",
  "Se é 5 e só há zeros depois, o último dígito conservado fica par.",
  "Se é 5 e há outro dígito diferente de zero depois, o último dígito conservado sobe.",
  "Valor de exame digitado não passa por este procedimento.",
].join("\n");

export const adoptedRoundingHash = "ab44ae932fb99c7a4320f84d9128d7530130a85e454585a9413c09f17afb1a1d";

export function textHash(text: string) {
  return createHash("sha256").update(text).digest("hex");
}

export function adoptedRoundingAdherent() {
  if (textHash(adoptedRoundingText) !== adoptedRoundingHash) return false;
  const clauses = ["menor que 5", "maior que 5", "só há zeros", "fica par", "diferente de zero"];
  if (!clauses.every((clause) => adoptedRoundingText.includes(clause))) return false;
  return roundDecimalText("1.25", 1) === "1.2"
    && roundDecimalText("1.35", 1) === "1.4"
    && roundDecimalText("1.251", 1) === "1.3"
    && roundDecimalText("0.5", 0) === "0";
}
