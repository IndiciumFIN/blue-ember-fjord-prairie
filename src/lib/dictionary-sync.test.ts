import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { assertDictionaryConsistent, dictionaryGaps, syncDictionary } from "./dictionary-sync.ts";

async function database() {
  const db = new PGlite();
  const base = new URL("../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  return db;
}

test("o catálogo completa a relação que falta e recusa relação inventada", async () => {
  const db = await database();
  await assertDictionaryConsistent(db);
  const before = await db.query<{ n: number }>("select count(*)::int as n from schema_relation");
  await syncDictionary(db);
  const after = await db.query<{ n: number }>("select count(*)::int as n from schema_relation");
  assert.equal(after.rows[0]?.n, before.rows[0]?.n);
  await db.exec(`
    insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
    values ('user', 'fantasma', 'session', '1:N', 'id', 'nao-existe', 'Ligação que a tabela não tem.')
  `);
  const gaps = await dictionaryGaps(db);
  assert.equal(gaps.invented.includes("user.fantasma"), true);
  await assert.rejects(() => assertDictionaryConsistent(db), /user\.fantasma/);
});
