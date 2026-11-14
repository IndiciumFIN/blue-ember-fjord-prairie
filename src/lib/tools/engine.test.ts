import assert from "node:assert/strict";
import test from "node:test";
import { getTool } from "./catalog.ts";
import { evaluateFormula, evaluateScale, reductionNote } from "./engine.ts";
import { parseClinicalSubmission } from "./input-schema.ts";

test("escala incompleta não produz escore", () => {
  const tool = getTool("braden");
  assert.ok(tool);
  const result = evaluateScale(tool, { sensorial: 1 });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok((result.missing?.length ?? 0) > 0);
});

test("número fora do limite não calcula", () => {
  const tool = getTool("imc");
  assert.ok(tool);
  const result = evaluateFormula(tool, { peso: "900", altura: "170" });
  assert.equal(result.ok, false);
});

test("gotejamento de 500 mL em 2 horas no equipo 20", () => {
  const tool = getTool("gotejamento");
  assert.ok(tool);
  const result = evaluateFormula(tool, { volume: "500", horas: "2", minutos: "0", fator: "20" });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.outputs?.find((item) => item.id === "mlh")?.value, 250);
    assert.equal(result.outputs?.find((item) => item.id === "gotas")?.value, 83);
  }
});

test("IMC de 70 kg e 170 cm fica na faixa adequada", () => {
  const tool = getTool("imc");
  assert.ok(tool);
  const result = evaluateFormula(tool, { peso: "70", altura: "170" });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.outputs?.find((item) => item.id === "imc")?.value, 24.2);
    assert.equal(result.band?.label, "Adequado");
    assert.match(result.steps?.[0] ?? "", / = 1,7\.$/);
  }
});

test("vírgula entra e texto ou opção fora da lista não calcula", () => {
  const imc = getTool("imc");
  assert.ok(imc);
  const comma = evaluateFormula(imc, { peso: "70,5", altura: "170" });
  assert.equal(comma.ok, true);
  const text = evaluateFormula(imc, { peso: "abc", altura: "170" });
  assert.equal(text.ok, false);
  if (!text.ok) assert.equal(text.fieldErrors?.peso, "Informe um número.");
  const scale = getTool("braden");
  assert.ok(scale);
  const answers = Object.fromEntries((scale.criteria ?? []).map((item) => [item.id, item.choices[0]?.value ?? 0]));
  answers[scale.criteria?.[0]?.id ?? ""] = 999;
  const invalid = evaluateScale(scale, answers);
  assert.equal(invalid.ok, false);
});

test("paciente inválido impede o conjunto mesmo com número válido", () => {
  const imc = getTool("imc");
  assert.ok(imc);
  const stopped = parseClinicalSubmission(imc, {
    patient: { nome: "Ana", idade: "não", setor: "", data: "", meta: {} },
    raw: { peso: "70,5", altura: "170" },
    answers: {},
  });
  assert.equal(stopped.ok, false);
  if (!stopped.ok) assert.equal(stopped.fieldErrors?.["patient.idade"], "Informe a idade em anos ou deixe em branco.");
  const nestedType = parseClinicalSubmission(imc, {
    patient: { nome: "Ana", idade: "", setor: "", data: "", meta: { leito: 2 as unknown as string } },
    raw: { peso: "70,5", altura: "170" },
    answers: {},
  });
  assert.equal(nestedType.ok, false);
  if (!nestedType.ok) assert.equal(nestedType.fieldErrors?.["patient.meta.leito"], "O campo precisa ser texto.");
  const admitted = parseClinicalSubmission(imc, {
    patient: { nome: "Ana", idade: "", setor: "Leito 2", data: "2026-11-13", meta: {} },
    raw: { peso: "70,5", altura: "170" },
    answers: {},
  });
  assert.equal(admitted.ok, true);
});

test("tipo errado não é convertido", () => {
  const imc = getTool("imc");
  assert.ok(imc);
  const numeric = evaluateFormula(imc, { peso: 70 as unknown as string, altura: "170" });
  assert.equal(numeric.ok, false);
  if (!numeric.ok) assert.equal(numeric.fieldErrors?.peso, "O campo precisa ser texto.");
  const scale = getTool("braden");
  assert.ok(scale);
  const answers = Object.fromEntries((scale.criteria ?? []).map((item) => [item.id, item.choices[0]?.value ?? 0]));
  answers[scale.criteria?.[0]?.id ?? ""] = "1" as unknown as number;
  const textAnswer = evaluateScale(scale, answers);
  assert.equal(textAnswer.ok, false);
});

test("todo resultado calculado passa pela mesma regra e o valor de exame não é arredondado", () => {
  const drip = getTool("gotejamento");
  assert.ok(drip);
  const half = evaluateFormula(drip, { volume: "3", horas: "2", minutos: "0", fator: "20" });
  assert.equal(half.ok, true);
  if (half.ok) assert.equal(half.outputs?.find((item) => item.id === "gotas")?.value, 0);
  const exam = getTool("exames-laboratoriais");
  assert.ok(exam);
  const result = evaluateFormula(exam, { exame: "0", valor: "4,2", sexo: "0" });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.outputs?.[0].value, 4.2);
    assert.equal(result.outputs?.[0].digits, 1);
    assert.equal(result.rounding, undefined);
    assert.ok((result.outputs?.[0].text ?? "").length > 0);
  }
});

test("escala usa o mesmo atributo e o exame repetido não é marcado como reduzido", () => {
  const scale = getTool("braden");
  assert.ok(scale);
  const answers = Object.fromEntries((scale.criteria ?? []).map((item) => [item.id, item.choices[0]?.value ?? 0]));
  const result = evaluateScale(scale, answers);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.rounding, "roundTiesToEven");
    assert.equal(result.reduced, false);
    assert.equal(reductionNote(result), "");
  }
  const drip = getTool("gotejamento");
  assert.ok(drip);
  const drops = evaluateFormula(drip, { volume: "500", horas: "2", minutos: "0", fator: "20" });
  assert.equal(drops.ok, true);
  if (drops.ok) {
    assert.equal(drops.reduced, true);
    assert.equal(reductionNote(drops), "Número reduzido.");
  }
});

test("a faixa usa o número já reduzido e a memória não inventa casa nem resultado", () => {
  const imc = getTool("imc");
  assert.ok(imc);
  const sobe = evaluateFormula(imc, { peso: "53.4", altura: "170" });
  assert.equal(sobe.ok, true);
  if (sobe.ok) {
    assert.equal(sobe.outputs?.find((item) => item.id === "imc")?.value, 18.5);
    assert.equal(sobe.band?.label, "Adequado");
  }
  const fica = evaluateFormula(imc, { peso: "53.3", altura: "170" });
  assert.equal(fica.ok, true);
  if (fica.ok) {
    assert.equal(fica.outputs?.find((item) => item.id === "imc")?.value, 18.4);
    assert.equal(fica.band?.label, "Baixo peso");
    assert.equal(fica.rows[0]?.value, "53,3 kg");
  }
  const inteiro = evaluateFormula(imc, { peso: "70", altura: "170" });
  assert.equal(inteiro.ok, true);
  if (inteiro.ok) {
    assert.equal(inteiro.rows[0]?.value, "70 kg");
    assert.equal(inteiro.rounding, "roundTiesToEven");
  }
  const quebrado = structuredClone(imc);
  quebrado.outputs = [...(quebrado.outputs ?? []), { id: "inexistente", label: "Extra", unit: "x", digits: 0 }];
  const faltou = evaluateFormula(quebrado, { peso: "70", altura: "170" });
  assert.equal(faltou.ok, false);
});
