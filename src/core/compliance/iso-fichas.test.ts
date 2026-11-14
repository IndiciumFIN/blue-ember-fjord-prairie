import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { auditIsoControls } from "./iso-audit.ts";
import { internalEvidence, isoFichas } from "./iso-fichas.ts";
import { normativeCatalog } from "./frameworks.ts";
import { runRule } from "./run-rule.ts";
import { evaluateCompliance } from "../kernel/kernel.ts";

test("cada ficha ISO tem controle interno e nenhuma declara o texto da norma", () => {
  assert.equal(isoFichas.length, 34);
  const audit = auditIsoControls();
  assert.equal(audit.fichas, 34);
  assert.equal(audit.controlsPassing, 34);
  assert.equal(audit.adherentToInternalControl, true);
  for (const ficha of isoFichas) {
    const rule = normativeCatalog[ficha.id];
    assert.equal(runRule(rule, internalEvidence(ficha), {}).ok, true);
    assert.equal(runRule(rule, { ...internalEvidence(ficha), claimsConformity: true }, {}).reason, "ficha:conformity");
    assert.equal(runRule(rule, { ...internalEvidence(ficha), fichaId: "outra" }, {}).ok, false);
  }
});

test("os controles específicos recusam o atalho", () => {
  const access = normativeCatalog["STD-ISO-27001"];
  assert.equal(runRule(access, { ...internalEvidence(isoFichas.find((item) => item.id === "STD-ISO-27001")!), role: "subscriber" }, {}).reason, "access-control:role");
  const duties = normativeCatalog["STD-ISO-27002"];
  assert.equal(runRule(duties, { ...internalEvidence(isoFichas.find((item) => item.id === "STD-ISO-27002")!), approver: "pessoa-1" }, {}).reason, "ficha:maker-checker");
  const risk = normativeCatalog["STD-ISO-31000"];
  assert.equal(runRule(risk, { ...internalEvidence(isoFichas.find((item) => item.id === "STD-ISO-31000")!), treatmentPlan: "" }, {}).outcome, "hold");
  const quality = normativeCatalog["STD-ISO-25010"];
  assert.equal(runRule(quality, { ...internalEvidence(isoFichas.find((item) => item.id === "STD-ISO-25010")!), measured: "completo" }, {}).reason, "ficha:measured");
  const ai = normativeCatalog["STD-ISO-42001"];
  assert.equal(runRule(ai, { ...internalEvidence(isoFichas.find((item) => item.id === "STD-ISO-42001")!), aiInventory: "completo" }, {}).reason, "ficha:ai-inventory");
  const qualitySystem = normativeCatalog["STD-ISO-9001"];
  assert.equal(runRule(qualitySystem, { ...internalEvidence(isoFichas.find((item) => item.id === "STD-ISO-9001")!), certificate: true }, {}).reason, "ficha:certificate");
});

test("o kernel executa a ficha e não trata metadado como conformidade", () => {
  const failed = evaluateCompliance(
    {
      id: "iso",
      name: "fichas",
      version: "1",
      normativeIds: ["STD-ISO-9001"],
      owner: "owner",
      status: "active",
      createdAt: "2026-11-14T00:00:00Z",
      updatedAt: "2026-11-14T00:00:00Z",
      hash: "a".repeat(64),
    },
    { ...internalEvidence(isoFichas.find((item) => item.id === "STD-ISO-9001")!), claimsConformity: true },
    {},
  );
  assert.equal(failed[0].outcome, "rejected");
  assert.equal(failed[0].reason, "ficha:conformity");
});

test("as 34 fichas do controle são as 34 fichas do banco", async () => {
  const db = new PGlite();
  const names = (await readdir(new URL("../../../migrations/", import.meta.url))).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(`../../../migrations/${name}`, import.meta.url), "utf8"));
  const rows = await db.query<{ id: string }>(
    "select id from fundamento where id like 'STD-ISO-%' or id like 'WATCH-ISO-%' order by id",
  );
  assert.deepEqual(rows.rows.map((row) => row.id), isoFichas.map((ficha) => ficha.id).sort());
});
