import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { analyzeFkTuples } from "../../scripts/lib/fk-tuple-audit.mjs";

type ForeignKeyRow = {
  constraint_name: string;
  child_table: string;
  parent_table: string;
  child_columns: string[];
  parent_columns: string[];
};
type RelationRow = {
  name: string;
  from_entity: string;
  to_entity: string;
  from_column: string;
  to_column: string;
};

test("a estrutura fisica das FKs compostas e inventariada, sem falsa homologacao", async () => {
  const db = new PGlite();
  const base = new URL("../../migrations/", import.meta.url);
  const files = (await readdir(base)).filter(name => name.endsWith(".sql")).sort();
  for (const file of files) {
    await db.exec(await readFile(new URL(file, base), "utf8"));
  }
  const fk = await db.query<ForeignKeyRow>(`
    select c.conname as constraint_name,
           child.relname as child_table,
           parent.relname as parent_table,
           array_agg(child_column.attname order by child_key.ord) as child_columns,
           array_agg(parent_column.attname order by parent_key.ord) as parent_columns
    from pg_constraint as c
    join pg_class as child on child.oid = c.conrelid
    join pg_class as parent on parent.oid = c.confrelid
    join pg_namespace as child_ns on child_ns.oid = child.relnamespace
    join pg_namespace as parent_ns on parent_ns.oid = parent.relnamespace
    join lateral unnest(c.conkey) with ordinality as child_key(attnum,ord) on true
    join lateral unnest(c.confkey) with ordinality as parent_key(attnum,ord)
      on parent_key.ord = child_key.ord
    join pg_attribute as child_column
      on child_column.attrelid = child.oid and child_column.attnum = child_key.attnum
    join pg_attribute as parent_column
      on parent_column.attrelid = parent.oid and parent_column.attnum = parent_key.attnum
    where c.contype = 'f'
      and child_ns.nspname = 'public' and parent_ns.nspname = 'public'
    group by c.oid, c.conname, child.relname, parent.relname
    order by child.relname, c.conname
  `);
  const dictionary = await db.query<RelationRow>(`
    select name, from_entity, to_entity, from_column, to_column
    from schema_relation
  `);
  const result = analyzeFkTuples(fk.rows, dictionary.rows);
  console.log("FK_TUPLE_INVENTORY", JSON.stringify({
    physicalForeignKeys: result.physicalForeignKeys,
    scalarForeignKeys: result.scalarForeignKeys,
    compositeForeignKeys: result.compositeForeignKeys,
    missingScalar: result.missingScalar.map(x => x.constraint),
    compositeFirstPairsNotDescribed: result.compositeHolds
      .filter(x => !x.firstPairDescribed).map(x => x.constraint),
    completeRelationMetadata: result.completeRelationMetadata,
  }));
  assert.equal(result.physicalForeignKeys, 150, "mudanca no numero fisico de FKs requer novo inventario");
  assert.equal(result.compositeForeignKeys, 13, "mudanca nas tuplas compostas requer revalidacao");
  assert.deepEqual(result.missingScalar.map(x => x.constraint), [],
    "FK simples sem ligacao no dicionario");
  assert.equal(result.compositeHolds.length, 13);
  assert.equal(result.completeRelationMetadata, false,
    "schema_relation ainda tem apenas colunas escalares; nao pode declarar tuplas homologadas");
});
