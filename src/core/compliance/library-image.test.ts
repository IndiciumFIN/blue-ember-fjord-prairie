import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("ficha de imagem fica marcada e o texto só guarda o número citado", async () => {
  const db = new PGlite();
  const base = new URL("../../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  const images = await db.query<{ n: number }>("select count(*)::int as n from content_object where kind = 'biblioteca' and file_kind = 'imagem'");
  const media = await db.query<{ n: number }>("select count(*)::int as n from content_object where kind = 'biblioteca' and file_kind in ('mp4', 'csv', 'json', 'md', 'txt')");
  const catalogs = await db.query<{ n: number }>("select count(*)::int as n from content_object where kind = 'biblioteca' and file_kind = 'catalogo'");
  const open = await db.query<{ slug: string }>("select slug from content_object where kind = 'biblioteca' and file_kind is null order by slug");
  assert.equal(images.rows[0]?.n, 240);
  assert.equal(media.rows[0]?.n, 19);
  assert.equal(catalogs.rows[0]?.n, 11);
  assert.deepEqual(open.rows.map((row) => row.slug), [
    "biblioteca-carinho-de-emergencia",
    "biblioteca-cirurgica",
    "biblioteca-curativo",
    "biblioteca-provas",
    "biblioteca-seringa",
    "coracao-humano",
  ]);
  const cited = await db.query<{ n: number }>(`
    select count(*)::int as n from content_atom
    where id in (
      'atom-cita-biblioteca-cirurgica-CITE-RDC-15-2012',
      'atom-cita-biblioteca-seringa-CITE-RDC-222-2018',
      'atom-cita-biblioteca-carinho-de-emergencia-CITE-COFEN-24-2018',
      'atom-cita-biblioteca-carinho-de-emergencia-CKO-SRC-0016'
    ) and status = 'candidato' and statement not like '%cláusula entra%'
  `);
  assert.equal(cited.rows[0]?.n, 4);
});
