import assert from "node:assert/strict";
import test from "node:test";
import { admitEngineResult, validateEngineResult } from "./engine-guard.ts";
import type { ToolSuccess } from "./engine.ts";
import { acceptRoundingAttribute, formatNumber, numericFailure, roundDecimalText, roundFinite } from "./numeric-rule.ts";

test("a redução de casas segue a regra interna e não o arredondamento solto", () => {
  assert.equal(roundDecimalText("1.24", 1), "1.2");
  assert.equal(roundDecimalText("1.25", 1), "1.2");
  assert.equal(roundDecimalText("1.35", 1), "1.4");
  assert.equal(roundDecimalText("1.251", 1), "1.3");
  assert.equal(roundDecimalText("2.5", 0), "2");
  assert.equal(roundDecimalText("3.5", 0), "4");
  assert.equal(roundDecimalText("0.5", 0), "0");
  assert.equal(roundDecimalText("-1.25", 1), "-1.2");
  assert.equal(Math.round(0.5), 1);
  assert.equal(roundFinite(0.5, 0), 0);
  assert.equal(formatNumber(83.333, 0), "83");
  assert.throws(() => roundFinite(Number.NaN, 1), /ieee754:nao-finito/);
  assert.equal(acceptRoundingAttribute("roundTiesToEven").ok, true);
  assert.equal(acceptRoundingAttribute("roundTiesToAway").ok, false);
  assert.equal(numericFailure(undefined), "A fórmula não devolveu todos os resultados.");
  assert.equal(numericFailure(Number.NaN), "A conta não é um número.");
  assert.equal(numericFailure(Number.POSITIVE_INFINITY), "A conta não cabe num número finito.");
});

test("o validador recusa sucesso inválido e o motor não deixa esse sucesso passar", () => {
  const broken: ToolSuccess = {
    ok: true,
    totalLabel: "Resultado",
    total: Number.NaN,
    rows: [{ label: "Volume", value: "1 mL", max: "—" }],
    outputs: [{ id: "mlh", label: "Velocidade", unit: "", value: Number.POSITIVE_INFINITY, digits: 1 }],
  };
  assert.equal(validateEngineResult(broken).outcome, "reject");
  const admitted = admitEngineResult(broken);
  assert.equal(admitted.ok, false);
  const stopped = admitEngineResult({ ok: false, message: "Falta um campo." });
  assert.equal(stopped.ok, false);
  if (!stopped.ok) assert.equal(stopped.message, "Falta um campo.");
  const sound: ToolSuccess = {
    ok: true,
    totalLabel: "Resultado",
    total: 250,
    rows: [{ label: "Volume", value: "500 mL", max: "—" }],
    outputs: [{ id: "mlh", label: "Velocidade", unit: "mL/h", value: 250, digits: 1 }],
  };
  assert.equal(validateEngineResult(sound).outcome, "admit");
  assert.equal(admitEngineResult(sound).ok, true);
  const other = admitEngineResult({ ...sound, rounding: "roundTiesToAway" as "roundTiesToEven" });
  assert.equal(other.ok, false);
  const marked = admitEngineResult({ ...sound, reduced: true });
  assert.equal(marked.ok, false);
});
