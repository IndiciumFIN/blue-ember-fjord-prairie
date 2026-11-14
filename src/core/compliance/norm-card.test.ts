import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("o título da ficha normativa liga o número e deixa a década de 80 sem ano", async () => {
  const db = new PGlite();
  const base = new URL("../../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  const linked = await db.query<{ n: number }>(`
    select count(*)::int as n from content_atom
    where locator like '%:title' and status = 'candidato'
  `);
  assert.equal(linked.rows[0]?.n, 9);
  const open = await db.query<{ slug: string }>(`
    select slug from content_object
    where kind = 'norma' and not exists (select 1 from content_atom as atom where atom.slug = content_object.slug)
    order by slug
  `);
  assert.deepEqual(open.rows.map((row) => row.slug), [
    "biblioteca/2017-conselho-federal-de-enfermagem-codigo-de-etica-dos-profissionais-de-enfermagem",
    "biblioteca/codigo-de-etica-dos-profissionais-de-enfermagem-cofen",
    "biblioteca/resolucao-cofen-decada-de-80",
    "biblioteca/resolucao-cofen-decada-de-80-2",
  ]);
});
