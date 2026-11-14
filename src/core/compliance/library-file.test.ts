import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("a biblioteca que declara arquivo fica marcada como imagem ou PDF", async () => {
  const db = new PGlite();
  const base = new URL("../../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  const rows = await db.query<{ file_kind: string | null; n: number }>(`
    select file_kind, count(*)::int as n
    from content_object
    where kind = 'biblioteca'
    group by file_kind
    order by n desc
  `);
  const count = Object.fromEntries(rows.rows.map((row) => [row.file_kind ?? "sem", row.n]));
  const images = (count.webp ?? 0) + (count.png ?? 0) + (count.jpeg ?? 0) + (count.gif ?? 0) + (count.avif ?? 0) + (count.svg ?? 0);
  assert.equal(images, 1341);
  assert.equal(count.pdf, 23);
  const cited = await db.query<{ n: number }>(`
    select count(*)::int as n
    from content_object as object
    join content_atom as atom on atom.slug = object.slug
    where object.kind = 'biblioteca' and object.file_kind is not null and atom.id like 'atom-cita-%'
  `);
  assert.equal(cited.rows[0]?.n, 0);
});
