import { readFileSync } from "node:fs";
import { adoptedRoundingAdherent } from "../../core/compliance/norm-text.ts";
import { getTool } from "./catalog.ts";
import { evaluateFormula, evaluateScale } from "./engine.ts";
import { roundDecimalText, acceptRoundingAttribute } from "./numeric-rule.ts";

export type Phase1Check = { id: string; reference: string; ok: boolean; detail: string };

const nbrExamples: [string, number, string][] = [
  ["1.3333", 1, "1.3"],
  ["1.6666", 1, "1.7"],
  ["4.8505", 1, "4.9"],
  ["4.5500", 1, "4.6"],
  ["4.8500", 1, "4.8"],
  ["0.342", 2, "0.34"],
  ["0.346", 2, "0.35"],
  ["0.3452", 2, "0.35"],
  ["0.3450", 2, "0.34"],
];

/** Compara o motor com o documento interno e com o comportamento público das normas externas. Não deposita o texto licenciado. */
export function auditPhase1(): {
  checks: Phase1Check[];
  internalText: boolean;
  nbrExamples: boolean;
  deliver: boolean;
} {
  const document = readFileSync(new URL("../../../docs/documento-interno-arredondamento.md", import.meta.url), "utf8");
  const imc = getTool("imc");
  const drip = getTool("gotejamento");
  const exam = getTool("exames-laboratoriais");
  const imcResult = imc ? evaluateFormula(imc, { peso: "70", altura: "170" }) : { ok: false as const, message: "sem ferramenta" };
  const dripResult = drip ? evaluateFormula(drip, { volume: "500", horas: "2", minutos: "0", fator: "20" }) : { ok: false as const, message: "sem ferramenta" };
  const half = drip ? evaluateFormula(drip, { volume: "3", horas: "2", minutos: "0", fator: "20" }) : { ok: false as const, message: "sem ferramenta" };
  const lab = exam ? evaluateFormula(exam, { exame: "0", valor: "4,2", sexo: "0" }) : { ok: false as const, message: "sem ferramenta" };
  const broken = imc ? structuredClone(imc) : undefined;
  if (broken) broken.outputs = [...(broken.outputs ?? []), { id: "inexistente", label: "Extra", unit: "x", digits: 0 }];
  const missing = broken ? evaluateFormula(broken, { peso: "70", altura: "170" }) : { ok: true as const };
  const gotasStep = dripResult.ok ? dripResult.steps?.find((step) => step.startsWith("Gotas/min")) ?? "" : "";
  const braden = getTool("braden");
  const scaleAnswers = Object.fromEntries((braden?.criteria ?? []).map((item) => [item.id, item.choices[0]?.value ?? 0]));
  const scale = braden ? evaluateScale(braden, scaleAnswers) : { ok: false as const };
  const nbrPass = nbrExamples.every(([text, digits, expected]) => roundDecimalText(text, digits) === expected);
  const checks: Phase1Check[] = [
    { id: "documento", reference: "documento interno", ok: document.includes("STD-ABNT-NBR5891") && document.includes("STD-IEEE-754") && document.includes("Não reproduz cláusula"), detail: "Metadados citados e cláusula licenciada não copiada." },
    { id: "procedimento", reference: "documento interno", ok: adoptedRoundingAdherent(), detail: "Hash e casos 1,25, 1,35, 1,251 e 0,5." },
    { id: "par", reference: "documento interno", ok: roundDecimalText("1.25", 1) === "1.2" && roundDecimalText("1.35", 1) === "1.4", detail: "5 seguido de zero fica no par." },
    { id: "imc", reference: "documento interno", ok: imcResult.ok === true && imcResult.ok && imcResult.outputs?.[0]?.value === 24.2 && imcResult.band?.label === "Adequado", detail: "70 kg e 170 cm." },
    { id: "gotas", reference: "documento interno", ok: dripResult.ok === true && dripResult.ok && dripResult.outputs?.find((item) => item.id === "gotas")?.value === 83, detail: "500 mL, 2 h, equipo 20." },
    { id: "meio", reference: "documento interno", ok: half.ok === true && half.ok && half.outputs?.find((item) => item.id === "gotas")?.value === 0, detail: "0,5 gota reduzida para 0." },
    { id: "memoria", reference: "documento interno", ok: !gotasStep.includes("= 83") && gotasStep.includes("Resultado admitido"), detail: "A conta não é escrita como igual ao número já reduzido." },
    { id: "exame", reference: "documento interno", ok: lab.ok === true && lab.ok && lab.outputs?.[0]?.value === 4.2 && lab.rounding === undefined && (lab.steps?.[0] ?? "").includes("não foi reduzido"), detail: "Valor digitado não é reduzido e a memória diz isso." },
    { id: "escala", reference: "documento interno", ok: scale.ok === true && scale.ok && scale.rounding === "roundTiesToEven" && scale.reduced === false, detail: "Escore inteiro usa o mesmo atributo e não é marcado como reduzido." },
    { id: "ausente", reference: "documento interno", ok: missing.ok === false, detail: "Resultado não devolvido não vira zero." },
    { id: "nbr-exemplos", reference: "ABNT NBR 5891:2014, exemplos públicos", ok: nbrPass, detail: "Nove exemplos decimais associados à norma. O texto da norma não foi depositado." },
    { id: "atributo", reference: "documento interno", ok: acceptRoundingAttribute("roundTiesToEven").ok === true && acceptRoundingAttribute("roundTiesToAway").ok === false, detail: "Só o empate no par executa. Os outros atributos são recusados." },
    { id: "ieee-fora", reference: "documento interno", ok: document.includes("A IEEE 754 não é critério desta fase."), detail: "Formato e exceção da IEEE não entram nesta fase." },
  ];
  const internalText = checks.filter((check) => check.reference === "documento interno").every((check) => check.ok);
  const deliver = internalText && nbrPass;
  return { checks, internalText, nbrExamples: nbrPass, deliver };
}
