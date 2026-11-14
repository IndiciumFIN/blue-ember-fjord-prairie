import assert from "node:assert/strict";
import test from "node:test";
import { internalEvidence, isoFichas } from "./iso-fichas.ts";
import { normativeCatalog } from "./frameworks.ts";
import { runRule } from "./run-rule.ts";
import { hiddenConformityClaim, matchesSyntax } from "./semantic.ts";

test("a sintaxe gravada distingue valor de texto parecido", () => {
  assert.equal(matchesSyntax("letras minúsculas, números e hífen, até 80", "braden").ok, true);
  assert.equal(matchesSyntax("letras minúsculas, números e hífen, até 80", "Braden").reason, "syntax:slug");
  assert.equal(matchesSyntax("letras minúsculas, números e hífen, até 80", "braden_q").ok, false);
  assert.equal(matchesSyntax("texto de 3 a 80 caracteres", "AB").reason, "syntax:length");
  assert.equal(matchesSyntax("texto de 3 a 80 caracteres", "IMC").ok, true);
  assert.equal(matchesSyntax("escala ou calculadora", "escala").ok, true);
  assert.equal(matchesSyntax("escala ou calculadora", "protocolo").reason, "syntax:enum");
  assert.equal(matchesSyntax("booleano", false).ok, true);
  assert.equal(matchesSyntax("booleano", "false").reason, "syntax:boolean");
  assert.equal(matchesSyntax("numérico", 0).ok, true);
  assert.equal(matchesSyntax("numérico", "0").reason, "syntax:number");
  assert.equal(matchesSyntax("rascunho ou aprovado", "publicado").reason, "syntax:enum");
  assert.equal(matchesSyntax("frase que não está no dicionário", "qualquer").reason, "syntax:unknown");
});

test("texto livre não anula a recusa de conformidade", () => {
  const ficha = isoFichas.find((item) => item.id === "STD-ISO-9001");
  assert.ok(ficha);
  const evidence = { ...internalEvidence(ficha), note: "documento certificado" };
  assert.equal(hiddenConformityClaim(evidence), true);
  assert.equal(runRule(normativeCatalog[ficha.id], evidence, {}).reason, "ficha:semantic-claim");
  assert.equal(runRule(normativeCatalog[ficha.id], internalEvidence(ficha), {}).ok, true);
});
