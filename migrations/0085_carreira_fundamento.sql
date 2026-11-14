-- A fonte de carreira aponta para o fundamento que já existe. Não cria norma e não admite.

alter table career_source_candidate
  add column if not exists fundamento_id text references fundamento (id);

update career_source_candidate as source
set fundamento_id = known.fundamento_id
from (
  values
    ('SRC-CAREER-COFEN-LEI-7498-1986', 'CKO-SRC-0016'),
    ('SRC-CAREER-COFEN-DEC-94406-1987', 'CKO-SRC-0017'),
    ('SRC-CAREER-COFEN-RES-564-2017', 'CKO-SRC-0018')
) as known (source_id, fundamento_id)
where source.id = known.source_id
  and exists (select 1 from fundamento where id = known.fundamento_id);

insert into schema_column (entity, name, data_type, required, key_part, ref_entity, definition, syntax, unit)
values (
  'career_source_candidate',
  'fundamento_id',
  'texto',
  false,
  false,
  'fundamento',
  'Fundamento já registrado. A fonte de carreira não cria outra norma.',
  'identificador de fundamento',
  null
)
on conflict (entity, name) do nothing;

insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
values (
  'fundamento',
  'fk-career-source-fundamento',
  'career_source_candidate',
  '1:N',
  'id',
  'fundamento_id',
  'A fonte candidata de carreira usa o fundamento existente.'
)
on conflict (from_entity, name) do nothing;

insert into metadata_element (entity, name, support_id)
values ('career_source_candidate', 'fundamento_id', 'politica-registro-normativo')
on conflict (entity, name) do nothing;

do $$
begin
  if (select count(*) from career_source_candidate where fundamento_id is not null) <> 3 then
    raise exception 'a carreira não encontrou os três fundamentos já registrados';
  end if;
end $$;
