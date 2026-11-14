import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { adoptedRoundingAdherent } from "./norm-text.ts";

test("o documento interno fecha e não exige texto licenciado", async () => {
  assert.equal(adoptedRoundingAdherent(), true);
  const document = await readFile(new URL("../../../docs/documento-interno-arredondamento.md", import.meta.url), "utf8");
  assert.match(document, /STD-ABNT-NBR5891/);
  assert.match(document, /STD-IEEE-754/);
  assert.match(document, /Não há depósito nem indicador de texto licenciado/);
  assert.equal(document.includes("adherentToNormText"), false);
});
