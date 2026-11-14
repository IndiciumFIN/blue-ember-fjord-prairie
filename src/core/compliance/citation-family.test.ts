import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("COFEN 1/2024 não liga na emenda da ISO 9001", async () => {
  const db = new PGlite();
  const base = new URL("../../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  const guide = await db.query<{ fundamento_id: string }>(`
    select fundamento_id from content_atom
    where slug = 'guia_rapido_dimensionamento_de_enfermagem' and status = 'candidato'
  `);
  assert.deepEqual(guide.rows.map((row) => row.fundamento_id), ["CITE-COFEN-01-2024"]);
  const wrong = await db.query<{ n: number }>(`
    select count(*)::int as n from content_atom
    where slug = 'guia_rapido_dimensionamento_de_enfermagem' and fundamento_id = 'STD-ISO-9001'
  `);
  assert.equal(wrong.rows[0]?.n, 0);
  const standard = await db.query<{ name: string }>("select name from fundamento where id = 'STD-IEC-31010'");
  assert.equal(standard.rows[0]?.name, "IEC 31010:2019");
  const title = await db.query<{ title: string }>("select title from content_text where slug = 'norma/CKO-SRC-0047' and locale = 'pt-BR'");
  assert.equal(title.rows[0]?.title, "IEC 31010:2019");
  const linked = await db.query<{ fundamento_id: string }>(`
    select distinct fundamento_id from content_atom where slug = 'norma/CKO-SRC-0047'
  `);
  assert.deepEqual(linked.rows.map((row) => row.fundamento_id), ["STD-IEC-31010"]);
  const fake = await db.query<{ n: number }>("select count(*)::int as n from fundamento where id = 'CITE-ISO-IEC-31010-2019'");
  assert.equal(fake.rows[0]?.n, 0);
});
