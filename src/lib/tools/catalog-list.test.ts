import assert from "node:assert/strict";
import test from "node:test";
import { candidateTools, getTool, tools } from "./catalog.ts";
import { catalogListIssues } from "./catalog-list.ts";

test("objetos dentro das listas do catálogo passam", () => {
  for (const tool of [...tools, ...candidateTools]) {
    assert.deepEqual(catalogListIssues(tool), [], tool.slug);
    assert.ok(getTool(tool.slug));
  }
});

test("objeto inválido dentro do array não entra", () => {
  const braden = getTool("braden");
  assert.ok(braden);
  const broken = structuredClone(braden);
  broken.criteria![0].choices[1].value = "2" as unknown as number;
  const issues = catalogListIssues(broken);
  assert.equal(issues[0]?.path, "criteria.0.choices.1.value");
  assert.equal(issues[0]?.message, "O campo precisa ser número.");
  const first = broken.criteria![0];
  broken.criteria![0].choices[1] = "texto" as unknown as (typeof first)["choices"][number];
  assert.equal(catalogListIssues(broken)[0]?.message, "O campo precisa ser objeto.");
  broken.criteria![0].choices[1] = { value: 2, label: "Muito limitada" };
  broken.bands![0].nanda = [12 as unknown as string];
  const band = catalogListIssues(broken)[0];
  assert.equal(band?.path, "bands.0.nanda.0");
  assert.equal(band?.message, "O campo precisa ser texto.");
});

test("o tipo discrimina a lista obrigatória", () => {
  const braden = getTool("braden");
  const imc = getTool("imc");
  assert.ok(braden && imc);
  const semCriterio = structuredClone(braden);
  delete semCriterio.criteria;
  assert.equal(catalogListIssues(semCriterio)[0]?.path, "criteria");
  const semCampo = structuredClone(imc);
  delete semCampo.fields;
  assert.equal(catalogListIssues(semCampo)[0]?.path, "fields");
  const outroTipo = structuredClone(braden);
  outroTipo.kind = "protocolo" as "escala";
  assert.equal(catalogListIssues(outroTipo)[0]?.path, "kind");
});
