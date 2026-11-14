import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("número e ano citados no texto viram trecho, sem ler inciso como ISO", async () => {
  const db = new PGlite();
  const base = new URL("../../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  const sus = await db.query<{ fundamento_id: string }>(`
    select fundamento_id from content_atom
    where slug = 'principios_sus' and status = 'candidato'
    order by fundamento_id
  `);
  assert.deepEqual(sus.rows.map((row) => row.fundamento_id), ["CITE-LEI-8080-1990", "CITE-LEI-8142-1990"]);
  const fake = await db.query<{ n: number }>("select count(*)::int as n from fundamento where id like 'CITE-ISO-8080%' or id like 'CITE-ISO-8142%'");
  assert.equal(fake.rows[0]?.n, 0);
  const admitted = await db.query<{ n: number }>("select count(*)::int as n from content_atom where status = 'admitido'");
  assert.equal(admitted.rows[0]?.n, 0);
});
