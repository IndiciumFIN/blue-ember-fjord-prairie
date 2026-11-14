-- Citação encontrada no texto em português. Não copia cláusula e não admite.

drop table if exists cited_source;
create temporary table cited_source (
  id text primary key,
  slug text not null,
  fundamento_id text not null,
  cited text not null
);

insert into cited_source (id, slug, fundamento_id, cited) values
  ('atom-cita-termos-CKO-SRC-0001', 'termos', 'CKO-SRC-0001', 'lei 13709/2018'),
  ('atom-cita-biblioteca-carinho-de-emergencia-CKO-SRC-0018', 'biblioteca-carinho-de-emergencia', 'CKO-SRC-0018', 'cofen 564/2017'),
  ('atom-cita-biblioteca-carinho-de-emergencia-CKO-SRC-0020', 'biblioteca-carinho-de-emergencia', 'CKO-SRC-0020', 'cofen 358/2009'),
  ('atom-cita-codigo_de_etica_enfermagem-CKO-SRC-0016', 'codigo_de_etica_enfermagem', 'CKO-SRC-0016', 'lei 7498/1986'),
  ('atom-cita-codigo_de_etica_enfermagem-CKO-SRC-0018', 'codigo_de_etica_enfermagem', 'CKO-SRC-0018', 'cofen 564/2017'),
  ('atom-cita-conteudos-do-site-FRAME-COPSOQ3', 'conteudos-do-site', 'FRAME-COPSOQ3', 'copsoq iii'),
  ('atom-cita-conteudos_da_pagina-FRAME-COPSOQ3', 'conteudos_da_pagina', 'FRAME-COPSOQ3', 'copsoq iii'),
  ('atom-cita-entenda_copsoq-FRAME-COPSOQ3', 'entenda_copsoq', 'FRAME-COPSOQ3', 'copsoq iii'),
  ('atom-cita-exemplo_de_processo_de_enfermagem-CKO-SRC-0020', 'exemplo_de_processo_de_enfermagem', 'CKO-SRC-0020', 'cofen 358/2009'),
  ('atom-cita-guia_fundamental_codigo_de_etica_enfermagem-CKO-SRC-0018', 'guia_fundamental_codigo_de_etica_enfermagem', 'CKO-SRC-0018', 'cofen 564/2017'),
  ('atom-cita-guia_fundamental_processo_de_enfermagem-CKO-SRC-0016', 'guia_fundamental_processo_de_enfermagem', 'CKO-SRC-0016', 'lei 7498/1986'),
  ('atom-cita-guia_fundamental_processo_de_enfermagem-CKO-SRC-0017', 'guia_fundamental_processo_de_enfermagem', 'CKO-SRC-0017', 'decreto 94406/1987'),
  ('atom-cita-guia_fundamental_processo_de_enfermagem-CKO-SRC-0019', 'guia_fundamental_processo_de_enfermagem', 'CKO-SRC-0019', 'cofen 736/2024'),
  ('atom-cita-guia_fundamental_processo_de_enfermagem-CKO-SRC-0020', 'guia_fundamental_processo_de_enfermagem', 'CKO-SRC-0020', 'cofen 358/2009'),
  ('atom-cita-guia_fundamental_processo_de_enfermagem-CKO-SRC-0021', 'guia_fundamental_processo_de_enfermagem', 'CKO-SRC-0021', 'cofen 429/2012'),
  ('atom-cita-guia_rapido_kanbam_na_enfermagem-CKO-SRC-0018', 'guia_rapido_kanbam_na_enfermagem', 'CKO-SRC-0018', 'cofen 564/2017'),
  ('atom-cita-guia_rapido_lei5905-73_criacao_cofen_coren-CKO-SRC-0016', 'guia_rapido_lei5905-73_criacao_cofen_coren', 'CKO-SRC-0016', 'lei 7498/1986'),
  ('atom-cita-guia_rapido_lei5905-73_criacao_cofen_coren-CKO-SRC-0017', 'guia_rapido_lei5905-73_criacao_cofen_coren', 'CKO-SRC-0017', 'decreto 94406/1987'),
  ('atom-cita-guia_rapido_lei5905-73_criacao_cofen_coren-CKO-SRC-0018', 'guia_rapido_lei5905-73_criacao_cofen_coren', 'CKO-SRC-0018', 'cofen 564/2017'),
  ('atom-cita-guia_rapido_seringa_insulina-CKO-SRC-0020', 'guia_rapido_seringa_insulina', 'CKO-SRC-0020', 'cofen 358/2009'),
  ('atom-cita-legislacoes-CKO-SRC-0016', 'legislacoes', 'CKO-SRC-0016', 'lei 7498/1986'),
  ('atom-cita-legislacoes-CKO-SRC-0018', 'legislacoes', 'CKO-SRC-0018', 'cofen 564/2017'),
  ('atom-cita-nanda-CKO-SRC-0020', 'nanda', 'CKO-SRC-0020', 'cofen 358/2009'),
  ('atom-cita-responsbilidade_inteligencia_artificial-CKO-SRC-0019', 'responsbilidade_inteligencia_artificial', 'CKO-SRC-0019', 'cofen 736/2024'),
  ('atom-cita-simulado_codigo_de_etica_enfermagem-CKO-SRC-0018', 'simulado_codigo_de_etica_enfermagem', 'CKO-SRC-0018', 'cofen 564/2017'),
  ('atom-cita-teorias-de-enfermagem-CKO-SRC-0020', 'teorias-de-enfermagem', 'CKO-SRC-0020', 'cofen 358/2009'),
  ('atom-cita-politicaapp-CKO-SRC-0001', 'politicaapp', 'CKO-SRC-0001', 'lei 13709/2018'),
  ('atom-cita-copsoq3-FRAME-COPSOQ3', 'copsoq3', 'FRAME-COPSOQ3', 'copsoq iii');

insert into content_atom (id, slug, origin, fundamento_id, statement, locator, status)
select
  cited.id,
  cited.slug,
  'normativo',
  cited.fundamento_id,
  'O texto em português cita ' || cited.cited || '. A cláusula não entra.',
  'content_text:' || cited.slug || ':pt-BR',
  'candidato'
from cited_source as cited
where exists (select 1 from content_object as object where object.slug = cited.slug)
  and exists (select 1 from fundamento where fundamento.id = cited.fundamento_id)
on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'tool_related_related_fkey') then
    alter table tool_related
      add constraint tool_related_related_fkey foreign key (related_slug) references source_tool (slug);
  end if;
end $$;

update schema_column
set ref_entity = 'source_tool',
    definition = 'Outro instrumento. A chave existe em source_tool.'
where entity = 'tool_related' and name = 'related_slug';

insert into schema_relation (from_entity, name, to_entity, cardinality, from_column, to_column, definition)
values ('source_tool', 'citados', 'tool_related', '1:N', 'slug', 'related_slug', 'Um instrumento pode ser citado por outros. O slug citado precisa existir.')
on conflict (from_entity, name) do nothing;
