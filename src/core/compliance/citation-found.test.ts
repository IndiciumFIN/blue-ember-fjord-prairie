import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { auditPlatformConclusion } from "./platform-conclusion.ts";

test("a citação encontrada vira trecho e o instrumento citado ganha chave", async () => {
  const db = new PGlite();
  const base = new URL("../../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  const cited = await db.query<{ n: number }>("select count(*)::int as n from content_atom where id like 'atom-cita-%' and status = 'candidato'");
  assert.equal(cited.rows[0]?.n, 28);
  const copsoq = await db.query<{ n: number }>(`
    select count(*)::int as n from content_atom
    where slug = 'copsoq3' and fundamento_id = 'FRAME-COPSOQ3' and status = 'candidato'
  `);
  assert.equal(copsoq.rows[0]?.n, 1);
  const key = await db.query<{ n: number }>(`
    select count(*)::int as n from pg_constraint where conname = 'tool_related_related_fkey'
  `);
  assert.equal(key.rows[0]?.n, 1);
  const admitted = await db.query<{ n: number }>("select count(*)::int as n from content_atom where status = 'admitido'");
  assert.equal(admitted.rows[0]?.n, 0);
  assert.equal((await auditPlatformConclusion()).concluded, false);
});
