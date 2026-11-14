import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { auditPlatformConclusion } from "./platform-conclusion.ts";

test("o trecho extraído liga a conta à norma e a linha ao modelo, sem admitir", async () => {
  const db = new PGlite();
  const base = new URL("../../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  const formula = await db.query<{ n: number }>(`
    select count(*)::int as n
    from tool_formula as formula
    join content_object as object on object.tool_slug = formula.tool_slug
    where not exists (
      select 1 from content_atom as atom
      where atom.slug = object.slug
        and atom.origin = 'normativo'
        and atom.fundamento_id = 'STD-ABNT-NBR5891'
        and atom.status = 'candidato'
    )
  `);
  assert.equal(formula.rows[0]?.n, 0);
  const line = await db.query<{ n: number }>(`
    select count(*)::int as n
    from editorial_line as line
    where not exists (
      select 1 from content_atom as atom
      where atom.template_id = line.template_id
        and atom.line_position = line.position
        and atom.origin = 'editorial'
        and atom.status = 'candidato'
    )
  `);
  assert.equal(line.rows[0]?.n, 0);
  const reference = await db.query<{ n: number }>(`
    select count(*)::int as n
    from tool_reference as reference
    where not exists (
      select 1 from content_atom as atom
      where atom.reference_tool = reference.tool_slug
        and atom.reference_position = reference.position
        and atom.origin = 'normativo'
        and atom.fundamento_id is not null
    )
  `);
  assert.equal(reference.rows[0]?.n, 0);
  const published = await db.query<{ n: number }>(`
    select count(*)::int as n
    from content_text
    where slug like 'modelo/%' and status <> 'rascunho'
  `);
  assert.equal(published.rows[0]?.n, 0);
  const admitted = await db.query<{ n: number }>("select count(*)::int as n from content_atom where status = 'admitido'");
  assert.equal(admitted.rows[0]?.n, 0);
  const loose = await db.query<{ n: number }>(`
    select count(*)::int as n
    from content_object as object
    where object.kind <> 'editorial'
      and not exists (select 1 from content_atom as atom where atom.slug = object.slug)
  `);
  assert.ok((loose.rows[0]?.n ?? 0) > 0);
  assert.equal((await auditPlatformConclusion()).concluded, false);
});
