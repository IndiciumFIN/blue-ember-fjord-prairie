-- O objeto continua sendo a fonte. O átomo é o trecho extraído.
-- Normativo aponta para o identificador. Editorial aponta para o modelo.
-- Nada nasce admitido e a cláusula não entra.

insert into governance_item (id, kind, title, body)
values (
  'politica-referencia-citada',
  'politica',
  'Documento interno da referência citada',
  'Este texto é nosso. A ficha pode citar autor, ano e veículo. O texto da fonte não entra. O identificador em fundamento não é a cláusula e não publica o objeto.'
)
on conflict (id) do nothing;

insert into fundamento (id, name, domain, right_name, priority, support_id)
select
  'REF-' || upper(reference.tool_slug) || '-' || reference.position,
  left(reference.citation, 180),
  'Referência da ficha',
  'Referência citada',
  'P1',
  'politica-referencia-citada'
from tool_reference as reference
on conflict (id) do nothing;

insert into content_object (slug, kind, origin_path)
select 'modelo/' || template.id, 'editorial', 'modelo/' || template.id
from editorial_template as template
on conflict (slug) do nothing;

insert into content_text (slug, locale, view, title, lead, body, status)
select 'modelo/' || template.id, 'pt-BR', 'leitura', template.name, template.description, '', 'rascunho'
from editorial_template as template
on conflict (slug, locale, view) do nothing;

create table if not exists content_atom (
  id text primary key,
  slug text not null references content_object (slug),
  origin text not null check (origin in ('normativo', 'editorial')),
  fundamento_id text references fundamento (id),
  template_id text references editorial_template (id),
  line_position integer,
  reference_tool text,
  reference_position integer,
  statement text not null,
  locator text not null,
  status text not null default 'candidato' check (status in ('candidato', 'admitido', 'rejeitado')),
  check (
    (origin = 'normativo' and fundamento_id is not null and template_id is null and line_position is null)
    or
    (origin = 'editorial' and fundamento_id is null and template_id is not null and reference_tool is null)
  ),
  foreign key (template_id, line_position) references editorial_line (template_id, position),
  foreign key (reference_tool, reference_position) references tool_reference (tool_slug, position)
);

create unique index if not exists content_atom_line_key
  on content_atom (template_id, line_position)
  where line_position is not null;

create unique index if not exists content_atom_reference_key
  on content_atom (reference_tool, reference_position)
  where reference_tool is not null;

insert into content_atom (id, slug, origin, fundamento_id, statement, locator, status)
select
  'atom-nbr-' || object.slug,
  object.slug,
  'normativo',
  'STD-ABNT-NBR5891',
  'A conta usa o arredondamento do documento interno. O identificador é STD-ABNT-NBR5891. A cláusula não entra.',
  'docs/documento-interno-arredondamento.md',
  'candidato'
from content_object as object
join tool_formula as formula on formula.tool_slug = object.tool_slug
on conflict (id) do nothing;

insert into content_atom (
  id, slug, origin, fundamento_id, reference_tool, reference_position, statement, locator, status
)
select
  'atom-ref-' || reference.tool_slug || '-' || reference.position,
  object.slug,
  'normativo',
  'REF-' || upper(reference.tool_slug) || '-' || reference.position,
  reference.tool_slug,
  reference.position,
  'A ficha cita esta referência. O texto da fonte não entra.',
  'tool_reference:' || reference.tool_slug || ':' || reference.position,
  'candidato'
from tool_reference as reference
join content_object as object on object.tool_slug = reference.tool_slug
on conflict (id) do nothing;

insert into content_atom (
  id, slug, origin, template_id, line_position, statement, locator, status
)
select
  'atom-ed-' || line.template_id || '-' || line.position,
  'modelo/' || line.template_id,
  'editorial',
  line.template_id,
  line.position,
  line.text,
  'editorial_line:' || line.template_id || ':' || line.position,
  'candidato'
from editorial_line as line
on conflict (id) do nothing;

insert into schema_entity (name, layer_id, primary_key, purpose, links)
values (
  'content_atom',
  'conteudo',
  'id',
  'Trecho extraído. Nasce candidato. Normativo aponta para o identificador e editorial aponta para o modelo.',
  'slug → content_object.slug; fundamento_id → fundamento.id; template_id + line_position → editorial_line'
)
on conflict (name) do nothing;

insert into schema_column (entity, name, data_type, required, key_part, ref_entity, definition, syntax, unit)
values
  ('content_atom', 'id', 'texto', true, true, null, 'Identidade do trecho extraído.', 'texto', null),
  ('content_atom', 'slug', 'texto', true, false, 'content_object', 'Objeto canônico deste trecho.', 'slug de content_object', null),
  ('content_atom', 'origin', 'texto', true, false, null, 'De onde o trecho foi extraído.', 'normativo ou editorial', null),
  ('content_atom', 'fundamento_id', 'texto', false, false, 'fundamento', 'Identificador normativo. Obrigatório quando a origem é normativo. Não é a cláusula.', 'id de fundamento', null),
  ('content_atom', 'template_id', 'texto', false, false, 'editorial_template', 'Modelo editorial. Obrigatório quando a origem é editorial.', 'id de editorial_template', null),
  ('content_atom', 'line_position', 'inteiro', false, false, null, 'Linha do modelo. Faz parte da chave para editorial_line.', 'inteiro', null),
  ('content_atom', 'reference_tool', 'texto', false, false, null, 'Instrumento da referência citada. Faz parte da chave para tool_reference.', 'slug', null),
  ('content_atom', 'reference_position', 'inteiro', false, false, null, 'Posição da referência citada.', 'inteiro', null),
  ('content_atom', 'statement', 'texto', true, false, null, 'Texto nosso do trecho. Não é a cláusula.', 'texto', null),
  ('content_atom', 'locator', 'texto', true, false, null, 'Onde o trecho foi lido.', 'texto', null),
  ('content_atom', 'status', 'texto', true, false, null, 'Nasce candidato. Esta migration não admite.', 'candidato, admitido ou rejeitado', null)
on conflict (entity, name) do nothing;

insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
values
  ('content_object', 'atomos', 'content_atom', '1:N', 'slug', 'slug', 'Um objeto canônico reúne os trechos extraídos.'),
  ('fundamento', 'atomos', 'content_atom', '1:N', 'id', 'fundamento_id', 'Um identificador normativo sustenta vários trechos. Não é a cláusula.'),
  ('editorial_template', 'atomos', 'content_atom', '1:N', 'id', 'template_id', 'Um modelo editorial sustenta as linhas extraídas.'),
  ('editorial_line', 'atomo', 'content_atom', '1:1', 'position', 'line_position', 'Uma linha editorial é um trecho. A chave completa é template_id + position.'),
  ('tool_reference', 'atomo', 'content_atom', '1:1', 'position', 'reference_position', 'Uma referência citada é um trecho normativo. A chave completa é tool_slug + position.')
on conflict (from_entity, name) do nothing;
