import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

const governed = ["apgar", "braden", "gotejamento", "imc", "morse"];

async function migrated() {
  const db = new PGlite();
  const names = (await readdir(new URL("../../migrations/", import.meta.url)))
    .filter((name) => name.endsWith(".sql"))
    .sort();
  for (const name of names) {
    await db.exec(await readFile(new URL(`../../migrations/${name}`, import.meta.url), "utf8"));
  }
  return db;
}

test("o ambiente de teste publica corpo e capa, e o vazio continua fechado", async () => {
  const db = await migrated();
  const empty = await db.query<{ n: number }>("select count(*)::int as n from content_text where status = 'publicado' and btrim(body) = ''");
  assert.equal(empty.rows[0].n, 0);

  const drafts = await db.query<{ n: number }>("select count(*)::int as n from content_text where status <> 'publicado'");
  assert.ok(drafts.rows[0].n > 0, "rascunho vazio ainda precisa existir para a prova de leitura");

  const modelo = await db.query<{ n: number }>("select count(*)::int as n from content_text where slug like 'modelo/%' and status <> 'rascunho'");
  assert.equal(modelo.rows[0].n, 0);
  const norma = await db.query<{ n: number }>(
    "select count(*)::int as n from content_text where slug like 'norma/CKO-SRC-%' and (status <> 'rascunho' or body <> '')",
  );
  assert.equal(norma.rows[0].n, 0);

  const broken = await db.query<{ n: number }>("select count(*)::int as n from content_text where status = 'publicado' and slug like '%/'");
  assert.equal(broken.rows[0].n, 0);

  const foreign = await db.query<{ n: number }>(
    "select count(*)::int as n from content_text where status = 'publicado' and locale <> 'pt-BR'",
  );
  assert.ok(foreign.rows[0].n > 3, "tradução com corpo continua fechada");

  const open = await db.query<{ slug: string }>("select slug from source_tool where published order by slug");
  const slugs = open.rows.map((row) => row.slug);
  for (const slug of governed) assert.ok(slugs.includes(slug), slug);
  const hidden = await db.query<{ n: number }>("select count(*)::int as n from source_tool where not published");
  assert.equal(hidden.rows[0].n, 0);

  const dark = await db.query<{ n: number }>(
    `select count(*)::int as n from section_link
     where live = false
       and (dest_id is not null or dest_kind is not null or dest_slug is not null or dest_to is not null or dest_hash is not null)`,
  );
  assert.equal(dark.rows[0].n, 0);

  const catalog = await readFile(new URL("./tools/catalog.ts", import.meta.url), "utf8");
  const menu = catalog.slice(catalog.indexOf("export const tools"), catalog.indexOf("export const candidateTools"));
  assert.match(menu, /\[braden, morse, apgar, gotejamento, imc\]/);
  assert.equal(menu.includes("aldrete"), false);
});
