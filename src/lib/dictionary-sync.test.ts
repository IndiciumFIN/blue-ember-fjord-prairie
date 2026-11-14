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

test("rejeita pares cruzados de FK composta que nao existem fisicamente", async () => {
  const db = await database();
  type Fk = { child_table: string; parent_table: string; child_columns: string[]; parent_columns: string[] };
  const physical = await db.query<Fk>(`
    select child.relname as child_table, parent.relname as parent_table,
           array_agg(child_column.attname order by child_key.ord) as child_columns,
           array_agg(parent_column.attname order by parent_key.ord) as parent_columns
    from pg_constraint as c
    join pg_class as child on child.oid = c.conrelid
    join pg_class as parent on parent.oid = c.confrelid
    join pg_namespace as ns on ns.oid = child.relnamespace
    join lateral unnest(c.conkey) with ordinality as child_key(attnum,ord) on true
    join lateral unnest(c.confkey) with ordinality as parent_key(attnum,ord)
      on parent_key.ord = child_key.ord
    join pg_attribute as child_column
      on child_column.attrelid = child.oid and child_column.attnum = child_key.attnum
    join pg_attribute as parent_column
      on parent_column.attrelid = parent.oid and parent_column.attnum = parent_key.attnum
    where c.contype = 'f' and ns.nspname = 'public'
    group by c.oid, child.relname, parent.relname
  `);
  const key = (child: string, parent: string, childColumn: string, parentColumn: string) =>
    JSON.stringify([child, parent, childColumn, parentColumn]);
  const aligned = new Set(physical.rows.flatMap(fk =>
    fk.child_columns.map((column, i) => key(fk.child_table, fk.parent_table, column, fk.parent_columns[i]))));
  const mismatched = physical.rows.filter(fk => fk.child_columns.length > 1).flatMap(fk =>
    fk.child_columns.flatMap((childColumn, i) =>
      fk.parent_columns.flatMap((parentColumn, j) =>
        i === j || aligned.has(key(fk.child_table, fk.parent_table, childColumn, parentColumn))
          ? [] : [{ fk, childColumn, parentColumn }])))[0];
  assert.ok(mismatched, "expected a cross-pair not represented by any physical FK");
  await db.query(
    `insert into schema_relation
      (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
      values ($1, 'fk-ordinality-invalid-test', $2, '1:N', $3, $4, 'Par cruzado sintético: deve falhar.')`,
    [mismatched.fk.parent_table, mismatched.fk.child_table, mismatched.parentColumn, mismatched.childColumn],
  );
  const gaps = await dictionaryGaps(db);
  assert.ok(gaps.invented.includes(`${mismatched.fk.parent_table}.fk-ordinality-invalid-test`));
  await assert.rejects(() => assertDictionaryConsistent(db), /fk-ordinality-invalid-test/);
});
