import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { auditPlatformConclusion } from "./platform-conclusion.ts";

test("o metamodelo local vira identificador e regra parafraseada, sem cláusula", async () => {
  const meta = JSON.parse(await readFile(new URL("../../../attachments/metamodelo-normativos.json", import.meta.url), "utf8"));
  const norms = meta.tabelas.meta_normativo.filter((row: { texto_protegido_reproduzido: boolean }) => row.texto_protegido_reproduzido === false);
  const rules = meta.tabelas.meta_regra_normativa;
  const db = new PGlite();
  const base = new URL("../../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  const loaded = await db.query<{ n: number }>("select count(*)::int as n from content_atom where id like 'atom-meta-NORM-%' and status = 'candidato'");
  assert.equal(loaded.rows[0]?.n, norms.length);
  const paraphrases = await db.query<{ n: number }>("select count(*)::int as n from content_atom where id like 'atom-regra-%' and status = 'candidato'");
  assert.equal(paraphrases.rows[0]?.n, rules.length);
  const sample = rules[0];
  const stored = await db.query<{ statement: string; body: string; status: string }>(`
    select atom.statement, text.body, text.status
    from content_atom as atom
    join content_text as text on text.slug = atom.slug and text.locale = 'pt-BR' and text.view = 'leitura'
    where atom.id = $1
  `, [`atom-regra-${sample.id_regra}`]);
  assert.equal(stored.rows[0]?.statement, sample.descricao_regra);
  assert.equal(stored.rows[0]?.body, "");
  assert.equal(stored.rows[0]?.status, "rascunho");
  assert.equal((await auditPlatformConclusion()).concluded, false);
});
