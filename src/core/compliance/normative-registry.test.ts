import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { auditPlatformConclusion } from "./platform-conclusion.ts";

test("o registro local vira identificador, sem contabilidade e sem cláusula", async () => {
  const registry = JSON.parse(await readFile(new URL("../../../attachments/CKO_Fontes_Normativas_Registry.json", import.meta.url), "utf8"));
  const accounting = /contabil|contábil|accounting|\bcfc\b|nbc ta|nbc ti|nbc pg/i;
  const expected = registry.sources.filter((source: { code: string; title: string; issuer: string }) => !accounting.test([source.code, source.title, source.issuer].join(" "))).length;
  const db = new PGlite();
  const base = new URL("../../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  const loaded = await db.query<{ n: number }>(`
    select count(*)::int as n
    from content_atom
    where id like 'atom-src-CKO-SRC-%' and status = 'candidato' and origin = 'normativo'
  `);
  assert.equal(loaded.rows[0]?.n, expected);
  const dropped = await db.query<{ n: number }>("select count(*)::int as n from fundamento where id = 'CKO-SRC-0060'");
  assert.equal(dropped.rows[0]?.n, 0);
  const reused = await db.query<{ fundamento_id: string }>(`
    select fundamento_id from content_atom where id = 'atom-src-CKO-SRC-0043'
  `);
  assert.equal(reused.rows[0]?.fundamento_id, "STD-ISO-19011");
  const duplicate = await db.query<{ n: number }>("select count(*)::int as n from fundamento where id = 'CKO-SRC-0043'");
  assert.equal(duplicate.rows[0]?.n, 0);
  const published = await db.query<{ n: number }>(`
    select count(*)::int as n
    from content_text
    where slug like 'norma/CKO-SRC-%' and (status <> 'rascunho' or body <> '')
  `);
  assert.equal(published.rows[0]?.n, 0);
  assert.equal((await auditPlatformConclusion()).concluded, false);
});
