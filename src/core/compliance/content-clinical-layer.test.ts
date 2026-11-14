import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { auditPlatformConclusion } from "./platform-conclusion.ts";

test("conteúdo e clínico ficam sem coluna muda e a plataforma continua aberta", async () => {
  const db = new PGlite();
  const base = new URL("../../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  const mute = await db.query<{ layer_id: string; n: number }>(`
    select entity.layer_id, count(*)::int as n
    from schema_column as column_row
    join schema_entity as entity on entity.name = column_row.entity
    where column_row.definition = 'Coluna física sem definição humana.'
    group by entity.layer_id
    order by entity.layer_id
  `);
  assert.deepEqual(mute.rows, []);
  const missing = await db.query<{ n: number }>(`
    select count(*)::int as n
    from information_schema.columns as physical
    join schema_entity as entity on entity.name = physical.table_name
    where physical.table_schema = 'public'
      and entity.layer_id in ('conteudo', 'clinico')
      and not exists (
        select 1 from schema_column as column_row
        where column_row.entity = physical.table_name and column_row.name = physical.column_name
      )
  `);
  assert.equal(missing.rows[0]?.n, 0);
  const platform = await auditPlatformConclusion();
  assert.equal(platform.concluded, false);
});
