-- A ficha de download traz o número no título. A cláusula não entra.

insert into fundamento (id, name, domain, right_name, priority, support_id)
values ('CITE-PORTARIA-6734-2025', 'PORTARIA 6734/2025', 'citado', 'citado na ficha', 'candidato', 'politica-referencia-citada')
on conflict (id) do nothing;

insert into content_atom (id, slug, origin, fundamento_id, statement, locator, status)
select cited.id, cited.slug, 'normativo', cited.fundamento_id,
  'O título da ficha cita este identificador. A cláusula não entra.',
  'content_text:' || cited.slug || ':pt-BR:title',
  'candidato'
from (values
  ('atom-cita-biblioteca-portaria-mte-n-1-419-nr-01-CITE-PORTARIA-1419-2024', 'biblioteca/portaria-mte-n-1-419-nr-01', 'CITE-PORTARIA-1419-2024'),
  ('atom-cita-biblioteca-2024-ministerio-do-trabalho-e-emprego-portaria-mte-no-1-419-de-27-de-agosto-de-2024-CITE-PORTARIA-1419-2024', 'biblioteca/2024-ministerio-do-trabalho-e-emprego-portaria-mte-no-1-419-de-27-de-agosto-de-2024', 'CITE-PORTARIA-1419-2024'),
  ('atom-cita-biblioteca-2024-conselho-federal-de-enfermagem-cofen-resolucao-cofen-no-736-de-17-de-janeiro-de-2024-CKO-SRC-0019', 'biblioteca/2024-conselho-federal-de-enfermagem-cofen-resolucao-cofen-no-736-de-17-de-janeiro-de-2024', 'CKO-SRC-0019'),
  ('atom-cita-biblioteca-2024-conselho-federal-de-enfermagem-cofen-resolucao-cofen-no-736-de-17-de-janeiro-de-2024-2-CKO-SRC-0019', 'biblioteca/2024-conselho-federal-de-enfermagem-cofen-resolucao-cofen-no-736-de-17-de-janeiro-de-2024-2', 'CKO-SRC-0019'),
  ('atom-cita-biblioteca-resolucao-cofen-n-736-17-de-janeiro-de-2024-implementacao-do-processo-de-enfermagem-CKO-SRC-0019', 'biblioteca/resolucao-cofen-n-736-17-de-janeiro-de-2024-implementacao-do-processo-de-enfermagem', 'CKO-SRC-0019'),
  ('atom-cita-biblioteca-resolucao-cofen-n-736-17-de-janeiro-de-2024-implementacao-do-processo-de-enfermagem-2-CKO-SRC-0019', 'biblioteca/resolucao-cofen-n-736-17-de-janeiro-de-2024-implementacao-do-processo-de-enfermagem-2', 'CKO-SRC-0019'),
  ('atom-cita-biblioteca-resolucao-cofen-n-564-2017-cofen-codigo-de-etica-dos-profissionais-de-enfermagem-CKO-SRC-0018', 'biblioteca/resolucao-cofen-n-564-2017-cofen-codigo-de-etica-dos-profissionais-de-enfermagem', 'CKO-SRC-0018'),
  ('atom-cita-biblioteca-resolucao-cofen-1-2024-CITE-COFEN-01-2024', 'biblioteca/resolucao-cofen-1-2024', 'CITE-COFEN-01-2024'),
  ('atom-cita-biblioteca-2025-ministerio-da-saude-portaria-gmms-no-6-734-de-18-de-marco-de-2025-CITE-PORTARIA-6734-2025', 'biblioteca/2025-ministerio-da-saude-portaria-gmms-no-6-734-de-18-de-marco-de-2025', 'CITE-PORTARIA-6734-2025')
) as cited(id, slug, fundamento_id)
where exists (select 1 from content_object as object where object.slug = cited.slug)
  and exists (select 1 from fundamento where fundamento.id = cited.fundamento_id)
on conflict (id) do nothing;
