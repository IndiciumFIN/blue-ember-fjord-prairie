-- Lê o catálogo do PostgreSQL e completa o dicionário. Não aprova e não inventa camada.
-- Relação sem chave estrangeira, ou chave sem relação, interrompe a migration.

insert into schema_column (entity, name, data_type, required, key_part, ref_entity, definition, syntax, unit)
select
  physical.table_name,
  physical.column_name,
  case physical.data_type
    when 'boolean' then 'booleano'
    when 'integer' then 'inteiro'
    when 'bigint' then 'inteiro'
    when 'smallint' then 'inteiro'
    when 'timestamp with time zone' then 'instante'
    when 'text' then 'texto'
    else physical.data_type
  end,
  physical.is_nullable = 'NO',
  exists (
    select 1
    from information_schema.table_constraints as key_row
    join information_schema.key_column_usage as key_column
      on key_column.constraint_name = key_row.constraint_name
     and key_column.table_schema = key_row.table_schema
     and key_column.table_name = key_row.table_name
    where key_row.table_schema = 'public'
      and key_row.table_name = physical.table_name
      and key_row.constraint_type = 'PRIMARY KEY'
      and key_column.column_name = physical.column_name
  ),
  null,
  'Coluna física sem definição humana.',
  physical.data_type,
  null
from information_schema.columns as physical
join schema_entity as entity on entity.name = physical.table_name
where physical.table_schema = 'public'
  and not exists (
    select 1 from schema_column as known
    where known.entity = physical.table_name and known.name = physical.column_name
  );

insert into metadata_element (entity, name, support_id)
select column_row.entity, column_row.name, 'politica-metadado'
from schema_column as column_row
where not exists (
  select 1 from metadata_element as element
  where element.entity = column_row.entity and element.name = column_row.name
)
on conflict (entity, name) do nothing;

insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
select
  parent_table.relname,
  'fk-' || constraint_row.conname,
  child_table.relname,
  case
    when (
      select count(*) = 1
      from pg_index as index_row
      join pg_attribute as indexed
        on indexed.attrelid = index_row.indrelid and indexed.attnum = any (index_row.indkey)
      where index_row.indrelid = constraint_row.conrelid
        and index_row.indisunique
        and indexed.attname = child_attribute.attname
        and (
          select count(*)
          from pg_attribute as only_one
          where only_one.attrelid = index_row.indrelid
            and only_one.attnum = any (index_row.indkey)
            and only_one.attnum > 0
        ) = 1
    ) then '1:1'
    else '1:N'
  end,
  parent_attribute.attname,
  child_attribute.attname,
  'Ligação lida da chave estrangeira ' || constraint_row.conname || '.'
from pg_constraint as constraint_row
join pg_class as child_table on child_table.oid = constraint_row.conrelid
join pg_class as parent_table on parent_table.oid = constraint_row.confrelid
join pg_namespace as namespace on namespace.oid = child_table.relnamespace
join lateral unnest(constraint_row.conkey) with ordinality as child_key(attnum, ord) on true
join pg_attribute as child_attribute
  on child_attribute.attrelid = child_table.oid and child_attribute.attnum = child_key.attnum
join lateral unnest(constraint_row.confkey) with ordinality as parent_key(attnum, ord)
  on parent_key.ord = child_key.ord
join pg_attribute as parent_attribute
  on parent_attribute.attrelid = parent_table.oid and parent_attribute.attnum = parent_key.attnum
where constraint_row.contype = 'f'
  and namespace.nspname = 'public'
  and child_key.ord = 1
  and not exists (
    select 1 from schema_relation as known
    where (
      known.from_entity = parent_table.relname
      and known.to_entity = child_table.relname
      and known.from_column = parent_attribute.attname
      and known.to_column = child_attribute.attname
    ) or (
      known.from_entity = child_table.relname
      and known.to_entity = parent_table.relname
      and known.from_column = child_attribute.attname
      and known.to_column = parent_attribute.attname
    )
  )
on conflict (from_entity, name) do nothing;

do $$
declare
  missing text;
  invented text;
begin
  select string_agg(format('%s.%s', child_table.relname, child_attribute.attname), ', ' order by child_table.relname)
    into missing
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
    );

  select string_agg(format('%s.%s', relation.from_entity, relation.name), ', ' order by relation.from_entity)
    into invented
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
  );

  if missing is not null or invented is not null then
    raise exception 'dicionario inconsistente. sem relacao: %. relacao sem chave: %', coalesce(missing, ''), coalesce(invented, '');
  end if;
end $$;
