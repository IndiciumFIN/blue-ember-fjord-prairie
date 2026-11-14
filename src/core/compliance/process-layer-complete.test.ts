import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { auditAccessLayer } from "./access-layer.ts";
import { auditIdentityLayer } from "./identity-layer.ts";
import { auditPlatformConclusion } from "./platform-conclusion.ts";

test("as camadas 1 e 2 seguem fechadas e a camada 3 fica sem coluna muda", async () => {
  assert.equal(auditIdentityLayer().concluded, true);
  assert.equal(auditAccessLayer().concluded, true);
  const db = new PGlite();
  const base = new URL("../../../migrations/", import.meta.url);
  const names = (await readdir(base)).filter((name) => name.endsWith(".sql")).sort();
  for (const name of names) await db.exec(await readFile(new URL(name, base), "utf8"));
  const mute = await db.query<{ n: number }>(`
    select count(*)::int as n
    from schema_column as column_row
    join schema_entity as entity on entity.name = column_row.entity
    where entity.layer_id = 'processo'
      and column_row.definition = 'Coluna física sem definição humana.'
  `);
  assert.equal(mute.rows[0]?.n, 0);
  const missing = await db.query<{ n: number }>(`
    select count(*)::int as n
    from information_schema.columns as physical
    join schema_entity as entity on entity.name = physical.table_name
    where physical.table_schema = 'public'
      and entity.layer_id = 'processo'
      and not exists (
        select 1 from schema_column as column_row
        where column_row.entity = physical.table_name and column_row.name = physical.column_name
      )
  `);
  assert.equal(missing.rows[0]?.n, 0);
  const platform = await auditPlatformConclusion();
  assert.equal(platform.concluded, false);
});
