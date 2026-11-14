-- A ficha da biblioteca declara o arquivo. Imagem e PDF não são citação faltante.

alter table content_object add column if not exists file_kind text;

do $$
begin
  if not exists (
    select 1 from content_object
    where file_kind is not null
      and file_kind not in ('webp', 'png', 'jpeg', 'gif', 'avif', 'svg', 'pdf')
  ) then
    alter table content_object drop constraint if exists content_object_file_kind_check;
    alter table content_object add constraint content_object_file_kind_check
      check (file_kind is null or file_kind in ('webp', 'png', 'jpeg', 'gif', 'avif', 'svg', 'pdf'));
  end if;
end $$;

update content_object as object
set file_kind = classified.file_kind
from (
  select
    text.slug,
    case
      when text.body ~* 'arquivo webp|file webp' then 'webp'
      when text.body ~* 'arquivo png|file png' then 'png'
      when text.body ~* 'arquivo jpe?g|file jpe?g' then 'jpeg'
      when text.body ~* 'arquivo gif|file gif' then 'gif'
      when text.body ~* 'arquivo avif|file avif' then 'avif'
      when text.body ~* 'arquivo svg|file svg' then 'svg'
      when text.body ~* 'arquivo pdf|file pdf' then 'pdf'
      else null
    end as file_kind
  from content_text as text
  where text.locale = 'pt-BR' and text.view = 'leitura'
) as classified
where object.slug = classified.slug
  and object.kind = 'biblioteca'
  and classified.file_kind is not null;

insert into schema_column (entity, name, data_type, required, key_part, ref_entity, definition, syntax, unit)
values (
  'content_object',
  'file_kind',
  'texto',
  false,
  false,
  null,
  'Tipo de arquivo declarado na ficha da biblioteca. Imagem e PDF não são citação normativa.',
  'webp, png, jpeg, gif, avif, svg ou pdf',
  null
)
on conflict (entity, name) do nothing;
