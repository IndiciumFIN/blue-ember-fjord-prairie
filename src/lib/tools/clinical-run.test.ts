import assert from "node:assert/strict";
import test from "node:test";
import { zodResolver } from "@hookform/resolvers/zod";
import { getTool } from "./catalog.ts";
import { clinicalSyntax, runClinical } from "./clinical-run.ts";
import { clinicalSchema } from "./input-schema.ts";

const patient = { nome: "Ana", idade: "", setor: "Leito 2", data: "2026-11-13", meta: {} };

test("o portão único calcula só depois do catálogo e do schema", () => {
  const imc = getTool("imc");
  assert.ok(imc);
  const stopped = runClinical(imc, { patient: { ...patient, idade: "não" }, raw: { peso: "70", altura: "170" }, answers: {} });
  assert.equal(stopped.ok, false);
  const result = runClinical(imc, { patient, raw: { peso: "70", altura: "170" }, answers: {} });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.outputs?.find((item) => item.id === "imc")?.value, 24.2);
  const scale = getTool("braden");
  assert.ok(scale);
  const incomplete = runClinical(scale, { patient, raw: {}, answers: {} });
  assert.equal(incomplete.ok, false);
  const outside = runClinical({ ...imc, kind: "laudo" as "calculadora" }, { patient, raw: { peso: "70", altura: "170" }, answers: {} });
  assert.equal(outside.ok, false);
  if (!outside.ok) assert.equal(outside.message, "Esta ferramenta não passou no catálogo.");
  const syntax = clinicalSyntax(imc, { patient, raw: { peso: "abc", altura: "170" }, answers: {} });
  assert.equal(syntax?.ok, false);
  if (syntax && !syntax.ok) assert.equal(syntax.fieldErrors?.peso, "Informe um número.");
});

test("o resolver do formulário usa o mesmo schema do portão", async () => {
  const imc = getTool("imc");
  assert.ok(imc);
  const resolver = zodResolver(clinicalSchema(imc));
  const valid = await resolver({ kind: "calculadora", patient, raw: { peso: "70", altura: "170" } }, {}, {} as never);
  assert.deepEqual(valid.errors, {});
  const invalid = await resolver({ kind: "calculadora", patient, raw: { peso: "abc", altura: "170" } }, {}, {} as never);
  assert.ok(invalid.errors.raw);
});
