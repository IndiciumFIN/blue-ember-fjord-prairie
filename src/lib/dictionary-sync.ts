import { readFileSync } from "node:fs";

type Queryable = {
  exec(sql: string): Promise<unknown>;
  query<T extends Record<string, unknown>>(sql: string): Promise<{ rows: T[] }>;
};

const syncSql = readFileSync(new URL("../../migrations/0069_sincronia_dicionario.sql", import.meta.url), "utf8");

/** Roda de novo a sincronia do catálogo. A própria migration já bloqueia a base nova. */
export async function syncDictionary(db: Queryable) {
  await db.exec(syncSql);
}

export async function dictionaryGaps(db: Queryable) {
  const missing = await db.query<{ child: string }>(`
    select format('%s.%s', child_table.relname, child_attribute.attname) as child
    from pg_constraint as constraint_row
    join pg_class as child_table on child_table.oid = constraint_row.conrelid
    join pg_class as parent_table on parent_table.oid = constraint_row.confrelid
    join pg_namespace as namespace on namespace.oid = child_table.relnamespace
    join lateral unnest(constraint_row.conkey) with ordinality as child_key(attnum, ord) on child_key.ord = 1
    join pg_attribute as child_attribute
      on child_attribute.attrelid = child_table.oid and child_attribute.attnum = child_key.attnum
    join lateral unnest(constraint_row.confkey) with ordinality as parent_key(attnum, ord) on parent_key.ord = 1
    join pg_attribute as parent_attribute
      on parent_attribute.attrelid = parent_table.oid and parent_attribute.attnum = parent_key.attnum
    where constraint_row.contype = 'f'
      and namespace.nspname = 'public'
      and not exists (
        select 1 from schema_relation as known
        where (
          known.from_entity = parent_table.relname and known.to_entity = child_table.relname
          and known.from_column = parent_attribute.attname and known.to_column = child_attribute.attname
        ) or (
          known.from_entity = child_table.relname and known.to_entity = parent_table.relname
          and known.from_column = child_attribute.attname and known.to_column = parent_attribute.attname
        ) or (
          cardinality(constraint_row.conkey) > 1
          and (
            (known.from_entity = parent_table.relname and known.to_entity = child_table.relname)
            or (known.from_entity = child_table.relname and known.to_entity = parent_table.relname)
          )
        )
      )
    order by 1
  `);
  const invented = await db.query<{ name: string }>(`
    select format('%s.%s', relation.from_entity, relation.name) as name
    from schema_relation as relation
    where not exists (
      select 1
      from pg_constraint as constraint_row
      join pg_class as child_table on child_table.oid = constraint_row.conrelid
      join pg_class as parent_table on parent_table.oid = constraint_row.confrelid
      join pg_namespace as namespace on namespace.oid = child_table.relnamespace
      join pg_attribute as child_attribute
        on child_attribute.attrelid = child_table.oid and child_attribute.attnum = any (constraint_row.conkey)
      join pg_attribute as parent_attribute
        on parent_attribute.attrelid = parent_table.oid and parent_attribute.attnum = any (constraint_row.confkey)
      where constraint_row.contype = 'f'
        and namespace.nspname = 'public'
        and (
          (relation.from_entity = parent_table.relname and relation.to_entity = child_table.relname
            and relation.from_column = parent_attribute.attname and relation.to_column = child_attribute.attname)
          or (relation.from_entity = child_table.relname and relation.to_entity = parent_table.relname
            and relation.from_column = child_attribute.attname and relation.to_column = parent_attribute.attname)
        )
    )
    order by 1
  `);
  return { missing: missing.rows.map((row) => row.child), invented: invented.rows.map((row) => row.name) };
}

/** Recusa a base quando o dicionário e as chaves não contam a mesma história. */
export async function assertDictionaryConsistent(db: Queryable) {
  const gaps = await dictionaryGaps(db);
  if (gaps.missing.length > 0 || gaps.invented.length > 0) {
    throw new Error(`dicionario inconsistente. sem relacao: ${gaps.missing.join(", ")}. relacao sem chave: ${gaps.invented.join(", ")}`);
  }
}
