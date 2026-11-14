-- Ambiente de teste. Abre o que já tem corpo e a capa das ferramentas.
-- Não homologa cálculo. Corpo vazio, modelo canônico e ficha de norma sem texto ficam em rascunho.
-- Não mexe em texto alternativo, regra de negócio nem ordem do kernel.

update content_text
set status = 'publicado'
where status = 'rascunho'
  and btrim(body) <> ''
  and slug not like 'modelo/%'
  and slug not like 'norma/CKO-SRC-%'
  and slug not like '%/';

update source_tool
set published = true
where published = false;

insert into screen_dest (id, kind, place_id, tool_slug, hash, page_to, model_id)
select 'tool:' || tool.slug, 'tool', null, tool.slug, '', '', ''
from source_tool as tool
on conflict (id) do nothing;

update section_link as link
set dest_kind = 'tool',
    dest_slug = tool.slug,
    dest_id = 'tool:' || tool.slug,
    live = true
from source_tool as tool
where link.dest_kind is null
  and link.dest_id is null
  and link.dest_slug is null
  and link.dest_to is null
  and tool.slug = link.item_id;

update section_link as link
set dest_kind = 'tool',
    dest_slug = tool.slug,
    dest_id = 'tool:' || tool.slug,
    live = true
from source_tool as tool
where link.dest_kind is null
  and link.dest_id is null
  and link.dest_slug is null
  and link.dest_to is null
  and replace(tool.slug, '_', '-') = link.item_id
  and not exists (select 1 from source_tool as exact where exact.slug = link.item_id);

update section_link
set live = true
where live = false
  and (
    dest_id is not null
    or dest_kind is not null
    or dest_slug is not null
    or dest_to is not null
    or dest_hash is not null
  );
